import { isArray, isNotBlank } from '@/utils/util'

export function convertTreeData (data) {
  function convert (node) {
    if (isNotBlank(node.icon)) {
      node.slots = { icon: node.icon }
    }
    node.key = node.id
    return node
  }

  for (let i = 0; i < data.length; i += 1) {
    if (isArray(data[i].children)) {
      data[i].children = convertTreeData(data[i].children)
    }
    data[i] = convert(data[i])
  }
  return data
}

/**
 * 获取指定节点
 *
 * @param treeData {array} 树数据
 * @param nodeKey {string} 节点key
 * @return {*}
 */
export function getTreeNode (treeData, nodeKey) {
  let node = null
  function queryNode (item, key) {
    for (let i = 0; i < item.length; i += 1) {
      if (item[i].key === key) {
        node = item[i]
        break
      }
      if (isArray(item[i].children)) {
        queryNode(item[i].children, key)
      }
    }
  }
  queryNode(treeData, nodeKey)
  return node
}

/**
 * 更新节点信息
 *
 * @param treeData {array} 树数据
 * @param data {object} 新数据
 */
export function updateTreeNode (treeData, data) {
  Object.assign(getTreeNode(treeData, data.key), data)
}

/**
 * 更新叶子节点状态
 *
 * @param treeData {array} 树数据
 * @param key {string} 节点key
 */
export function updateTreeNodeLeaf (treeData, key) {
  const node = getTreeNode(treeData, key)
  if (node) {
    node.isLeaf = !(node.children && node.children.length > 0)
  }
}

/**
 * 更新叶子节点状态
 *
 * @param node {object} node
 */
export function updateNodeLeaf (node) {
  if (node) {
    node.isLeaf = !(node.children && node.children.length > 0)
  }
}

/**
 * 删除树数据
 *
 * @param treeData {array} 树数据
 * @param keys {array} 要删除的keys
 */
export function removeTreeNode (treeData, keys) {
  for (let i = 0; i < treeData.length; i += 1) {
    if (keys.indexOf(treeData[i].key) > -1) {
      treeData.splice(i, 1)
    }
    if (isArray(treeData[i] ? treeData[i].children : null)) {
      removeTreeNode(treeData[i].children, keys)
    }
  }
}

/**
 * 获取节点中所有图标
 *
 * @param treeData {array} 节点数据
 * @param iconArrays {array} 图标数据
 */
export function generatorNodeIcon (treeData, iconArrays) {
  treeData.map((item) => {
    addIcon(item.icon, iconArrays)
    if (item.children) {
      iconArrays = generatorNodeIcon(item.children, iconArrays)
    }
  })

  function addIcon (icon, iconArrays) {
    if (icon) {
      let isHaving = false
      iconArrays.map((item) => {
        if (item === icon) {
          isHaving = true
        }
      })
      if (!isHaving) {
        iconArrays.push(icon)
      }
    }
  }
  return iconArrays
}

export function getAllKeys (treeData) {
  const keys = []
  function queryNode (item, _keys) {
    for (let i = 0; i < item.length; i += 1) {
      _keys.push(item[i].key)
      if (isArray(item[i].children)) {
        queryNode(item[i].children, _keys)
      }
    }
  }
  queryNode(treeData, keys)
  return keys
}

/**
 * 拖动节点
 *
 * @param treeData 节点数据
 * @param info @drop 事件参数
 * @return {{parent: string, data: array, loadDataNode: object | null, id: string, oldParent: string, position: number, oldPosition: number}}
 */
export function dropNode (treeData, info) {
  const dropKey = info.node.eventKey
  const dragKey = info.dragNode.eventKey
  const dropPos = info.node.pos.split('-')
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
  let position = 0
  let parent
  let loadDataNode = null
  const loop = (data, key, callback) => {
    data.forEach((item, index, arr) => {
      if (item.key === key) {
        return callback(item, index, arr)
      }
      if (item.children) {
        return loop(item.children, key, callback)
      }
    })
  }
  const data = [...treeData]

  // 获取拖动的数据对象，并在数组中移除
  let dragObj = null
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1)
    dragObj = item
  })
  if (!info.dropToGap) {
    // 拖动到一个节点中
    if (info.node.getNodeChildren().length === 0) {
      // 没有子节点，可能是未加载
      position = 0
      loadDataNode = info.node.dataRef
    } else {
      loop(data, dropKey, item => {
        item.children = item.children || []
        position = item.children.length
        // 添加到尾部，可以是随意位置
        item.children.push(dragObj)
      })
    }
    parent = dropKey
  } else if (
    (info.node.children || []).length > 0 && // 有子节点
    info.node.expanded && // 展开的
    dropPosition === 1 // 放到最下面的
  ) {
    loop(data, dropKey, item => {
      item.children = item.children || []
      position = item.children.length
      // 添加到尾部，可以是随意位置
      item.children.unshift(dragObj)
    })
    parent = dropKey
  } else {
    parent = info.node.$parent.eventKey
    let ar = null; let i = null
    loop(data, dropKey, (item, index, arr) => {
      ar = arr
      i = index
    })
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj)
      position = i
    } else {
      ar.splice(i + 1, 0, dragObj)
      position = i + 1
    }
  }

  updateTreeNodeLeaf(data, info.dragNode.$parent.eventKey)
  updateTreeNodeLeaf(data, parent)

  return {
    data,
    loadDataNode,
    id: dragKey,
    parent,
    oldParent: info.dragNode.$parent.eventKey,
    position,
    oldPosition: Number(info.dragNode.pos.split('-')[info.dragNode.pos.split('-').length - 1])
  }
}
