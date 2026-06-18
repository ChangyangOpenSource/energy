/**
 * 浏览器缓存
 */




/**
 * 缓存语言key
 */
export function set_langKey(data) {
  localStorage.setItem('langKey', data)
}

/**
* 获取语言key
*/
export function get_langKey() {
  return localStorage.getItem('langKey')
}

/**
* 移除语言key
*/
export function remove_langKey() {
  localStorage.removeItem('langKey')
}



/**
 * 缓存碳排因子搜索记录
 */
export function set_TPYZ_SearchRecords(data) {
    localStorage.setItem('TPYZ_SearchRecords', JSON.stringify(data))
}

/**
 * 获取碳排因子搜索记录
 */
export function get_TPYZ_SearchRecords() {
    return JSON.parse(localStorage.getItem('TPYZ_SearchRecords'))
}

/**
 * 移除碳排因子搜索记录
 */
export function remove_TPYZ_SearchRecords() {
    localStorage.removeItem('TPYZ_SearchRecords')
}


/**
 * 缓存产品碳足迹-碳足迹看板-查看更多的产品id
 */
export function set_TPYZ_ProductId(data) {
    localStorage.setItem('TPYZ_productId', data)
}

/**
 * 获取产品碳足迹-碳足迹看板-查看更多的产品id
 */
export function get_TPYZ_ProductId() {
    return localStorage.getItem('TPYZ_productId')
}

/**
 * 存储产品碳足迹-碳足迹看板-设置跳转路径来源（如果是看板页面跳过来，则返回看板页面）
 */
export function set_From_Flag(data) {
  return localStorage.setItem('From_Flag', data)
}

/**
 * 获取产品碳足迹-碳足迹看板-设置跳转路径来源（如果是看板页面跳过来，则返回看板页面）
 */
export function get_From_Flag() {
  return localStorage.getItem('From_Flag')
}

/**
 * 删除产品碳足迹-碳足迹看板-设置跳转路径来源（如果是看板页面跳过来，则返回看板页面）
 */
export function remove_From_Flag() {
  return localStorage.removeItem('From_Flag')
}

/**
 * 移除产品碳足迹-碳足迹看板-查看更多的产品id
 */
export function remove_TPYZ_ProductId() {
    localStorage.removeItem('TPYZ_productId')
}