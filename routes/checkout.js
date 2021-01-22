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
    Cart,
    Shipping_address,
    Coupon,
    Used_coupon
} = require('../models');

const accessTokenSecret   = require('../middleware/authMiddleware');
const Op = Sequelize.Op;




app.get('/',accessTokenSecret,async(req,res) =>{
 // console.log(req.user.user_id)
  try{

    const category    = await Category.findAll({where:{is_deleted:0},include:{model:Subcategory,as:'subcategory'}});
    // const subcategory = await Subcategory.findAll({where:{is_deleted:0}});
    const user = await User.findOne({
        where:{
            id:req.user.user_id,
            is_deleted:0
        },
        include:{ 
              model:Shipping_address,
              as:'user_address'
        }
  });
   
    // return res.json(user)

    if(!user) return res.json({'status':false,'message':'User not found.'})

    const cart =  await Cart.findAll({
        where:{
            user_id:req.user.user_id,
            is_deleted:0
        },
        include:{
            model:Product,
            as:'product'
        }
    });


    if(!cart|| cart.length ==0) return res.json({'status':false,'message':'There is not any item in your cart'});
    var orderSummary = [];
    var dsubtotal     = [];
    var dtotal        = [];

    cart.forEach((item)=>{

            dsubtotal.push(item.total);
            dtotal.push(item.total);

            orderSummary.push({
               product_name:item.product.product_name,
               qty:item.qty,
               total:item.total,
              
            })
    });

        var subtotal = dsubtotal.reduce((a,b) => a + b,0).toFixed(2);
        var total    = dtotal.reduce((a,b) => a + b,0).toFixed(2);

        var catItem = cart.length;
        return res.json({'status':true ,data:{'catItem':catItem,'category':category,'address':user.user_address,'product':orderSummary,'shipping':'Free shipping','subtotal':subtotal,'total':total}})
      
  }catch(err){
   console.log(err)
   return  res.json({'status':false,'message':'Something is wrong'})
  }
})




app.post('/add-address',accessTokenSecret,async(req,res)=>{
    const { name, phone, address, city, country, zipcode, address_type } = req.body;

    if(!name) return res.json({'status':false,'message':'Name is required.'});
    if(!phone) return res.json({'status':false,'message':'Phone is required'});
    if(!address) return res.json({'status':false,'message':'Address is required'});
    if(!city) return res.json({'status':false,'message':'City is required'});
    if(!country) return res.json({'status':false, 'message':'Country is required'});
    if(!zipcode) return res.json({'status':false,'message':'City is required'});
    if(!address_type) return res.json({'status':false, 'message':'Country is required'});

    try{
       const userAddress = await Shipping_address.create({
        user_id:req.user.user_id, 
        name:name, 
        phone:phone, 
        address:address,
        city:city,
        zipcode:zipcode,
        country:country,
        address_type:address_type
       });

       if(userAddress) return res.json({'status':true,'message':'Address added successfully'});

    }catch(err){
        console.log(err)
        return res.json({'status':false,'message':'Something is wrong'});
    }
});





app.post('/apply-code',accessTokenSecret,async(req,res) =>{
    const { coupon_name } = req.body;
    if(!coupon_name) return res.json({'status':false,'message':'Coupon code is required.'}) 
    try{
        const coupon = await Coupon.findOne({where:{name:coupon_name}});
        if(!coupon) return res.json({'status':false,'message':'Invaid coupon code.'});
        
        const user_coupon = await Used_coupon.findAll({where:{coupon_id:coupon.id,user_id:req.user.user_id}});
        if(user_coupon.length == coupon.users) return res.json({'status':false,'message':'You have used all coupon limit'});
        

        const cart = await Cart.findAll({where:{user_id:req.user.user_id,is_deleted:0},include:{model:Product,as:'product'}});
        var dtotal = [];
        cart.forEach((item)=>{
            dtotal.push(item.total)
        })
        var total = dtotal.reduce((a,b)=> a + b,0);

        if(total < coupon.min_purchase) return res.json({'status':false,'message':'Min purchase amount should be '+coupon.min_purchase});
        
         
        var orderSummary   = [];
        var ddsubtotal     = [];
        var ddtotal        = [];

        cart.forEach((item)=>{

                ddsubtotal.push(item.total);
                ddtotal.push(item.total);

                orderSummary.push({
                   product_name:item.product.product_name,
                   qty:item.qty,
                   total:item.total,
                  
                })
        });
        
       
        var after_discount_subtotal = ddsubtotal.reduce((a,b) => a + b,0).toFixed(2);
        var coupon_discount         = (coupon.discount/100*ddtotal.reduce((a,b) => a + b,0)).toFixed(2);
        var after_discount_total    = (ddtotal.reduce((a,b) => a + b,0) - coupon_discount).toFixed(2);

        // var catItem = cart.length;

        return res.json({'status':true,data:{'product':orderSummary,'shipping':'Free shipping','subtotal':after_discount_subtotal,'coupon_id':coupon.id,'coupon_discount':coupon_discount,'total':after_discount_total},'message':'Coupon applied successfully.'})
    }catch(err){
     console.log(err)
      return res.json({'status':false,'message':'Something is wrong'});
    }
})





module.exports = app;