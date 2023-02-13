const config = require('../config/database')
const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
})

sequelize
  .authenticate()
  .then(function () {
    console.log('Database has been successfully authenticated')
    return true
  })
  .catch(function (err) {
    console.log('Failed to authenticate database: ', err)
    return false
  })

sequelize
  .sync({ force: false })
  .then(() => console.log('Database is updating !'))
  .catch((error) => console.log('Oops, something wrong here !', error))

db.User = require('../models/userModel')(sequelize, Sequelize)
db.Post = require('../models/postModel')(sequelize, Sequelize)
db.Comment = require('../models/commentModel')(sequelize, Sequelize)
db.Like = require('../models/likeModel')(sequelize, Sequelize)

db.User.hasMany(db.Post, {
  onDelete: 'CASCADE',
})
db.User.hasMany(db.Comment, {
  onDelete: 'CASCADE',
})
db.User.hasMany(db.Like, {
  onDelete: 'CASCADE',
})

db.Post.hasMany(db.Comment, {
  onDelete: 'CASCADE',
})
db.Post.hasMany(db.Like, {
  onDelete: 'CASCADE',
})

db.Post.belongsTo(db.User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
})
db.Comment.belongsTo(db.User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
})
db.Like.belongsTo(db.User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
})

db.Comment.belongsTo(db.Post, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
})
db.Like.belongsTo(db.Post, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
})

module.exports = db
