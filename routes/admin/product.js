const express = require('express');
const { sequelize, Sequelize, Admin, Product,Category,Subcategory, Product_image, Product_size, Product_color, Size, Color } = require('../../models');
const bcrypt    = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const multer   = require('multer');
const bodyParser  = require('body-parser');
const app     = express();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(bodyParser.json())


const accessTokenSecret   = require('../../middleware/authMiddleware');
const Op = Sequelize.Op;


 



var ProductStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/products');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var Produpload = multer({ storage : ProductStorage }).array('image',4);


//get product list
// app.get('/',async(req,res) => {

//       try{
//       const product = await Product.findAll({
//         where:{
//           status:1,is_deleted:0
//         },
//         include:[
//                   {
//                    model:Product_image,
//                    as:'product_image'
//                   },
//                   {
//                      model:Product_size,
//                      as:'product_size',
//                      include:{
//                         model:Size,
//                         as:'size'
//                      }
//                   },
//                   {
//                      model:Product_color,
//                      as:'product_color',
//                      include:{
//                       model:Color,
//                       as:'color'
//                      }
//                   }
//                 ] 
//       });

//       return res.json({'status':true,'data':{'product':product},'message':'Products list'})       
//       }catch(err){
//       console.log(err)
//       return res.json({'status':false,'message':'Something is wrong.'})
//       }
// })
app.get('/',accessTokenSecret,async(req,res) => {
 
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


//add product
app.post('/add',Produpload,async(req,res) =>{

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
   
   // console.log(req.files)

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

      for(var i=0; i<req.files.length; i++)
      {
         const product_image = Product_image.create({
            product_id:product.id,
            image:'products/'+req.files[i].filename
         })
 
      }

      return res.json({'status':true,'message':'Product uploaded successfully.'});
       
	}catch(err){
      console.log(err)
      return res.json({'status':false,'message':'Something is wrong.'});
	}
});





//get data for edit product
app.post('/edit',async(req,res) => {
       
      const { product_id } = req.body;
      if(!product_id) return res.json({'status':false,'message':'Product id is required'});

      try{
      const product = await Product.findOne({
        where:{
          id:product_id,status:1,is_deleted:0
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
                  }
                ]
      });

      return res.json({'status':true,'data':{'product':product},'message':'Product'})       
      }catch(err){
      console.log(err)
      return res.json({'status':false,'message':'Something is wrong.'})
      }
})



//update product
app.post('/update',Produpload,async(req,res) => {
   
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
            stock,
            product_id
           } = req.body;
     
     // console.log(req.body)

    if(!product_name)         return res.json({'status':false,'message':'Product name is required.'});
    if(!category_id)          return res.json({'status':false,'message':'Category id is required.'});
    if(!subcategory_id)       return res.json({'status':false,'message':'Product name is required.'});
    if(!brand)                return res.json({'status':false,'message':'Brand is required.'});
    if(!price)                return res.json({'status':false,'message':'Price is required.'});
    if(!description)          return res.json({'status':false,'message':'Description  is required.'});
    if(!discount)             return res.json({'status':false,'message':'Discount is required.'});
    if(!price_after_discount) return res.json({'status':false,'message':'Price after discount is required.'});
    if(!limited_time)         return res.json({'status':false,'message':'Limited time  is required.'});
    if(!host_selling)         return res.json({'status':false,'message':'host selling  is required.'});
    if(!stock)                return res.json({'status':false,'message':'Stock id is required.'});

    try{
      
        const product = await Product.update({
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
        },{where:{id:product_id}});

        for(var i=0; i<req.files.length; i++)
        {
           const product_image = Product_image.create({
              product_id:product.id,
              image:'products/'+req.files[i].filename
           })
   
        }

        return res.json({'status':true,'message':'Product updated successfully.'});
         
    }catch(err){
        console.log(err)
        return res.json({'status':false,'message':'Something is wrong.'});
    }
   
});


// delete product
app.post('/delete',async(req,res) => {

     const { product_id } = req.body;

     if(!product_id) return res.json({'status':false,'message':'Product id is required'});

     try{

      const checkifexist = await Product.findOne({where:{id:product_id,is_deleted:0}});

      if(!checkifexist) return res.json({'status':false,'message':'Product not found.'})

      const product = await Product.update({is_deleted:1},{where:{id:product_id}});

      return res.json({'status':true,'message':'Product deleted successfully.'});

     }catch(err){
      console.log(err);
      return res.json({'status':false,'message':'Something is wrong.'});
      
     }
});


module.exports = app;





