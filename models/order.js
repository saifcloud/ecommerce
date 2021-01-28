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
    static associate({User, Order_detail, Shipping_address}) {
      // define association here
      this.hasOne(User,{foreignKey:'id',sourceKey:'user_id', as:'user'});
      this.hasMany(Order_detail,{foreignKey:'order_id',sourceKey:'order_id',as:'orderDetails'});
      this.hasOne(Shipping_address,{foreignKey:'id',sourceKey:'address_id', as:'shipping_address'});

    }
  };
  Order.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    address_id: DataTypes.INTEGER,
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