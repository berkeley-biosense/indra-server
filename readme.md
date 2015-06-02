## indra collection server

this server takes post requests with the schema:
```
{
  user: 'someString'
  device: 'someString'
  data: {arbitrary: 'object', ... }
}
```

and saves these data to couch db.

## development

first, `npm install`

to run, `node server.js | bunyan`

for tests, refer to the [e2e test suite](http://github.com/testing-suite)