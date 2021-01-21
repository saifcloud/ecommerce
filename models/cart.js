'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Product}) {
      // define association here
      this.belongsTo(User,{foreignKey:'id',sourceKye:'user_id',as:'user'});
      this.hasOne(Product,{foreignKey:'id',sourceKey:'product_id',as:'product'});
    }
  };
  Cart.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    color: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    price_after_discount: DataTypes.DOUBLE,
    total: DataTypes.DOUBLE,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'carts',
    modelName: 'Cart',
  });
  return Cart;
};