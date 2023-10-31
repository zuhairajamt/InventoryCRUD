module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define("inventory", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
        type: Sequelize.ENUM('Makanan', 'Minuman', 'Elektronik', 'Fashion', 'Lainnya') ,
        allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    userID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.users, {
      foreignKey: {
        name: "userID",
        allowNull: false,
      },
    });
  };

  return Inventory;
};
