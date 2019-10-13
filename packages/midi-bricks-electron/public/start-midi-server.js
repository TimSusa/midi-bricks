const log = require('electron-log')
const {app} = require('./configure-midi-server.js')
const debug = require('debug')('config:server')
const http = require('http')

log.transports.console.level = 'info'
log.transports.file.level = 'info'

log.info('inside child express process...')

module.exports = {
  startMidiServer
}
/**
 * Get port from environment and store in Express.
 */
// Port 4332 is currently unassigned and not widely used
// We will use it as a default HTTP channel
const port = normalizePort(3002 || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)


function startMidiServer () {
/**
 * Listen on provided port, on all network interfaces.
 */

  if (!server.listening) {
    log.info('listenting... ', port)
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  } else {
    log.info('Server already running on ', port)
  }
}

function stopMidiServer (){
  server.stop()  
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const localPort = parseInt(val, 10)

  if (isNaN(localPort)) {
    // named pipe
    return val
  }

  if (localPort >= 0) {
    // localPort number
    return localPort
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${  port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${  addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}
