'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PollSchema = new Schema({
	author: String,
	pollTitle: String,
	pollName: String,
	data: Array,
	url: String,
	per: Number,
	voted: Array,
	userCheck: Boolean,
	sameLocation: Boolean,
	newOptions: Boolean,
	forceCaptcha: Boolean

});

module.exports = mongoose.model('Poll', PollSchema);
