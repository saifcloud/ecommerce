const express = require('express');
const { sequelize,
 Sequelize, 
 Admin, 
 Order, 
 Product ,
 Product_image, 
 Product_size, 
 Product_color,
 Color,
 Size,
 User,
 Shipping_address,
 Order_detail
} = require('../../models');

const bcrypt    = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const multer  = require('multer');
const app     = express();



const accessTokenSecret   = require('../../middleware/authMiddleware');
const Op = Sequelize.Op;





// profile
app.get('/',accessTokenSecret,async(req,res) =>{
  // console.log(req.user)
   try{

        const orders = await Order.findAll({
        	where:{status:1,is_deleted:0},
        	include:[
        	{model:User,as:'user'},
        	{model:Order_detail,as:'orderDetails',
	        	include:[
	        	          {
					        	model:Product,as:'product',
					        	include:{
					        		model:Product_image,
					        		as:'product_image'
					        	}
	                       },
	                       {
	                       	 model:Color,
	                       	 as:'color'
	                       },
	                       {
	                       	 model:Size,
	                       	 as:'size'
	                       }
	        	                       ]
        },
        	{model:Shipping_address,as:'shipping_address'}]
        	
        }); 
        
        const orderdata = [];
        const customer_details = [];
        const shipping_details = [];

         orders.forEach((item)=>{
         
         var orderdetails =[];

          item.orderDetails.forEach((itemdata) =>{
             orderdetails.push({
                'product_image':itemdata.product.product_image[0],
                'product_name':itemdata.product.product_name,
                'size':itemdata.size.name,
                'color':itemdata.color.name,
                'price':itemdata.price,
                'qty':itemdata.qty,
                'total':itemdata.total_price,
             	// 'data':itemdata
             })
          })
           

         //order data
          orderdata.push({
            id:item.id,
            order_id:item.order_id,
            name:item.user.name,
            email:item.user.email,
            delivery_status:item.delivery_status,
            orderdetails:orderdetails,
            subtotal:item.total_amount,
            discount:(item.coupon_discount !='')? (item.coupon_discount/100*item.total_amount).toFixed(0):0,
            total:item.total_amount
          });





          //customer details
          customer_details.push({
            user_id:item.user.id,
            order_id:item.order_id,
            name:item.user.name,
            email:item.user.email
           });


          shipping_details.push({
          	address_id:item.shipping_address.id,
          	name:item.shipping_address.name,
          	address:item.shipping_address.address,
          	city:item.shipping_address.city,
          	country:item.shipping_address.country,
          	zip_code:item.shipping_address.zipcode
          })

        })
        
        // return res.json(orderdata)
        
        return res.json({'status':true,'data':{
        	'orders':orderdata,
        	'customer_details':customer_details,
        	'shipping_details':shipping_details,
        	'subtotal':orders.total_amount,
        	'total':orders.total_amount
        },'message':'Orders details.'});
       
  }catch(err){
          console.log(err)
          return res.json({'status':false,'message':'Something is wrong.'});
  }
});




// order status

app.post('/status',accessTokenSecret,async(req,res) =>{
     // console.log(req.files)
     const { order_id, delivery_status } = req.body;

     if(!order_id) return res.json({'status':false,'message':'Order id is required.'});
     if(!delivery_status) return res.json({'status':false,'message':'Status  is required.'});


       try{
           const order = await Order.update({delivery_status:delivery_status},{where:{order_id:order_id}});  
              // if(!order) return res.json({'status':false,'message':'Coupon not found.'}); 
             
           return res.json({'status':true,'message':'Status has been changed.'});
           
      }catch(err){
              console.log(err)
            return res.json({'status':false,'message':'Something is wrong.'});
      }
});








module.exports = app;





