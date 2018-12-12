import request from '@/utils/request'
import { kebabCaseData2Camel, str2Bool, getUpdatedObj } from '@/utils'

// module--客户信息管理
// 列表
export function infoFetchAll(query) {
  return request({
    url: '/account/admin/getAccountList',
    method: 'get',
    params: query
  })
}

// module--客户信息管理
// 详情
export function infoDetail(query) {
  return request({
    url: '/admin/managementSystem/queryUserInformation',
    method: 'post',
    params: query
  })
}

// module--客户信息管理
// 编辑
export function infoUpdate(query) {
  return request({
    url: '/account/admin/updateAccountByAdmin',
    method: 'post',
    params: kebabCaseData2Camel(query)
  })
}

// module--客户信息管理
// 冻结
export function infoFrozen(query) {
  return request({
    url: '/account/admin/freezeAccountByAdmin',
    method: 'post',
    params: query
  })
}

// module--客户信息管理
// 解冻
export function infoUnfrozen(query) {
  return request({
    url: '/account/admin/unfreezeAccountByAdmin',
    method: 'post',
    params: query
  })
}

// module--客户信息管理
// 调增
export function infoAdjustPlus(query) {
  return request({
    url: '/coinAsset/admin/addBalanceToSingleAccount',
    method: 'post',
    params: query
  })
}

// module--客户信息管理
// 调减
export function infoAdjustMinus(query) {
  return request({
    url: '/coinAsset/admin/reduceBalanceToSingleAccount',
    method: 'post',
    params: query
  })
}

// module--客户信息管理
// 活动
export function infoAdjustPlusAll(query) {
  return request({
    url: '/coinAsset/admin/addBalanceToAllAccount',
    method: 'post',
    params: query
  })
}

// 获取经纪人权限ID下拉框
export function getAgentList() {
  return request({
    url: '/agentLevel/public/getDropdownList',
    method: 'get'
  })
}

// 获取交易权限ID下拉框
export function getCustomerList() {
  return request({
    url: '/customerLevel/public/getDropdownList',
    method: 'get'
  })
}

// 获取商户权限ID下拉框
export function getMerchantList() {
  return request({
    url: '/merchantLevel/public/getDropdownList',
    method: 'get'
  })
}

