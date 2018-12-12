import request from '@/utils/request'

// 法币OTC交易明细查询
export function otcFetchAll(query) {
  return request({
    url: '/trade/admin/getOtcOrderListByAdmin',
    method: 'get',
    params: query
  })
}

// 币币交易明细查询
export function coin2coinFetchAll(query) {
  return request({
    url: '/trade/admin/getCoinOrderListByAdmin',
    method: 'get',
    params: query
  })
}

// 商户保证金明细查询
export function depositFetchAll(query) {
  return request({
    url: '/merchantDeposit/admin/getLog',
    method: 'get',
    params: query
  })
}

// 客户权限等级日志
export function customerLevelLog(query) {
  return request({
    url: '/customerLevel/admin/log/query',
    method: 'get',
    params: query
  })
}

// 商户权限等级日志
export function merchantLevelLog(query) {
  return request({
    url: '/merchantLevel/admin/log/query',
    method: 'get',
    params: query
  })
}

// 经纪人权限等级日志
export function agentLevelLog(query) {
  return request({
    url: '/agentLevel/admin/log/query',
    method: 'get',
    params: query
  })
}

// 客户资产变动日志
export function customerAssetChangeLog(query) {
  return request({
    url: '/coinAssetLog/admin/getList',
    method: 'get',
    params: query
  })
}

// 客户资产余额明细
export function customerBalanceLog(query) {
  return request({
    url: '/coinAsset/admin/getList',
    method: 'get',
    params: query
  })
}

// 经纪人分佣
export function agentCommissionFetchAll(query) {
  return request({
    url: '/commission/admin/getCommissionListByAdmin',
    method: 'get',
    params: query
  })
}
