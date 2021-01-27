const express = require('express');
const { sequelize, Sequelize, Admin, Product } = require('../../models');
const bcrypt    = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const multer              = require('multer');
const bodyParser     = require('body-parser');
const app     = express();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(bodyParser.json())


const accessTokenSecret   = require('../../middleware/authMiddleware');
const Op = Sequelize.Op;


 



var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/products');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage }).array('image',2);

app.post('/add',upload,async(req,res) =>{

	const {
          image,
          product_name, 
          category_id, 
          subcategory_id, 
          brand, 
          price, 
          description, 
          discount, 
          price_after_discount,
          limited_time,
          host_selling,
          stock
         } = req.body;
   
   console.log(req.body)

	if(!product_name)    return res.json({'status':false,'message':'Product name is required.'});
	if(!category_id) return res.json({'status':false,'message':'Category id is required.'});
  if(!subcategory_id)    return res.json({'status':false,'message':'Product name is required.'});
  if(!brand) return res.json({'status':false,'message':'Brand is required.'});
  if(!price)    return res.json({'status':false,'message':'Price is required.'});
  if(!description) return res.json({'status':false,'message':'Description  is required.'});
  if(!discount)    return res.json({'status':false,'message':'Discount is required.'});
  if(!price_after_discount) return res.json({'status':false,'message':'Price after discount is required.'});
  if(!limited_time)    return res.json({'status':false,'message':'Limited time  is required.'});
  if(!host_selling) return res.json({'status':false,'message':'host selling  is required.'});
  if(!stock) return res.json({'status':false,'message':'Stock id is required.'});

	try{
    
      const product = await Product.create({
          product_name:product_name,
          category_id:category_id,
          subcategory_id:subcategory_id, 
          brand:brand, 
          price:price, 
          description:description, 
          discount:discount, 
          price_after_discount:price_after_discount,
          limited_time:limited_time,
          host_selling:host_selling,
          stock:stock
      });
	
      return res.json({'status':false,'message':'Product uploaded successfully.'});
       
	}catch(err){
      console.log(err)
      return res.json({'status':false,'message':'Something is wrong.'});
	}
});

module.exports = app;





