module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notContainsSpaceOrSpecialCharacters(value) {
          if (/\s|[^A-Za-z0-9]/.test(value)) {
            throw new Error(
              "Username cannot contain spaces or special characters"
            );
          }
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("Admin", "Manager", "User"),
      allowNull: false,
    },
    activation: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return User;
};
