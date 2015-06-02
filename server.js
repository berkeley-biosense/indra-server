var restify = require('restify')
var db_config = require('./db_config')
var thinky = require('thinky')({
  port: db_config.port,
  host: db_config.host,
  db: db_config.name,
})
var type = thinky.type;
var bunyan = require('bunyan')
var log = bunyan.createLogger({name: 'indra-collection-server'});

// config
var port = 23023

// schema:
// {
//   app: 'appname'
//   user: 'ffff'
//   data: {...}
// }
var Post = thinky.createModel("Post", {
    app: type.string(),
    user: type.string(),
    data: type.object(),
}); 

var server = restify.createServer({})
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

// TODO: lazily coded 'rooms'
server.post('/', function (req, res, next) {
  try {
    var post = new Post(req.body)
    // console.log(post)
    post.save()
    res.writeHead(200)
    res.end()
    return next();
  } catch (err) {
    log.warn('error saving data -> %s', err);
    return next(new restify.UnprocessableEntityError('API requests must be json, with proper headers.'));
  }
})

server.listen(port)
log.info('listening on %s', port)
