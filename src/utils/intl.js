import enLocale from '@/lang/en'
import zhLocale from '@/lang/zh'
import { isZh } from './index'

const getVal = (obj, key) => {
  const list = key.split('.')
  for (var i = 0, len = list.length; i < len; i++) {
    obj = obj[list[i]]
  }
  return obj
}

const intl = (key) => {
  if (isZh()) {
    return getVal(zhLocale, key)
  } else {
    return getVal(enLocale, key)
  }
}

export { intl }
