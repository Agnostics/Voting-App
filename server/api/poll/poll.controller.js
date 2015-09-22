'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls
exports.index = function (req, res) {
	Poll.find(function (err, polls) {
		if(err) {
			return handleError(res, err);
		}
		return res.status(200).json(polls);
	});
};

// Get a single poll
exports.showID = function (req, res) {

	Poll.findById(req.params.id, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		if(!poll) {
			return res.status(404).send('Not Found');
		}
		return res.json(poll);
	});
};

// Get user polls
exports.user = function (req, res) {

	Poll.find({
		author: req.params.user
	}, function (err, polls) {
		if(err) {
			return handleError(res, err);
		}
		if(!polls) {
			return res.send(404);
		}

		res.send(req.ip);
		return res.json(polls);
	});

};


// Get single user poll
exports.userPoll = function (req, res, ip) {

	Poll.find({
		author: req.params.user,
		pollName: req.params.poll
	}, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		if(!poll) {
			return res.send(404);
		}

		return res.json(poll);
	});
};

exports.results = function (req, res) {
	Poll.find({
		author: req.params.user,
		pollName: req.params.poll
	}, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		if(!poll) {
			return res.send(404);
		}
		return res.json(poll);
	});
};

// Creates a new poll in the DB.
exports.create = function (req, res) {
	Poll.create(req.body, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		return res.status(201).json(poll);
	});
};

// Updates an existing poll in the DB.
exports.update = function (req, res) {

	Poll.findById(req.params.id, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		if(!poll) {
			return res.send(404);
		}
		var updated = _.extend(poll, req.body);
		updated.save(function (err) {
			if(err) {
				return handleError(res, err);
			}
			return res.json(200, poll);
		});
	});

};

// Deletes a poll from the DB.
exports.destroy = function (req, res) {
	Poll.findById(req.params.id, function (err, poll) {
		if(err) {
			return handleError(res, err);
		}
		if(!poll) {
			return res.status(404).send('Not Found');
		}
		poll.remove(function (err) {
			if(err) {
				return handleError(res, err);
			}
			return res.status(204).send('No Content');
		});
	});
};

function handleError(res, err) {
	return res.status(500).send(err);
}
