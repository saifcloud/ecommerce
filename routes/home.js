const express             = require('express');
const jwt                 = require('jsonwebtoken');
const multer              = require('multer');
const path                = require('path');
const app                 = express();

const { sequelize ,
    User, 
    Category, 
    Subcategory, 
    Product, 
    Product_image, 
    Product_color,
    Product_size,
    Size,
    Color
} = require('../models');



app.get('/home',async(req,res)=>{
    
    try{
    	const category = await Category.findAll({ include:{ model:Subcategory,as:'subcategory'}});
    	const products = await Product.findAll({
    		include:[{
    		           model:Product_image,
    		    	   as:'product_image',
    		    	  },
    		          {
                        model:Product_color,
                        as:'product_color',
                        include:{
                            model:Color,
                            as:'color'
                        }
    		    	  },
                      {
                        model:Product_size,
                        as:'product_size',
                        include:{
                            model:Size,
                            as:'size'
                        }
                      }
                      ]
    	});
    	// if(category.length==0) return res.json({'status':true,"message":"Currently there is not any category"});
    	return res.json({'status':true,'data':{'category':products},'message':"Category list with subcategory"})

    }catch(err){
      console.log(err);
        return res.json({'status':false,"message":"Something is wrong"})
    }
});



module.exports = app;

