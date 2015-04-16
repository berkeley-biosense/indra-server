Sequelize = require('sequelize')
argv = require('minimist')(process.argv.slice(2))
db_config = require('./db_config.js')

// call this with --id [id to count]

// user id we're querying
id = argv.id

// our db
sequelize = db_config()

// model we're interested in querying
TestReading = sequelize.define('TestReading', {
  id: Sequelize.STRING
})

TestReading.count({where: ["id = ?", id]}).then( function(c) {
//TestReading.count().then( function(c) {
  console.log("There are " + c + " test readings with that id")
})

sequelize.close()
