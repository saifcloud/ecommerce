'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Category}) {
      // define association here
      this.belongsTo(Category,{foreignKey:'id',as:'category'});
    }
  };
  Subcategory.init({
    subcategory_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'subcategories',
    modelName: 'Subcategory',
  });
  return Subcategory;
};