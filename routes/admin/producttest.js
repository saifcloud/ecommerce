const express = require('express');
const { sequelize, Sequelize, Admin, Category,Subcategory ,Product, Product_image, Product_size, Product_color, Size, Color } = require('../../models');
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


 


app.get('/',async(req,res) => {
 
  try{

    var ProductData = await Product.findAll({
         where:{
          status:1,is_deleted:0
        },
        include:[
                {
                  model:Category,
                  as:'category'
                 },{
                  model:Subcategory,
                  as:'subcategory'
                 },{
                  model:Product_image,
                  as:'product_image'
                 },
                 {model:Product_size,
                  as:'product_size',
                  include:[{model:Size,
                          as:'size' }]
                  },
                  {model:Product_color,
                  as:'product_color',
                  include:[{model:Color,
                          as:'color' }]
                  }]
    });
    
    var Productsdata = [];

    ProductData.forEach((item)=>{
       var Productscolor = [];
      
    item.product_color.forEach((itemcolor)=>{
       Productscolor.push(
        itemcolor.color
      )
    });

    var Productssize = [];
      
    item.product_size.forEach((itemsize)=>{
       Productssize.push(
        itemsize.size
      )
    });


      Productsdata.push({
          'image':item.product_image,
          'product_id':item.id,
          'product_name':item.product_name,
          'product_category':item.category.category_name,
          'product_subcategory':item.subcategory.subcategory_name,
          'product_brand':item.brand,
          'product_price':item.price,
          'product_desc':item.description,
          'product_discount':item.dicsount,
          'discount_price':item.price_after_discount,
          'limited_time':item.limited_time,
          'hot_selling':item.hot_selling,
          'stock':item.stock,
          'is_deleted':item.is_deleted,
          'created_on':item.createdAt,
          'updated_on':item.updatedAt,
          'product_color' : Productscolor,
          'product_size' : Productssize



      });

      

   })

    // console.log(ProductData);
    return res.json({'status':true,'message':'success','data':Productsdata});
   }catch(err){
    console.log(err);
    return res.json({'status':false,'message':'Something went Wrong!!'});
  }

});

module.exports = app;





