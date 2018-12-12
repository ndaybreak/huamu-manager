import request from '@/utils/request'
import { kebabCaseData2Camel } from '@/utils'

// module--分类管理
// 列表
export function categoryFetchAll(query) {
  return request({
    url: '/managementSystem/admin/queryHelpCenterAfterEnd',
    method: 'post',
    params: query
  })
}

// module--分类管理
// 新增
export function categoryCreate(query) {
  return request({
    url: '/managementSystem/admin/saveHelpCenterCatelog',
    method: 'post',
    params: kebabCaseData2Camel(query)
  })
}

// module--分类管理
// 编辑
export function categoryUpdate(query) {
  return request({
    url: '/managementSystem/admin/updateCatelogContentByid',
    method: 'post',
    params: kebabCaseData2Camel(query)
  })
}

// module--分类管理
// 删除
export function categoryDelete(id) {
  return request({
    url: '/managementSystem/admin/updateHelpCenterCatelogByid',
    method: 'post',
    params: { id }
  })
}

// module--帮助列表
// 列表
export function helpListFetchAll(query) {
  return request({
    url: '/managementSystem/admin/queryHelpCenterTitle',
    method: 'post',
    params: query
  })
}

// module--帮助列表
// 删除
export function helpListDelete(id) {
  return request({
    url: '/managementSystem/admin/updateInfoTitleByid',
    method: 'post',
    params: { id }
  })
}

// module--帮助详情
// 详情
export function helpDetailFetch(id) {
  return request({
    url: '/managementSystem/admin/queryHelpCenterInfoTitleByid',
    method: 'post',
    params: { id }
  })
}

// module--帮助详情
// 新增
export function helpDetailCreate(query) {
  const para = {
    helpCenterList: [query]
  }
  return request({
    url: '/managementSystem/admin/saveHelpCenterInfoTitle',
    method: 'post',
    data: para
  })
}

// module--帮助详情
// 编辑
export function helpDetailUpdate(query) {
  const para = {
    helpCenterList: [query]
  }
  return request({
    url: '/managementSystem/admin/updateHelpCenterInfoTitleByid',
    method: 'post',
    data: para
  })
}

// module--帮助列表
// 推荐
export function helpRecomend(para) {
  return request({
    url: '/managementSystem/admin/updateHelpCenterRecommend',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}
