export default class SocketService {
  // 单例
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }
  //定义判断是否连接服务器成功
  connected = false
  // 定义连接超时重连次数
  sendRetryCount = 0
  // 当服务器关闭时，发起重连次数
  connectRetryCount = 0
  ws = null
  //创建连接
  connect() {
    if (!window.WebSocket) {
      return console.log('你的浏览器版本不支持webSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')
    this.ws.onopen = () => {
      // 连接成功
      this.connected = true
      // 连接失败后置零
      this.connectRetryCount = 0
      console.log('连接成功')
    }
    this.ws.onclose = () => {
      // 连接失败
      this.connected = false
      console.log('连接失败')
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500)
    }
    this.ws.onmessage = (msg) => {
      //  获取服务端响应回来的数据进行解析
      const recvData = JSON.parse(msg.data)
      //   读取数据中的关键字
      const socketType = recvData.socketType
      //   判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  //   存储回调函数
  callBackMapping = {}
  //   回调函数的注册
  regiestCallback(socketType, callback) {
    this.callBackMapping[socketType] = callback
  }
  unregiestCallback(socketType) {
    this.callBackMapping[socketType]
  }
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
