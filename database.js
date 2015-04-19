var Sequelize = require('sequelize')
var db_config = require('./db_config.js')

// sequelize is our db
var sequelize = db_config()


// device reading

// messages that come in from clients:
// {
//  id
//  indra_time           // estimate of indra_time
//  browser_latency     // diff btwn indra-time + browser's time (latency)
//	reading: {
//    reading_time    // user's local time when reading came thru the port
//    attention_esense
//    meditation esense
//    eeg_power: [8]
//    raw_values: [512] 
//    signal_quality
//  }
// } 


// sequel model 
var NeuroskyReading = sequelize.define('NeuroskyReading', {
  id: Sequelize.STRING
  , indra_time: Sequelize.DATE
  , browser_latency: Sequelize.INTEGER
  , reading_time: Sequelize.DATE
  , attention_esense: Sequelize.INTEGER
  , meditation_esense: Sequelize.INTEGER
  , eeg_power: Sequelize.ARRAY(Sequelize.INTEGER)
  , raw_values: Sequelize.ARRAY(Sequelize.INTEGER)
  , signal_quality: Sequelize.INTEGER
})

// syncs model with the db
function syncNeuroskyReadingModel() { 
  NeuroskyReading.sync()
}

// fn to save a reading from a json post
function saveNeuroskyReading(jsonPost) {

  NeuroskyReading.create({
  	// this needs to match the data that comes from the server
    id: jsonPost.id
    , indra_time: jsonPost.indra_time
    , browser_latency: jsonPost.browser_latency
    , reading_time: jsonPost.reading.reading_time
    , attention_esense: jsonPost.reading.attention_esense
    , meditation_esense: jsonPost.reading.meditation_esense
    , eeg_power: jsonPost.reading.eeg_power
    , raw_values: jsonPost.reading.raw_values
    , signal_quality: jsonPost.reading.signal_quality
  // }).success(function() {
  //   console.log(reading.id + ' saved');
  }).error(function(err) {
    console.log(err)
  })
}

exports.syncNeuroskyReadingModel = syncNeuroskyReadingModel
exports.saveNeuroskyReading = saveNeuroskyReading
