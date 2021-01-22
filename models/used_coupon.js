'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Used_coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Used_coupon.init({
    coupon_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Used_coupon',
  });
  return Used_coupon;
};