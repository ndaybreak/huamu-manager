(function() {
  function getSearchPara(key) {
    var length,
      arr,
      item,
      href = window.location.href,
      offset = href.indexOf('?'),
      paramStr
    if (offset >= 0) {
      if (href.indexOf('#') === -1) {
        length = href.length
      } else {
        length = href.indexOf('#')
      }
      paramStr = href.substring(offset + 1, length)

      arr = paramStr.split('&')
      for (var i = 0, len = arr.length; i < len; i++) {
        item = arr[i].split('=')
        if (item[0] === key) {
          return item[1]
        }
      }
    }
  }
  var utils = {
    getSearchPara: getSearchPara
  }
  var state = {
    token: getSearchPara('token'),
    isZh: getSearchPara('lang') == 0,
    baseUrl: 'http://192.168.60.199:8080/DaVaoBusiness'
  }
  // 环境配置
  var env = 'prod'
  if (env === 'prod') {
    state.baseUrl = '/DaVaoBusiness'
  }
  var app = {
    utils: utils,
    state: state
  }
  window.app = app
})()
