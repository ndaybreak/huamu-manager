import Mock from 'mockjs'

const List = []
const count = 15

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: 'Z@integer(3000, 7000)',
    apply_time: '@integer(1530272591194, 1531292691194)',
    audit_time: '@integer(1530272591194, 1531292691194)',
    uid: 'U@integer(1000, 9000)',
    email: '@first',
    money: '@integer(3, 200)',
    'direction|1': ['Buy', 'Sell']
  }))
}

const info = Mock.mock({
  id: 'Z@integer(3000, 7000)',
  apply_time: '@integer(1530272591194, 1531292691194)',
  audit_time: '@integer(1530272591194, 1531292691194)',
  uid: 'U@integer(1000, 9000)',
  email: '@first',
  money: '@integer(3, 200)',
  'direction|1': ['Buy', 'Sell']
})

export default {
  customerFetchAll: config => {
    return {
      data: List
    }
  },
  customerInfoCheck: config => {
    return {
      data: info
    }
  }
}
