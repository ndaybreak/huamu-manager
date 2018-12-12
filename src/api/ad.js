import request from '@/utils/request'
import { kebabCaseData2Camel } from '@/utils'

// module--首页推荐
// 列表
export function recommendFetchAll(query) {
  return request({
    url: '/recommend/admin/getRecommendCoinListByAdmin',
    method: 'get',
    params: query
  })
}

// module--首页推荐
// 创建
export function recommendCreate(query) {
  query = kebabCaseData2Camel(query)
  return request({
    url: '/recommend/admin/saveOrUpdateRecommendCoin',
    method: 'post',
    params: query
  })
}

// module--首页推荐
// 更新
export function recommendUpdate(query) {
  query = kebabCaseData2Camel(query)
  const para = {
    id: query.id,
    sortNum: query.sortNum,
    targetCoinId: query.targetCoinId,
    marketCoinId: query.marketCoinId
  }
  return request({
    url: '/recommend/admin/saveOrUpdateRecommendCoin',
    method: 'post',
    params: para
  })
}

// module--首页推荐
// 删除
export function recommendDelete(id) {
  return request({
    url: '/recommend/admin/delRecommendCoin',
    method: 'post',
    params: { id }
  })
}

// module--首页推荐
// 恢复
export function recommendRecover(id) {
  return request({
    url: '/recommend/admin/recoveryRecommendCoin',
    method: 'post',
    params: { id }
  })
}

// module--首页banner
// 列表
export function bannerFetchAll(query) {
  return request({
    url: '/ad/admin/getAdvertisementListByAdmin',
    method: 'get',
    params: query
  })
}

// module--首页banner
// 创建
export function bannerCreate(query) {
  query = kebabCaseData2Camel(query)
  query.lang = query.language
  return request({
    url: '/ad/admin/saveOrUpdateAdvertisement',
    method: 'post',
    params: query
  })
}

// module--首页banner
// 更新
export function bannerUpdate(query) {
  query = kebabCaseData2Camel(query)
  const para = {
    id: query.id,
    logo: query.logo,
    link: query.link,
    info: query.info,
    sortNum: query.sortNum,
    lang: query.language
  }
  return request({
    url: '/ad/admin/saveOrUpdateAdvertisement',
    method: 'post',
    params: para
  })
}

// module--首页banner
// 删除
export function bannerDelete(id) {
  return request({
    url: '/ad/admin/delAdvertisement',
    method: 'post',
    params: { id }
  })
}

// module--首页banner
// 恢复
export function bannerRecover(id) {
  return request({
    url: '/ad/admin/recoveryAdvertisement',
    method: 'post',
    params: { id }
  })
}
