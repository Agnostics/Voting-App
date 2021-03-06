'use strict';

var express = require('express');
var controller = require('./poll.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.showID);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:user/polls', controller.user);
router.get('/:user/:poll/:results', controller.results);
router.get('/:user/:poll', controller.userPoll);

module.exports = router;
