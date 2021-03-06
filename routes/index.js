const router = require('express').Router()
const problems_router = require('./problems')

router.use('/problems', problems_router)

module.exports = router