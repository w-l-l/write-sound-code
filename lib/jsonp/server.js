const http = require('http')
const url = require('url')

http.createServer((request, response) => {
  const urlObj = url.parse(request.url, true)
  if(urlObj.pathname === '/jsonp') {
    const callbackName = urlObj.query.callback
    const data = { name: 'jsonp' }
    response.end(`${callbackName}(${JSON.stringify(data)})`)
  } else {
    response.end('404')
  }
}).listen(3000, _ => console.log('服务器启动成功...'))
