import request from '@/utils/request'
import { filterEmptyAttr } from '@/utils'
import { kebabCaseData2Camel } from '@/utils'

// module--申诉仲裁
// 申诉仲裁列表  查询条件：订单状态筛选 ,申诉状态筛选,申诉时间排序,申诉更新时间排序
export function appealFetchAll(query) {
  query = filterEmptyAttr(query)
  return request({
    url: '/admin/managementSystem/queryWhereAppeal',
    method: 'post',
    params: query
  })
}

// 申诉明细 :根据id查看具体信息
export function appealFetchDetail(query) {
  return request({
    url: '/admin/managementSystem/queryAppealByidDetail',
    method: 'post',
    params: query
  })
}

// 申诉操作--取消订单
export function appealCancelOrder(id) {
  return request({
    url: '/admin/managementSystem/queryAdministratorOperation ',
    method: 'post',
    params: { id }
  })
}

// 申诉操作--转移资金
export function appealTansferMoney(id) {
  return request({
    url: '/admin/managementSystem/queryAdminFundsTransfer',
    method: 'post',
    params: { id }
  })
}

// 追加处理意见
export function appealAddOpinion(query) {
  return request({
    url: '/admin/managementSystem/saveAppealOpinion',
    method: 'post',
    params: query
  })
}

// module--客户反馈
// 意见反馈: 处理状态筛选,问题类型筛选 ,邮箱筛选,客户帐号筛选,时间倒序
export function feedbackFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryWhereFeedback',
    method: 'post',
    params: query
  })
}

// 意见反馈明细
export function feedbackFetchDetail(query) {
  return request({
    url: '/admin/managementSystem/queryByidFeedback',
    method: 'post',
    params: query
  })
}

// 回复邮件
export function feedbackReplyEmail(query) {
  return request({
    url: '/admin/managementSystem/saveAppealAnswerEmail',
    method: 'post',
    data: {
      emailAnswerList: [query]
    }
  })
}

// 客户反馈 完成
export function feedbackDone(query) {
  return request({
    url: '/admin/managementSystem/updateAppealStatus',
    method: 'post',
    params: query
  })
}

// 联系我们
// 获取系统信息
export function fetchSystemInfo() {
  return request({
    url: '/systemInfo/public/getInfo',
    method: 'get'
  })
}

// 联系我们
// 修改系统信息
export function updateSystemInfo(data) {
  const para = kebabCaseData2Camel(data)
  return request({
    url: '/systemInfo/admin/update',
    method: 'post',
    params: {
      phoneNumber: para.phoneNumber,
      email: para.email,
      website: para.website
    }
  })
}