// 获取数字币下拉框
export function getCoinList(query) {
  return request({
    url: '/coin/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// 获取币币交易币种下拉框
export function getMarketCoinList() {
  return request({
    url: '/targetMarketCoin/public/getDropdownlist',
    method: 'get'
  })
}

// module--商户保证金管理(待缴纳)
// 列表
export function depositFetchAll(query) {
  return request({
    url: '/merchantDeposit/admin/getAccountDepositListByAdmin',
    method: 'get',
    params: query
  })
}

// module--商户保证金管理(已缴纳)
// 列表
export function depositDoneFetchAll(query) {
  return request({
    url: '/merchantDeposit/admin/getDepositList',
    method: 'get',
    params: query
  })
}

// module--商户保证金管理
// 缴纳
export function depositPay(query) {
  return request({
    url: '/merchantDeposit/admin/payDeposit',
    method: 'post',
    params: query
  })
}

// module--商户保证金管理
// 退返
export function depositReturn(query) {
  return request({
    url: '/merchantDeposit/admin/returnDeposit',
    method: 'post',
    params: query
  })
}

// module--商户保证金管理
// 扣罚
export function depositPenalty(query) {
  return request({
    url: '/merchantDeposit/admin/takeOffDeposit',
    method: 'post',
    params: query
  })
}

// module--客户权限等级
// 列表
export function customerLevelFetchAll(query) {
  return request({
    url: '/customerLevel/admin/queryAll',
    method: 'get',
    params: query
  })
}

// module--客户权限等级
// 等级dropdown
export function customerLevelDropdown(query) {
  return request({
    url: '/customerLevel/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--客户权限等级
// 充值提现费率模板
export function coinFeeTemplateDropdown(query) {
  return request({
    url: '/coinFeeRateTemplate/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--客户权限等级
// 币币费率模板
export function targetMarketCoinFeeTemplateDropdown(query) {
  return request({
    url: '/targetMarketCoinFeeRateTemplate/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--客户权限等级
// 增加
export function customerLevelCreate(query) {
  const para = Object.assign({}, query)
  para.is_real_name = str2Bool(para.is_real_name)
  para.is_common_otc = str2Bool(para.is_common_otc)
  para.is_big_otc = str2Bool(para.is_big_otc)
  para.is_coin_trade = str2Bool(para.is_coin_trade)
  para.is_recharge = str2Bool(para.is_recharge)
  para.is_withdraw_cash = str2Bool(para.is_withdraw_cash)
  return request({
    url: '/customerLevel/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--客户权限等级
// 删除
export function customerLevelDelete(id) {
  return request({
    url: '/customerLevel/admin/deleteById/' + id,
    method: 'post'
  })
}

// module--客户权限等级
// 更新
export function customerLevelUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para.is_real_name = str2Bool(tempInfo.is_real_name)
  para.is_common_otc = str2Bool(tempInfo.is_common_otc)
  para.is_big_otc = str2Bool(tempInfo.is_big_otc)
  para.is_coin_trade = str2Bool(tempInfo.is_coin_trade)
  para.is_recharge = str2Bool(tempInfo.is_recharge)
  para.is_withdraw_cash = str2Bool(tempInfo.is_withdraw_cash)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/customerLevel/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--客户权限等级
// 恢复
export function customerLevelRecover(id) {
  return request({
    url: '/customerLevel/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--商户权限等级
// 列表
export function merchantLevelFetchAll(query) {
  return request({
    url: '/merchantLevel/admin/queryAll',
    method: 'get',
    params: query
  })
}

// module--商户权限等级
// 等级dropdown
export function merchantLevelDropdown(query) {
  return request({
    url: '/merchantLevel/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--商户权限等级
// otc广告限制模板dropdown
export function otcAdTemplateDropdown(query) {
  return request({
    url: '/otcAdvertLimitTemplate/admin/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--商户权限等级
// 币种dropdown
export function coinCategoryDropdown(query) {
  return request({
    url: '/coin/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--商户权限等级
// 增加
export function merchantLevelCreate(query) {
  const para = Object.assign({}, query)
  para.is_merchant = str2Bool(para.is_merchant)
  para.is_common_ad = str2Bool(para.is_common_ad)
  para.is_big_ad = str2Bool(para.is_big_ad)
  para.is_deposit = str2Bool(para.is_deposit)
  return request({
    url: '/merchantLevel/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--商户权限等级
// 删除
export function merchantLevelDelete(id) {
  return request({
    url: '/merchantLevel/admin/deleteById/' + id,
    method: 'post'
  })
}

// module--商户权限等级
// 更新
export function merchantLevelUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para.is_merchant = str2Bool(para.is_merchant)
  para.is_common_ad = str2Bool(para.is_common_ad)
  para.is_big_ad = str2Bool(para.is_big_ad)
  para.is_deposit = str2Bool(para.is_deposit)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/merchantLevel/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--商户权限等级
// 恢复
export function merchantLevelRecover(id) {
  return request({
    url: '/merchantLevel/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--经纪人权限等级
// 列表
export function agentLevelFetchAll(query) {
  return request({
    url: '/agentLevel/admin/queryAll',
    method: 'get',
    params: query
  })
}

// module--经纪人权限等级
// 等级dropdown
export function agentLevelDropdown(query) {
  return request({
    url: '/agentLevel/public/getDropdownList',
    method: 'get',
    params: query
  })
}

// module--经纪人权限等级
// 增加
export function agentLevelCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/agentLevel/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--经纪人权限等级
// 删除
export function agentLevelDelete(id) {
  return request({
    url: '/agentLevel/admin/deleteById/' + id,
    method: 'post'
  })
}

// module--经纪人权限等级
// 更新
export function agentLevelUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/agentLevel/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--经纪人权限等级
// 恢复
export function agentLevelRecover(id) {
  return request({
    url: '/agentLevel/admin/recoverById/' + id,
    method: 'post'
  })
}

// module--充值提现费率模板
// 列表
export function coinTempateFetchAll(query) {
  return request({
    url: '/coinFeeRateTemplate/admin/getTemplateList',
    method: 'get',
    params: query
  })
}

// module--充值提现费率模板
// 增加
export function coinTempateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/coinFeeRateTemplate/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--充值提现费率模板
// 删除
export function coinTempateDelete(id) {
  return request({
    url: '/coinFeeRateTemplate/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--充值提现费率模板
// 更新
export function coinTempateUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/coinFeeRateTemplate/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--充值提现费率模板
// 复制
export function coinTempateCopy(query) {
  return request({
    url: '/coinFeeRateTemplate/admin/copyTemplateById/' + query.id,
    method: 'post',
    params: {
      name: query.name,
      info: query.info
    }
  })
}

// module--充值提现费率模板详情
// 列表
export function coinTempateDetailFetchAll(query) {
  return request({
    url: '/coinFeeRate/admin/getList',
    method: 'get',
    params: query
  })
}

// module--充值提现费率模板详情
// 增加
export function coinTempateDetailCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/coinFeeRate/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--充值提现费率模板详情
// 删除
export function coinTempateDetailDelete(id) {
  return request({
    url: '/coinFeeRate/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--充值提现费率模板详情
// 更新
export function coinTempateDetailUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/coinFeeRate/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--otc广告限制模板
// 列表
export function otcTempateFetchAll(query) {
  return request({
    url: '/otcAdvertLimitTemplate/admin/getTemplateList',
    method: 'get',
    params: query
  })
}

// module--otc广告限制模板
// 增加
export function otcTempateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/otcAdvertLimitTemplate/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--otc广告限制模板
// 删除
export function otcTempateDelete(id) {
  return request({
    url: '/otcAdvertLimitTemplate/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--otc广告限制模板
// 更新
export function otcTempateUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/otcAdvertLimitTemplate/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--otc广告限制模板
// 复制
export function otcTempateCopy(query) {
  return request({
    url: '/otcAdvertLimitTemplate/admin/copyTemplateById/' + query.id,
    method: 'post',
    params: {
      name: query.name,
      info: query.info
    }
  })
}

// module--otc广告限制模板详情
// 列表
export function otcTempateDetailFetchAll(query) {
  return request({
    url: '/otcAdvertLimit/admin/getList',
    method: 'get',
    params: query
  })
}

// module--otc广告限制模板详情
// 增加
export function otcTempateDetailCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/otcAdvertLimit/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--otc广告限制模板详情
// 删除
export function otcTempateDetailDelete(id) {
  return request({
    url: '/otcAdvertLimit/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--otc广告限制模板详情
// 更新
export function otcTempateDetailUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/otcAdvertLimit/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--币币交易费率模板
// 列表
export function marketCoinTempateFetchAll(query) {
  return request({
    url: '/targetMarketCoinFeeRateTemplate/admin/getTemplateList',
    method: 'get',
    params: query
  })
}

// module--币币交易费率模板
// 增加
export function marketCoinTempateCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/targetMarketCoinFeeRateTemplate/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--币币交易费率模板
// 删除
export function marketCoinTempateDelete(id) {
  return request({
    url: '/targetMarketCoinFeeRateTemplate/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--币币交易费率模板
// 更新
export function marketCoinTempateUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/targetMarketCoinFeeRateTemplate/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--币币交易费率模板
// 复制
export function marketCoinTempateCopy(query) {
  return request({
    url: '/targetMarketCoinFeeRateTemplate/admin/copyTemplateById/' + query.id,
    method: 'post',
    params: {
      name: query.name,
      info: query.info
    }
  })
}

// module--币币交易费率模板详情
// 列表
export function marketCoinTempateDetailFetchAll(query) {
  return request({
    url: '/targetMarketCoinFeeRate/admin/getList',
    method: 'get',
    params: query
  })
}

// module--币币交易费率模板详情
// 增加
export function marketCoinTempateDetailCreate(query) {
  const para = Object.assign({}, query)
  return request({
    url: '/targetMarketCoinFeeRate/admin/create',
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--币币交易费率模板详情
// 删除
export function marketCoinTempateDetailDelete(id) {
  return request({
    url: '/targetMarketCoinFeeRate/admin/deleteById/' + id,
    method: 'delete'
  })
}

// module--币币交易费率模板详情
// 更新
export function marketCoinTempateDetailUpdate(tempInfo, oldObj) {
  let para = Object.assign({}, tempInfo)
  para = getUpdatedObj(para, oldObj)
  return request({
    url: '/targetMarketCoinFeeRate/admin/updateById/' + para.id,
    method: 'post',
    params: kebabCaseData2Camel(para)
  })
}

// module--客户充值地址管理
// 查询
export function rechargeAddressFetchAll(query) {
  return request({
    url: '/rechargeAddress/admin/getAddressList',
    method: 'get',
    params: query
  })
}
// module--客户充值地址管理
// 停用
export function rechargeAddressDelete(id) {
  return request({
    url: '/rechargeAddress/admin/deleteById/' + id,
    method: 'post'
  })
}
// module--客户充值地址管理
// 恢复
export function rechargeAddressRecover(id) {
  return request({
    url: '/rechargeAddress/admin/recoverById/' + id,
    method: 'post'
  })
}
