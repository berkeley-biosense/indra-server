var restify = require('restify')
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'indra-collection-server'});
var isValid = require('./indraSchemaValidator.js')

// config
var port = 23023

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

function handleRequest (req, res, next) {
  if (isValid(req.body) && req.params.channel) {
    log.info('channel -> %s', req.params.channel)
    res.send(201)
    return next();
  }
  else {
    log.warn('bad schema -> %s', JSON.stringify(req.body));
    return next(new restify.UnprocessableEntityError('API requests must be json, with proper headers, and must be posted to a channel. Refer to the API guide for JSON schema.'));
  }
  // log.warn('error saving data -> %s', err);
  // return next(new restify.BadRequestError('API requests must be json, with proper headers.'));
}

// TODO: lazily coded 'rooms'
server.post('/post/:channel', handleRequest)

server.listen(port)
log.info('listening on %s', port)
