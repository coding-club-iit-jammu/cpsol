const router = require('express').Router()
const {search, view_sol, submit} = require('../controllers').problems_controller

router.get('/search', search)
router.get('/:problem_id', view_sol)
router.post('/', submit)

module.exports = router