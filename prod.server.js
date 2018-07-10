const Koa =  require('koa')
const serve = require('koa-static')
const path = require('path')
const history = require('koa2-connect-history-api-fallback')
const PORT = process.env.PORT || 3000

const app = new Koa()

app.use(history())
app.use(serve(path.join(__dirname, './dist/spa-mat')))

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}!`)
})
