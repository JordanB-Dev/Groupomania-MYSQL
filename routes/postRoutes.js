const express = require('express')
const router = express.Router()
const { isAuth } = require('../middleware/authMiddleware')
const postsCtrl = require('../controllers/postController')
const multerPost = require('../middleware/multerPost')

router.get('/:id', isAuth, postsCtrl.getOnePost)
router.get('/', isAuth, postsCtrl.getAllPosts)
router.post('/', isAuth, multerPost, postsCtrl.createPost)
router.put('/:id', isAuth, multerPost, postsCtrl.updatePost)
router.delete('/:id', isAuth, multerPost, postsCtrl.deletePost)

router.post('/like/:postId', isAuth, postsCtrl.postLike)

module.exports = router
