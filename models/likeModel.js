module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  })

  return Like
}
