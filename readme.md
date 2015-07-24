## indra collection server

This server takes post requests to the route `/` with the schema:

```
{
  type: 'someString'
}
```

It adds to this POST request a field `receivedAt` with an ISOString.

Then it publishes the data to socketIO

## Development

first, `npm install`.

to run, `npm start`

to test, `npm test` 

