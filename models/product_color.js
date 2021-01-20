'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Color}) {
      // define association here
      this.hasOne(Color,{foreignKey:'id',as:'color'});
    }
  };
  Product_color.init({
    product_id: DataTypes.INTEGER,
    color_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'product_colors',
    modelName: 'Product_color',
  });
  return Product_color;
};