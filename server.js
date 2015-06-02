var restify = require('restify')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'indra-collection-server'});
var isValid = require('./indraSchemaValidator.js')
var config = require('./config.js')

// config
var port = 23023

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

function handleRequest (req, res, next) {
  if (isValid(req.body) && req.params.channel) {
    res.send(201)
    return next();
  }
  else {
    log.warn('bad schema -> %s', JSON.stringify(req.body));
    return next(new restify.UnprocessableEntityError(config.unprocessableEntityErrorMessage));
  }
  // log.warn('error saving data -> %s', err);
  // return next(new restify.BadRequestError(config.badRequestErrorMessage));
}

// lazily coded 'channels'
server.post('/post/:channel', handleRequest)

server.listen(port)
log.info('listening on %s', port)
