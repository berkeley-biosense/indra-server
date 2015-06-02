var config = require('./config.js')
var restify = require('restify')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: config.logName})
var isValid = require('./indraSchemaValidator.js')

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

function handleRequest (req, res, next) {
  // valid data + a channel -> send 201 + process data
  if (isValid(req.body)) {
    if (req.params.channel) {
      res.send(201)
      return next();
    // no channel -> 400
    } else {
      log.warn('someone tried to post this no channel -> %s', req.body);
      return next(new restify.BadRequestError(config.badRequestErrorMessage));
    }
  // bad data -> 422
  } else {
    log.warn('bad schema -> %s', JSON.stringify(req.body));
    return next(new restify.UnprocessableEntityError(config.unprocessableEntityErrorMessage));
  }
}

// lazily coded 'channels'
server.post('/post/:channel', handleRequest)

server.listen(config.port)
log.info('listening on %s', config.port)
