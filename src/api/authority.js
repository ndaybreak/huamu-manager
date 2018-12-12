import request from '@/utils/request'
import { kebabCaseData2Camel } from '@/utils'

// module--角色设置
// 列表
export function roleFetchAll(query) {
  return request({
    url: '/managerRole/admin/role/getList',
    method: 'get',
    params: query
  })
}

// module--角色设置
// 创建
export function roleCreate(query) {
  return request({
    url: '/managerRole/admin/role/create',
    method: 'post',
    data: query
  })
}

// module--角色设置
// 更新
export function roleUpdate(query) {
  query = kebabCaseData2Camel(query)
  return request({
    url: '/managerRole/admin/role/update/' + query.id,
    method: 'post',
    data: query
  })
}

// module--角色设置
// 删除
export function roleDelete(id) {
  return request({
    url: '/managerRole/admin/role/delete/ ' + id,
    method: 'delete'
  })
}

// module--人员管理
// 角色dropdown
export function getRoleDropDownList() {
  return request({
    url: '/managerRole/admin/role/getDropDownList',
    method: 'get'
  })
}

// module--人员管理
// 列表
export function userFetchAll(query) {
  return request({
    url: '/managerRole/admin/getManagerList',
    method: 'get',
    params: query
  })
}

// module--人员管理
// 创建
export function userCreate(query) {
  query = kebabCaseData2Camel(query)
  return request({
    url: '/managerRole/admin/createManager',
    method: 'post',
    params: query
  })
}

// module--人员管理
// 更新
export function userUpdate(query) {
  query = kebabCaseData2Camel(query)
  const para = {
    id: query.id,
    name: query.name,
    fullName: query.fullName,
    roleId: query.roleId,
    gender: query.gender,
    isEnable: query.isEnable
  }
  return request({
    url: '/managerRole/admin/updateManager/' + query.id,
    method: 'post',
    params: para
  })
}

// module--人员管理
// 删除
export function userDelete(id) {
  return request({
    url: '/managerRole/admin/deleteManager/' + id,
    method: 'delete'
  })
}

// module--人员管理
// 重置密码
export function resetPwd(id) {
  return request({
    url: '/adminAccount/admin/updateResetPasswordManagement',
    method: 'post',
    params: { id }
  })
}
