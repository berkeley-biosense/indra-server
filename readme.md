## indra collection server

This server takes post requests to the route `/data/` with the schema:

```
{
  type: 'someString'
  data: {}
}
```

It adds to this POST request a field `createdAt` with an ISOString.

Then it (1) publishes the data over a configured Pusher channel (2) saves the data to a couchDB database

## Development

### CouchDB + Pusher
first, setup a couchDB database and make a Pusher API key. use `config-EXAMPLE.js to make` as a template.

once you have your CouchDB set up, you'll probably want to add some views. here are [a few handy views](https://gist.github.com/elsehow/5d2a7e8c53042ba26058) i've prepared early. consult CouchDB reference for adding views to design docs.

### Request server
then, `npm install`.

to run, `npm start`

to test, `npm test` (note, you have to ctrl-C after the last test runs)

