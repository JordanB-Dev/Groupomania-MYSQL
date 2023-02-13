module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    imageURL: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  return Post
}
