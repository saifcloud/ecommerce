const express             = require('express');
const jwt                 = require('jsonwebtoken');
const multer              = require('multer');
const path                = require('path');
// const bodyParser          = require('body-parser');
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
    Review,
    Cart
} = require('../models');

const Op = Sequelize.Op;
// const { Mailer } = require('../helper');
const accessTokenSecret   = require('../middleware/authMiddleware');


// app.use(bodyParser.json());






//get user detail 

app.post('/get-myprofile',accessTokenSecret,async(req,res)=>{
    
    try{
       const user = await User.findOne({where:{id:req.user.user_id}});
       var userData = {
	       	            name:user.name,
	       	            email:user.email,
	       	            phone:user.phone
       	              };
      return res.json({'status':true,'data':userData,"message":"My profile details"})
    }catch(err){
      return res.json({'status':false,"message":"Something is wrong!!"})
    }
});





//user details

var profileStorage = multer.diskStorage({
	destination:function(req,file,cb){
      cb(null,'public/users');
	},
	filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

var profileUpload = multer({storage:profileStorage});

app.post('/user-details',[accessTokenSecret,profileUpload.single('profile_image')],async(req,res)=>{
    // console.log(req.file);
	const {name,email,address} = req.body;

	if(!name) return res.json({'status':false,"message":"Name is required"});
	if(!email) return res.json({'status':false,"message":"Email is required"});
	if(!address) return res.json({'status':false,"message":"Address is required"});
	if(!req.file.filename) return res.json({'status':false,"message":"Profile image is required"});

	try{
       const user = await User.findOne({where:{id:req.user.user_id}});
       user.image  = 'users/'+req.file.filename;
       user.name   = name;
       user.email  = email;
       user.address= address;
       user.save();
       return res.json({'status':true,"message":"Profile updated successfully"})
	}catch(err){
       console.log(err)
       return res.json({'status':false,'message':"Something is wrong"})
	}
	// return res.json(req.user)
});




//add to cart

app.post('/add-to-cart',accessTokenSecret,async(req,res)=>{
   // console.log(req.body);
   const {product_id,size_id,color_id,qty} = req.body;
   try{
      const product = await Product.findOne({where:{id:product_id}});
      if(!product) return res.json({'status':false,'message':'Product not found'})
     
      const updateCart = await Cart.findOne({
            where:{
                     product_id:product.id,
                     size:size_id,
                     color:color_id,
                     is_deleted:0 
                  }
       }); 
     if(updateCart)
     {
      // console.log(product.price_after_discount);
        updateCart.qty                  = updateCart.qty+qty;
        // updateCart.price                = product.price;
        updateCart.price_after_discount = product.price_after_discount;
        updateCart.total                = updateCart.total + (qty*product.price_after_discount);
        updateCart.save();
     }else{
      // console.log('updated');
      const cart    = await Cart.create({
        user_id   :req.user.user_id,
        product_id:product.id,
        size      :size_id,
        color     :color_id,
        qty       :qty,
        price     :product.price,
        price_after_discount:product.price_after_discount,
        total     :qty*product.price_after_discount

        });

     }
      
 
       return res.json({'status':true,'message':'Product added successfully in cart'})
   }catch(err){
       // console.log(err);
       return res.json({'status':false,'message':'Something is wrong'})
   }
});




//get cart

app.get('/get-cart',accessTokenSecret,async(req,res)=>{
   
  try{
     
      const cart = await Cart.findAll({
                      where:{
                        user_id:req.user.user_id,
                        is_deleted:0
                      },
                      include:[{
                                 model:Product,
                                 as:'product',
                                 include:{
                                  model:Product_image,
                                  as:'product_image'
                                 }
                      }]
                     });
     

    // console.log(cart)
      if(Object.keys(cart).length==0) return res.json({'status':false,'message':'Cart is empty'})
       // return res.json(cart)
      var cartData = [];
      var dsubtotal = [];
      var dtotal=  [];
      cart.forEach((item)=>{

        dsubtotal.push(item.total);
        dtotal.push(item.total);

       cartData.push({
           image:item.product.product_image,
           product_name:item.product.product_name,
           price:item.product.price_after_discount,
           qty:item.qty,
           size:item.size,
           total:item.total
       })
      })

       var getsubtotal = dsubtotal.reduce((a, b) => a + b, 0);
       var gettotal = dtotal.reduce((a, b) => a + b, 0);
       
       // return res.json(cartData)
          return res.json(
            {'status':true,
            'data':{
              'cart':cartData,
              'subtotal':getsubtotal ,
              'shipping':'Free Shipping',
              'total': gettotal
             },
             'message':'My cart'
           }
        )

   }catch(err){
    console.log(err)
       return res.json({'status':false,'message':'Something is wrong'})
   }
});


module.exports = app;