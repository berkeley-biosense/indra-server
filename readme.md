## indra collection server

this server takes post requests to the route `/data/` with the schema:

```
{
  type: 'someString'
  data: {}
}
```

it adds to this POST request a field `createdAt` with an ISOString, then (1) publishes the data over a configured Pusher channel (2) saves the data to a couchDB database

## development

first, `npm install`

to run, `node server.js | bunyan`

for tests, refer to the [e2e test suite](http://github.com/testing-suite)