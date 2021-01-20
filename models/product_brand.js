'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product_brand.init({
    product_id: DataTypes.INTEGER,
    brand_name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'product_brands',
    modelName: 'Product_brand',
  });
  return Product_brand;
};