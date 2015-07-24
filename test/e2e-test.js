var test            = require('tape');
var request         = require('request-json');
var _               = require('lodash');
var config          = require('../config.js')
var indraFaucet     = require('socket.io-client')('http://localhost:3000/');

// -- e2e tests --
// these tests require the collection server to be running

// json REST client
var jsonRestClient = request.createClient('http://localhost:' + config.PORT + '/');

// pusher socket client
//var indraFaucet = socketio('http://localhost:' + config.PORT + "/");
indraFaucet.on('connect', function(){ console.log('connected')});

//
//  TEST: client POST responses
//
var goodData = {
  user: 'me',
  type: 'testData',
  data: {whatever:42}
}

var badData = {
  user: 'this part is fine',
  device: 'oops theres no type field',
  data: {thisPart:'is fine'}
}

test('posting good data -> 202', function(t) {
  t.plan(1)
  jsonRestClient.post(
    '/',
    goodData,
    function(error, response, body) {
      t.equal(202, response.statusCode)
    }
  )
})

test('posting bad data -> 422 + UnprocessableEntityError', function(t) {
  t.plan(6)
  // 1. poorly-formed data
  jsonRestClient.post(
    '/',
    badData,
    function(error, response, body) {
      t.equal('UnprocessableEntityError', body.code, 'null data UnprocessableEntityError')
      t.equal(422, response.statusCode, 'bad data 422')
    }
  )
  // 2. null data
  jsonRestClient.post(
    '/', 
    null,
    function(error, response, body) {
      t.equal('UnprocessableEntityError', body.code, 'null data UnprocessableEntityError')
      t.equal(422, response.statusCode, 'null data 422')
    }
  )
  // 3. empty data
  jsonRestClient.post(
    '/', 
    {},
    function(error, response, body) {
      t.equal('UnprocessableEntityError', body.code, 'empty data UnprocessableEntityError')
      t.equal(422, response.statusCode, 'empty data 422')
    }
  )
})


//
// TESTS: pubsub tests
//

test('should be able to subscribe to indra channel', function (t) {
  t.plan(1)

  var aUniqueKey = JSON.stringify(new Date())

  function isThisTheDataWeSent (d) {
    receivedUniqueKey = d.uniqueKey
    t.equal(receivedUniqueKey, aUniqueKey, 'we sent data and received it through our subscription ')
    indraFaucet.disconnect()
  }

  indraFaucet.on('testData', isThisTheDataWeSent); 

  // send a message with our unique key
  jsonRestClient.post(
    '/',
    {
      type: 'testData',
      uniqueKey: aUniqueKey
    }, 
    function (error, response, body) { 
      return;
    })
})




