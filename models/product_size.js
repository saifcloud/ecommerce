'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Size}) {
      // define association here
      this.hasOne(Size,{foreignKey:'id',as:'size'});

    }
  };
  Product_size.init({
    size_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'product_sizes',
    modelName: 'Product_size',
  });
  return Product_size;
};