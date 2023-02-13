const router = require('express').Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const uploadCtrl = require('../controllers/uploadController')
const multerProfil = require('../middleware/multerProfil')
const pwdCtrl = require('../middleware/passwordMiddleware')
const { isAuth } = require('../middleware/authMiddleware')
const raterLimit = require('express-rate-limit')

const limiter = raterLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
})

router.post('/register', pwdCtrl, authController.signUp)
router.post('/login', limiter, authController.signIn)
router.get('/logout', authController.logout)

router.get('/', isAuth, userController.getAllUsers)
router.get('/:id', isAuth, userController.getUser)
router.put('/:id', isAuth, userController.updateUser)
router.put('/password/:id', isAuth, pwdCtrl, userController.updatePassword)
router.delete('/:id', isAuth, userController.deleteUser)

router.post('/upload/:id', isAuth, multerProfil, uploadCtrl.uploadProfil)

module.exports = router
