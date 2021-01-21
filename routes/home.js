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



app.get('/home',async(req,res)=>{
    
    try{
        const slider   = await Slider.findAll({where:{status:1,is_deleted:0}})
        const banner   = await Banner.findAll({where:{status:1,is_deleted:0}});
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
        
        var productData = [];
        products.forEach((item)=>{
            // console.log(item.dataValues.id)
            productData.push({
              id:item.dataValues.id,
              product_name:item.product_name,
              image:item.product_image,
              brand:item.brand,
              price:item.price,
              discount:item.discount,
              discounted_price:item.price_after_discount,
              in_stock:item.stock
            })
        })
       
    	// if(category.length==0) return res.json({'status':true,"message":"Currently there is not any category"});
    	return res.json({'status':true,'data':{'category':category,'slider':slider,'banner':banner,'product':productData},'message':"Category list with subcategory"})

    }catch(err){
      console.log(err);
        return res.json({'status':false,"message":"Something is wrong"})
    }
});



app.get('/single-product-details/:id',async(req,res) =>{
    const product_id = req.params.id;
   
     if(!product_id) return res.json({'status':false,'message':'Product id is required'})


    try{
    
    const product = await Product.findOne({
        where:{id:product_id},
        include:[
            {
                model:Product_image,
                as:'product_image'
            },
            {
                model:Product_size,
                as:'product_size',
                include:{
                    model:Size,as:'size'
                }
            },
            {
                model:Product_color,
                as:'product_color',
                include:{
                    model:Color,as:'color'
                }
            },
            {
                model:Category,
                as:'category'
            },
            {
                model:Subcategory,
                as:'subcategory'
            },
            {
                model:Review,
                // attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'rating']],
                as:'review',

            }
        ],
        // required: false,



    });
   
   const reviewData = await Review.findAll({where:{product_id:product.id},
    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'rating']],
   });
   // console.log(reviewData)
     // return res.json(product)

    const category = await Category.findAll({
        where:{status:1,is_deleted:0},
        include:{model:Subcategory,as:'subcategory'}
     });
    
    if(!product)  return res.json({'status':true,'categories':category,'product':[],'message':'Single product details'});
   

    var product_clr = [];
    product.product_color.forEach((item)=>{
        product_clr.push({
          'color_id':item.id,
          'color':item.color.name   
        })
    });


    var product_sze = [];
    product.product_size.forEach((item)=>{
        product_sze.push({
          'size_id':item.id,
          'size':item.size.name   
        })
    })

    
    var singleProduct = {
            image:product.product_image,
            product_name:product.product_name,
            size:product_sze,
            color:product_clr,
            brand:product.brand,
            description:product.description,
            price:product.price,
            discount:product.discount,
            discounted_price:product.price_after_discount,
            rating:(reviewData[0].rating)? reviewData[0].rating.toFixed(1):0,
            category:product.category.category_name,
            subcategory:product.subcategory.subcategory_name
        };
    

     const relativeProduct = await Product.findAll({
            where:{
                id:{[Op.ne]:product.id},
            },
             include:[
            {
                model:Product_image,
                as:'product_image'
            },
            {
                model:Product_size,
                as:'product_size',
                include:{
                    model:Size,
                    as:'size'
                }
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
                model:Category,
                as:'category'
            },
            {
                model:Subcategory,
                as:'subcategory'
            },
            {
                model:Review,
                // attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'rating']],
                as:'review',

            }
        ],
        });
      // return res.json(relativeProduct)
      // console.log(relativeProduct)
       var relativeProductArr = [];
       relativeProduct.forEach((item)=>{
        
         // var rreviewData = await Review.findAll({where:{product_id:item.id},
         //    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'rating']],
         //   });
         // console.log('ratinggggggggggggg'+rreviewData[0].rating)
        
       
        relativeProductArr.push({
            image:item.product_image,
            product_name:item.product_name,
            // size:product_sze,
            // color:product_clr,
            brand:item.brand,
            description:item.description,
            price:item.price,
            discount:item.discount,
            discounted_price:item.price_after_discount,
            in_stock:item.stock,
            // rating:(rreviewData[0].rating)? rreviewData[0].rating.toFixed(1):0,
            // category:item.category,
            // subcategory:item.subcategory
        })
     

       })

     // return res.json(relativeProductArr)
     return res.json({'status':true,'categories':category,'product':singleProduct,'reviews':product.review,'related_product':relativeProductArr,'message':'Single product details'});
    }catch(err){
     console.log(err)
     return res.json({'status':false,'message':'Something is  wrong'});
    }
});



module.exports = app;

