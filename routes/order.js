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
    Used_coupon,
    Order
} = require('../models');

const accessTokenSecret   = require('../middleware/authMiddleware');
const Op = Sequelize.Op;




app.post('/',accessTokenSecret,async(req,res)=>{
	const { coupon_id } = req.body;
	try{
		// console.log(Math.round(999999999 + Math.random()*(999999999-1111111111)))
		const cart = await Cart.findAll({
			where:{
				user_id:req.user.user_id,
				is_deleted:0},
			include:{
				model:Product,
				as:'product'}
			});

		var orderSummary  = [];
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


		var OrderNumber = 'ORDER'+Math.round(999999999 + Math.random()*(999999999-1111111111));
        const order = await Order.create({
                         order_id:OrderNumber,
                         user_id:req.user.user_id,
                         transaction_id:'',
                         total_order:cart.length,
                         total_amount:total,
                         payment_status:1,
                         delivery_status:1,
                         delivery_date:new Date().toISOString().slice(0,10)

        });

        return res.json(order)
	}catch(err){
     console.log(err)
     return res.json({'status':false,'message':'Something is wrong.'});
	}
})
module.exports = app;