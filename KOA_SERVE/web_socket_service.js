const fileUtils = require('./utils/file_util')
const path = require('path')
const WebSocket = require('ws')
// 创建WebSock服务端的对象，绑定端口号9998
const wss = new WebSocket.Server({
  port: 9998
})
module.exports.listen = () => {
  // 服务端开启了监听
  wss.on('connection', (client) => {
    console.log('有客户端连接成功了。。。。')
    //接收客户端接收数据
    client.on('message', async (mes) => {
      // 将客户端发来的数据转义
      let payload = JSON.parse(mes)
      // 判断payload是否存在客户端发来的getdata
      const action = payload.action
      if (action === 'getData') {
        const Path = './data/' + payload.chartName + '.json'
        const request = path.join(__dirname, Path)
        const ret = await fileUtils.getDataJson(request)
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(payload))
        })
      }
    })
  })
}
