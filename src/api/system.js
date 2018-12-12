import request from '@/utils/request'
import { kebabCaseData2Camel, getUpdatedObj, str2Bool } from '@/utils'

// module--币币交易
// 列表
export function dealFetchAll(query) {
  return request({
    url: '/targetMarketCoin/admin/getMarketTargetCoinListByAdmin',
    method: 'get',
    params: query
  })
}

// module--币币交易
// 创建
export function dealCreate(query) {
  query = kebabCaseData2Camel(query)
  return request({
    url: '/targetMarketCoin/admin/create',
    method: 'post',
    params: query
  })
}

// module--币币交易
// 更新
export function dealUpdate(query) {
  query = kebabCaseData2Camel(query)
  return request({
    url: '/targetMarketCoin/admin/updateById/' + query.id,
    method: 'post',
    params: query
  })
}

// module--币币交易
// 删除
export function dealDelete(id) {
  return request({
    url: '/targetMarketCoin/admin/deleteById/' + id,
    method: 'post'
  })
}

// module--币币交易
// 恢复
export function dealRecover(id) {
  return request({
    url: '/targetMarketCoin/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--充值、提现
// 获取所有的数字币信息
export function coinFetchAll(query) {
  return request({
    url: '/coin/admin/queryAll',
    method: 'get',
    params: query
  })
}

// 创建一条数字币信息
export function coinCreate(query) {
  return request({
    url: '/coin/admin/create',
    method: 'post',
    params: query
  })
}

// 根据id删除一条数字币信息
export function coinDeleteById(id) {
  return request({
    url: '/coin/admin/deleteById/' + id,
    method: 'post'
  })
}

// 根据id删除一条数字币信息
export function coinUpdateById(query) {
  return request({
    url: '/coin/admin/updateById/' + query.id,
    method: 'post',
    params: query
  })
}

// 根据id恢复一条数字币信息
export function coinRecoverById(id) {
  return request({
    url: '/coin/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--区域代码管理
// 列表
export function areaCodeFetchAll(query) {
  return request({
    url: '/countryArea/admin/queryAllByAdmin',
    method: 'get',
    params: query
  })
}

// module--区域代码管理
// 增加
export function areaCodeCreate(query) {
  const para = Object.assign({}, query)
  para.is_trade = str2Bool(para.is_trade)
  return request({
    url: '/countryArea/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--区域代码管理
// 删除
export function areaCodeDelete(id) {
  return request({
    url: '/countryArea/admin/deleteById/' + id,
    method: 'post'
  })
}

// module--区域代码管理
// 更新
export function areaCodeUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para.is_trade = str2Bool(para.is_trade)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/countryArea/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--区域代码管理
// 恢复
export function areaCodeRecover(id) {
  return request({
    url: '/countryArea/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--通用法币管理
// 列表
export function rateFetchAll(query) {
  return request({
    url: '/currency/admin/getlegalTenderListByAdmin',
    method: 'get',
    params: query
  })
}

// module--通用法币管理
// 增加
export function rateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/currency/admin/saveOrUpdatelegalTender',
    method: 'post',
    params: para
  })
}

// module--通用法币管理
// 删除
export function rateDelete(id) {
  return request({
    url: '/currency/admin/dellegalTenderById',
    method: 'post',
    params: { id }
  })
}

// module--通用法币管理
// 更新
export function rateUpdate(tempInfo, oldObj) {
  const para = {
    id: tempInfo.id,
    code: tempInfo.code,
    name: tempInfo.name,
    symbol: tempInfo.symbol,
    usdCurrencyExchangeRate: tempInfo.usdCurrencyExchangeRate,
    isTrade: tempInfo.isTrade
  }
  return request({
    url: '/currency/admin/saveOrUpdatelegalTender',
    method: 'post',
    params: para
  })
}

// module--通用法币管理
// 恢复
export function rateRecover(id) {
  return request({
    url: '/currency/admin/recoverylegalTenderById',
    method: 'post',
    params: { id }
  })
}
