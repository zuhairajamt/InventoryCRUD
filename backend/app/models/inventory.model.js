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
  });

  return Inventory;
};
