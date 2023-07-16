// 入口函数
// 1/创建koa的实例对象
const Koa = require('koa')
const app = new Koa()

// 2、绑定中间件
// 绑定第一层中间件
const requestduration = require('./middleware/koa_response_duration')
app.use(requestduration)
// 绑定第二层中间件
const requestHeader = require('./middleware/koa_response_header')
app.use(requestHeader)
// 绑定第三层中间件
const requestData = require('./middleware/koa_response_data')
app.use(requestData)
// 3、监听端口
app.listen(8888, () => {
  console.log('服务器启动成功')
})
const webSocketService = require('./web_socket_service')
// 开启服务端的监听
webSocketService.listen()
