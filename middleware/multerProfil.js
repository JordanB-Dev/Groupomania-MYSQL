const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/x-icon': 'ico',
  'image/svg+xml': 'svg',
  'image/tiff': 'tif',
  'image/tif': 'tif',
  'image/webp': 'webp',
}
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${__dirname}/../client/public/uploads/profil/`)
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]

    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/bmp' ||
      file.mimetype === 'image/gif' ||
      file.mimetype === 'image/ico' ||
      file.mimetype === 'image/svg' ||
      file.mimetype === 'image/tiff' ||
      file.mimetype === 'image/tif' ||
      file.mimetype === 'image/webp'
    ) {
      callback(null, req.user.id + '_' + 'PictureProfil' + '.' + extension)
    } else {
      console.log('fichier non accepté')
      callback(
        null,
        'isole/' + req.user.id + '_' + 'PictureProfil' + '.' + extension
      )
    }
  },
})
module.exports = multer({ storage }).single('file')
