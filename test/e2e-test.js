var test = require('tape');
var request = require('request-json');
var config = require('../config.js')
var _ = require('lodash')
var PusherClient = require('pusher-client')

//
// -- e2e tests --
// these tests require the collection server to be running
// couch db + pusher need to be set up, too
 
// json REST client
var jsonRestClient = request.createClient(
	// URL OF RUNNING INDRA SERVER HERE
	'http://indra.webfactional.com')

// pusher socket client
var indraChannel = new PusherClient(config.PUSHER_KEY
	, {encrypted: config.IS_PUSHER_ENCRYPTED}).subscribe('everything');

// couchdb
var cradle = require('cradle')
// connect to couch
db = new(cradle.Connection)(config.DB_HOST, config.DB_PORT)
  .database(config.DB_NAME)

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
// TESTS: pusher tests
//


test('should be able to subscribe to indra channel', function (t) {
	t.plan(1)

	var aUniqueKey = JSON.stringify(new Date())

	indraChannel.bind('testData', function(d) {
		receivedUniqueKey = d.data.uniqueKey
		if (receivedUniqueKey  === aUniqueKey) {
			t.equal(receivedUniqueKey, aUniqueKey, 'we sent data and received it through pusher')
		}
	})

	// send a message with our unique key
	jsonRestClient.post(
		'/', 
		{
			type: 'testData',
			data: { uniqueKey: aUniqueKey }
		}, function(error, response, body) { })
})

// 
// TESTS: couch DB tests
// 
test('db should exist', function (t) {
	t.plan(2)
	db.exists(function (err, exists) {
		t.equal(true, exists, 'db exists')
		t.equal(null, err, 'no errors')
	})
})

test('items in couchdb should have createdAt and type fields', function (t) {
	t.plan(3)
	db.view('indra-views/byType', { key: 'testData' }, function (err, res) {
		t.ok(_.first(res), 'at least one (type:testData) post exists')
		t.ok(_.first(res).value.createdAt, 'createdAt exists')
		t.ok(_.first(res).value.type, 'type is ok')
	})
})

test('db client can query by createdAt', function (t) {
	t.plan(1)
	db.view('indra-views/byCreatedAt', { }, function (err, res) {
		t.ok(_.first(res), 'at least one post exists from createdAt key {}')
	})
})

