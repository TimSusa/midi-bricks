const express = require( 'express')
const path = require( 'path')
//const favicon = require( 'serve-favicon')
const cookieParser = require( 'cookie-parser')
const bodyParser = require( 'body-parser')
//const localtunnel = require( 'localtunnel')
//const log = require('electron-log')
const index = require(path.join(__dirname, 'routes', 'index'))
const users = require(path.join(__dirname, 'routes', 'users'))

const app = express()
let tunnelUrl = null

function getTunnelUrl(){
  return tunnelUrl
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// Activate tunnel URL
// (async () => {
//   const tunnel = await localtunnel({ port: 3002 })

//   // the assigned public url for your tunnel
//   // i.e. https://abcdefgjhij.localtunnel.me
//   console.log(tunnel.url)
//   log.info(tunnel.url)
//   tunnelUrl = tunnel.url
//   tunnel.on('close', () => {
//     // tunnels are closed
//   })
// })()

module.exports = {app, getTunnelUrl}
