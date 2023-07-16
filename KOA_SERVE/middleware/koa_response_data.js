// 处理业务逻辑的中间件，用以读取JSON文件
const path = require('path')
const fileUtil = require('../utils/file_util')
module.exports = async (ctx, next) => {
  // 获取用户请求的路径
  const Url = ctx.request.url
  //除去访问路径中的其他路径
  let newpath = Url.replace('/api', '')
  let filePath = '../data' + newpath + '.json'
  filePath = path.join(__dirname, filePath)

  try {
    const ret = await fileUtil.getDataJson(filePath)
    ctx.response.body = ret
  } catch (error) {
    const errMesage = {
      error: '访问失败，没有这个资源',
      status: '404'
    }
    ctx.response.body = JSON.stringify(errMesage)
  }

  await next()
}
