'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    total_order: DataTypes.STRING,
    coupon_discount: DataTypes.DOUBLE,
    total_amount: DataTypes.DOUBLE,
    payment_status: DataTypes.INTEGER,
    delivery_status: DataTypes.INTEGER,
    delivery_date: DataTypes.DATE,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'orders',
    modelName: 'Order',
  });
  return Order;
};