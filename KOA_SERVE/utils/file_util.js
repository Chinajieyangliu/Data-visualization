// 读取文件工具方法
const fs = require('fs')
// 该函数用以读取data中的数据
module.exports.getDataJson = (filePath) => {
  //  使用pormise语法通
  return new Promise((resolve, reject) => {
    //   读取传过来的参数，查看本地文件是否存在相应的值
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        // 读取文件失败内容
        reject(err)
      } else {
        // 读取文件成功内容
        resolve(data)
      }
    })
  })
}
