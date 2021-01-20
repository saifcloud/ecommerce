'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product_image,Product_color,Product_size}) {
      // define association here
      this.hasMany(Product_image,{foreignKey:'product_id',as:'product_image'});
      this.hasMany(Product_color,{foreignKey:'product_id',as:'product_color'});
      this.hasMany(Product_size,{foreignKey:'product_id',as:'product_size'});
    }
  };
  Product.init({
    image: DataTypes.STRING,
    product_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    subcategory_id: DataTypes.INTEGER,
    size: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    description: DataTypes.TEXT,
    discount: DataTypes.STRING,
    price_after_discount: DataTypes.DOUBLE,
    limited_time: DataTypes.INTEGER,
    host_selling: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'products',
    modelName: 'Product',
  });
  return Product;
};