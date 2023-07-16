// 计算服务器消耗时长的中间件
module.exports = async (ctx, next) => {
  // 1、计算进入时间
  const startTime = Date.now()
  // 2、内层中间件执行
  await next()
  // 3、记录出去时间
  const lateTime = Date.now()
  const endTime = lateTime - startTime
  // 4、设置响应头X-Response-Time
  ctx.set('X-Response-Time', endTime + 'ms')
}
