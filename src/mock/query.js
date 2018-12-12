import Mock from 'mockjs'

const List = []
const List2 = []
const count = 13

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: 'Z@integer(3000, 7000)',
    time: '@integer(1530272591194, 1531292691194)',
    uid: 'U@integer(1000, 9000)',
    'coinCategory|1': ['BTC', 'ETH', 'LTC'],
    money: '@integer(3, 200)',
    'direction|1': ['Buy', 'Sell']
  }))
}
List.push(Mock.mock({
  id: 'Z@integer(3000, 7000)',
  time: '@integer(1530272591194, 1531292691194)',
  uid: 'U@integer(1000, 9000)',
  'coinCategory|1': ['BTC', 'ETH', 'LTC'],
  money: '5847',
  'direction|1': ['Buy', 'Sell']
}))
List.push(Mock.mock({
  id: 'Z@integer(3000, 7000)',
  time: '@integer(1530272591194, 1531292691194)',
  uid: 'U@integer(1000, 9000)',
  'coinCategory|1': ['BTC', 'ETH', 'LTC'],
  money: '3582',
  'direction|1': ['Buy', 'Sell']
}))

for (let i = 0; i < 10; i++) {
  List2.push(Mock.mock({
    id: 'Z@integer(5000, 9000)',
    time: '@integer(1530275591194, 1531292610194)',
    uid: 'U@integer(3000, 7000)',
    'coinCategory|1': ['BTC', 'ETH', 'LTC'],
    'money|1-10.6': 1.000,
    'direction|1': ['Buy', 'Sell']
  }))
}
List2.push(Mock.mock({
  id: 'Z@integer(5000, 9000)',
  time: '@integer(1530275591194, 1531292610194)',
  uid: 'U@integer(3000, 7000)',
  'coinCategory|1': ['BNB'],
  'money|1-10.8': 1.000,
  'direction|1': ['Buy', 'Sell']
}))
List2.push(Mock.mock({
  id: 'Z@integer(3000, 7000)',
  time: '@integer(1530272591194, 1531292691194)',
  uid: 'U@integer(1000, 9000)',
  'coinCategory|1': ['BNB'],
  'money|1-10.8': 1.000,
  'direction|1': ['Buy', 'Sell']
}))
List2.push(Mock.mock({
  id: 'Z@integer(3000, 7000)',
  time: '@integer(1530272591194, 1531292691194)',
  uid: 'U@integer(1000, 9000)',
  'coinCategory|1': ['BTC', 'ETH', 'LTC'],
  'money|90-100.6': 1.000,
  'direction|1': ['Buy', 'Sell']
}))

List.sort((a, b) => {
  return b.money - a.money
})
List2.sort((a, b) => {
  return b.money - a.money
})

export default {
  otcFetchAll: config => {
    return {
      data: List
    }
  },
  coin2coinFetchAll: config => {
    return {
      data: List2
    }
  }
}
