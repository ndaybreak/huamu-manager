import request from '@/utils/request'
import { kebabCaseData2Camel, getUpdatedObj } from '@/utils'

// module--推送记录
// 列表
export function recordFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryWhereAccountId',
    method: 'post',
    params: query
  })
}

// module--推送记录详情
// 短信
export function smRecordFetchAll(query) {
  return request({
    url: '/admin/managementSystem/querySmsTimeInterval',
    method: 'post',
    params: query
  })
}

// module--推送记录详情
// email
export function emailRecordFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryEmailTimeInterval',
    method: 'post',
    params: query
  })
}

// module--短信模板
// 列表
export function smTempateFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryTemplateSms',
    method: 'post',
    params: query
  })
}

// module--短信模板
// 增加
export function smTempateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/admin/managementSystem/saveTemplateSms',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--短信模板
// 删除
export function smTempateDelete(id) {
  // return request({
  //   url: '/coinFeeRate/admin/deleteById/' + id,
  //   method: 'delete'
  // })
}

// module--短信模板
// 更新
export function smTempateUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/admin/managementSystem/updateTemplateSms',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--邮件模板
// 列表
export function emailTempateFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryTemplateEmail',
    method: 'post',
    params: query
  })
}

// module--邮件模板
// 增加
export function emailTempateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/admin/managementSystem/saveTemplateEmail',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--邮件模板
// 删除
export function emailTempateDelete(id) {
  // return request({
  //   url: '/coinFeeRate/admin/deleteById/' + id,
  //   method: 'delete'
  // })
}

// module--邮件模板
// 更新
export function emailTempateUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/admin/managementSystem/updateTemplateEmail',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}
