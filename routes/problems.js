const router = require('express').Router()
const {search, view_sol, submit} = require('../controllers').problems_controller
const {extract_auth} = require('../helpers').auth

router.get('/search', search)
router.get('/:problem_id', view_sol)
router.post('/', extract_auth, submit)

module.exports = router