'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PollSchema = new Schema({
	author: String,
	pollTitle: String,
	pollName: String,
	data: Array,
	url: String
});

module.exports = mongoose.model('Poll', PollSchema);
