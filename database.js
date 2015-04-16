var Sequelize = require('sequelize')
var db_config = require('./db_config.js')

var sequelize = db_config()

var TestReading = sequelize.define('TestReading', {
  id: Sequelize.STRING
})

function syncTestReadingModel() { 
  TestReading.sync()
}

function saveTestReading(reading) {
  TestReading.create({
    id: reading.id
  }).success(function() {
    console.log(reading + ' saved');
  }).error(function(err) {
    console.log(err)
  })
}

exports.syncTestReadingModel = syncTestReadingModel
exports.saveTestReading = saveTestReading
