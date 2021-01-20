'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Subcategory}) {
      // define association here
      this.hasMany(Subcategory,{foreignKey:'category_id',as:'subcategory'})
    }
  };
  Category.init({
    category_name: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'categories',
    modelName: 'Category',
  });
  return Category;
};