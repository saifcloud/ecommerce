const express             = require('express');
const jwt                 = require('jsonwebtoken');
const multer              = require('multer');
const path                = require('path');
const app                 = express();

const { sequelize ,
    Sequelize,
    User, 
    Category, 
    Subcategory, 
    Product, 
    Product_image, 
    Product_color,
    Product_size,
    Size,
    Color,
    Slider,
    Banner,
    Review
} = require('../models');

const Op = Sequelize.Op;


//add to cart
app.post('/add-to-cart',async(req,res)=>{
    console.log('cart');
});




module.exports = app;