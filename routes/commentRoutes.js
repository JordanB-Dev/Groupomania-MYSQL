const express = require('express')
const router = express.Router()
const { isAuth } = require('../middleware/authMiddleware')
const commentsCtrl = require('../controllers/commentController')

router.get('/:postId', isAuth, commentsCtrl.getComments)
router.get('/', isAuth, commentsCtrl.getAllComments)
router.post('/create/:postId', isAuth, commentsCtrl.createComment)
router.put('/update/:id', isAuth, commentsCtrl.updateComment)
router.delete('/delete/:id', isAuth, commentsCtrl.deleteComment)

module.exports = router
