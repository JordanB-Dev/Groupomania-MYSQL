module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    firstName: {
      type: Sequelize.STRING(40),
      allowNull: false,
    },

    lastName: {
      type: Sequelize.STRING(40),
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i,
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    bio: {
      type: Sequelize.TEXT,
      defaultValue: 'Pas de biographie',
    },

    picture: {
      type: Sequelize.STRING,
      defaultValue: './uploads/profil/default/random-user.png',
    },

    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })

  return User
}
