'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product,Color,Size}) {
      // define association here
      this.hasOne(Product,{foreignKey:'id',sourceKey:'product_id',as:'product'});
      this.hasOne(Color,{foreignKey:'id',sourceKey:'color_id',as:'color'});
      this.hasOne(Size,{foreignKey:'id',sourceKey:'size_id',as:'size'});
    }
  };
  Order_detail.init({
    order_id: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    color_id: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    qty: DataTypes.INTEGER,
    total_price: DataTypes.DOUBLE,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'order_details',
    modelName: 'Order_detail',
  });
  return Order_detail;
};