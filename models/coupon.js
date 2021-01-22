'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Coupon.init({
    name: DataTypes.STRING,
    min_purchase: DataTypes.STRING,
    discount: DataTypes.STRING,
    uses: DataTypes.STRING,
    expiry_date: DataTypes.DATE,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'coupons',
    modelName: 'Coupon',
  });
  return Coupon;
};