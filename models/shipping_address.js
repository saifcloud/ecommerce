'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User,{foreignKey:'id',sourceKey:'user_id', as:'shipping_address'})
    }
  };
  Shipping_address.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    zipcode:DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    address_type: DataTypes.STRING,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'shipping_addresses',
    modelName: 'Shipping_address',
  });
  return Shipping_address;
};