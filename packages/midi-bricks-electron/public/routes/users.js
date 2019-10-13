/*
 * Copyright (C) 2017 Jason Henderson
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('you run into users route here! ')
  res.send('respond with a resource')
})

module.exports = router
