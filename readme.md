## indra collection server

This server takes post requests to the route `/` with the schema:

```
{
  type: 'someString'
}
```

you can add any old data on top of that. so, a post request from your device might look like this:


```javascript
{
  type: 'neurosky-mindwave',
  reading: {
    raw_values: [1353523, 216363, 1235 ... ],
    attention_esense: 53,
    meditation_esense: 83
  }
}
```

then, on the client side, we can subscribe to socket IO with `type` as the event:

```javascript
var socket = io('my-indra-server')
socket.on('neurosky-mindwave', function (d) {
  // do stuff with the neurosky data
})
```

It adds to this POST request a field `receivedAt` with an ISOString.

Then it publishes the data to socketIO

## Development

first, `npm install`.

to run, `npm start`

to test, `npm test` (server must be running, so `npm start` first)
