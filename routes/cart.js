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
    Review,
    Cart
} = require('../models');

const accessTokenSecret   = require('../middleware/authMiddleware');
const Op = Sequelize.Op;


//add to cart

app.post('/add-to-cart',accessTokenSecret,async(req,res)=>{
   // console.log(req.body);
   const {product_id,size_id,color_id,qty} = req.body;
   try{
      const product = await Product.findOne({where:{id:product_id}});
      if(!product) return res.json({'status':false,'message':'Product not found.'})
     
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
      
 
       return res.json({'status':true,'message':'Product added successfully in cart.'})
   }catch(err){
       // console.log(err);
       return res.json({'status':false,'message':'Something is wrong.'})
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
      if(Object.keys(cart).length==0) return res.json({'status':false,'message':'Cart is empty.'})
       // return res.json(cart)
      var cartData = [];
      var dsubtotal = [];
      var dtotal=  [];
      cart.forEach((item)=>{

        dsubtotal.push(item.total);
        dtotal.push(item.total);

       cartData.push({
           image:item.product.product_image,
           cart_id:item.id,
           product_name:item.product.product_name,
           price:item.product.price_after_discount,
           qty:item.qty,
           size:item.size,
           total:item.total
       })
      })

       var getsubtotal = dsubtotal.reduce((a, b) => a + b, 0).toFixed(2);;
       var gettotal = dtotal.reduce((a, b) => a + b, 0).toFixed(2);;
       
       // return res.json(cartData)
          return res.json(
            {'status':true,
            'data':{
              'cart':cartData,
              'subtotal':getsubtotal ,
              'shipping':'Free Shipping',
              'total': gettotal
             },
             'message':'My cart.'
           }
        )

   }catch(err){
       console.log(err)
       return res.json({'status':false,'message':'Something is wrong.'})
   }
});



//update cart
app.post('/update-quantity',accessTokenSecret,async(req,res)=>{
    const { cart_id ,qty } = req.body;

    if(!cart_id) return res.json({'status':false,"message":"Cart id is required."});
    if(!qty) return res.json({'status':false,"message":"Quantity is required."});

    try{

      const cart    = await Cart.findOne({where:{id:cart_id,is_deleted:0}});
      if(!cart) return res.json({'status':false,'message':'There is not any item in your cart'});
      const product = await Product.findOne({where:{id:cart.product_id}});

      cart.price                = product.price;
      cart.price_after_discount = product.price_after_discount;
      cart.qty                  = qty;
      cart.total                = qty*product.price_after_discount;
      cart.save();
      // var total                 = qty;
      return res.json({'status':true,'message':'Item quantity updated successfully.'})
    }catch(err){
      return res.json({'status':false,'message':'Something is wrong.'})
    }
})



//delete product from cart
app.post('/delete-item',accessTokenSecret,async(req,res)=>{
    const  { cart_id } = req.body;
    if(!cart_id) return res.json({'status':false,'message':'Item cart id is required.'});
    try{

      const cart = await Cart.findOne({where:{id:cart_id,is_deleted:0}});
      if(!cart) return res.json({'status':false,'message':'There not any item in your cart.'});
      cart.is_deleted =1;
      cart.save();

      return res.json({'status':true,'message':'Item cart item deleted successfully.'});

    }catch(err){
      return res.json({'status':false,'message':'Something is wrong.'});
    }
})

module.exports = app;