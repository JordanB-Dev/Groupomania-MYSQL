const express = require('express')
const router = express.Router()
const { isAuth, isAdmin } = require('../middleware/authMiddleware')
const multerPost = require('../middleware/multerPost')
const multerPrf = require('../middleware/multerProfil')
const uploadCtrl = require('../controllers/uploadController')
const isAdminCtrl = require('../controllers/adminController')

router.put('/user/:id', isAuth, isAdmin, isAdminCtrl.updateUser)
router.delete('/user/:id', isAuth, isAdmin, isAdminCtrl.deleteUser)

router.put('/post/:id', isAuth, isAdmin, multerPost, isAdminCtrl.updatePost)
router.delete('/post/:id', isAuth, isAdmin, isAdminCtrl.deletePost)

router.delete('/comment/:id', isAuth, isAdmin, isAdminCtrl.deleteComment)

router.post('/upload/:id', isAuth, isAdmin, multerPrf, uploadCtrl.uploadAdmin)

module.exports = router
