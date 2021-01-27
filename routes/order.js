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
    Order,
    Order_detail
} = require('../models');

const accessTokenSecret   = require('../middleware/authMiddleware');
const Op = Sequelize.Op;



app.post('/',accessTokenSecret,async(req,res)=>{
	const { coupon_id, address_id } = req.body;
	try{
		// console.log(Math.round(999999999 + Math.random()*(999999999-1111111111)))
        const coupon = await Coupon.findOne({where:{id:coupon_id}});
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


		var orderNumber = 'ORDER'+Math.round(999999999 + Math.random()*(999999999-1111111111));
        const order = await Order.create({
                         order_id:orderNumber,
                         user_id:req.user.user_id,
                         address_id:address_id,
                         transaction_id:'',
                         total_order:cart.length,
                         coupon_discount:coupon.discount,
                         total_amount:total,
                         payment_status:1,//1=> pending
                         delivery_status:1,//1=> pending
                         delivery_date:new Date().toISOString().slice(0,10)

        });
         

         for(var i=0; i<cart.length; i++){
             const order_details = await Order_detail.create({
                              'order_id':orderNumber,
                              'product_id':cart[i].product_id,
                              'size_id':cart[i].size,
                              'color_id':cart[i].color,
                              'price':cart[i].price_after_discount,
                              'qty':cart[i].qty,
                              'total_price':cart[i].total
                          })

            }

           
      return res.json({'status':true,data:{order_id:orderNumber},'message':'Order placed successfully'})
	}catch(err){
       // console.log(err)
       return res.json({'status':false,'message':'Something is wrong.'});
	}
});




//get my orders 
app.get('/myorder',accessTokenSecret,async(req,res)=>{
    // console.log(req.user.user_id)
    try{
           const user = await User.findOne({where:{id:req.user.user_id}});
           const order = await Order.findAll({
            where:{user_id:req.user.user_id},
            include:{
                model:Order_detail,
                as:'orderDetails'
            }
           })
           

           var myorders = [];
           order.forEach((item) => {
             var dt = new Date(item.createdAt).toLocaleString().split(' ');
             
             // myordersDetails = [];
             // item.orderDetails.forEach((value) =>{
             //  myordersDetails.push({
             //    'customer_details':{
             //        'order_id':value.order_id,
             //        'customer_name':user.name,
             //        'email':user.email,
             //        'shipping_details'
             //    }
                

             //  })
             // })

               myorders.push({
                    'order_id':item.order_id,
                    'total_item':item.total_order,
                    'order_date': dt[0],
                    'order_time': dt[1],
                    // 'order_details':myordersDetails
               })
           })


        // return res.json(order)
        return res.json({'status':true,data:{'myorders':myorders},'message':'My order list'})
    }catch(err){
    console.log(err)
       return res.json({'status':false,'message':'Something is wrong.'});
    }
});






//get my orders  details
app.post('/details',accessTokenSecret,async(req,res)=>{
    // console.log(req.user.user_id)
    const { order_id } = req.body;
    try{
           const user = await User.findOne({where:{id:req.user.user_id}});

           const order = await Order.findOne({ 
                 where: {user_id:req.user.user_id},
                 include:{model:Shipping_address,as:'shipping_address'}
            })
           const order_details = await Order_detail.findAll({
                where:{order_id:order_id},
                include:{
                    model:Product,
                    as:'product',
                    include:[
                                {
                                    model:Product_image,
                                    as:'product_image'
                                },
                                {
                                    model:Product_color,
                                    as:'product_color'
                                },
                                {
                                    model:Product_size,
                                    as:'product_size'
                                },
                            ]

                }
            })
           

             var customer_details = {
                 'order_id':order_id,
                 'customer_name':user.name,
                 'email':user.email
             };

             
             var orderDetails  = [];

             order_details.forEach((item) => {
             // var dt = new Date(item.createdAt).toLocaleString().split(' ');

              orderDetails.push({
                           'image':item.product.product_image[0].image,
                           'item_name':item.product.product_name,
                           'price':item.price,
                           'qty':item.qty,
                           'total':item.total_price

                    })
              })

             var order_datetime = new Date(order.delivery_date).toLocaleString().split(' ');

             if(order.coupon_discount !='' || order.coupon_discount!=null)
             {
                 // console.log('work')

                 var subtotal  = order.total_amount;
                 var discount  = (order.coupon_discount/100*order.total_amount).toFixed(2);
                 var total     = (order.total_amount - discount).toFixed(2);
                  // console.log('order '+order_datetime)
                 return res.json({'status':true,data:{'order_datetime':order_datetime[0]+' '+order_datetime[1],'customer_details':customer_details,'shipping_details':order.shipping_address,'items':orderDetails,'subtotal':subtotal,'discount':discount,'total':total},'message':'My order list'})

             }else{
                 // console.log('work')
                 var subtotal  = order.total_amount;
                 // var discount  = order.discount;
                 var total     = order.total_amount;
                 return res.json({'status':true,data:{'order_datetime':order_datetime[0]+' '+order_datetime[1],'customer_details':customer_details,'shipping_details':order.shipping_address,'items':orderDetails,'subtotal':subtotal,'total':total},'message':'My order list'})
             }
            

        // return res.json(order_details)
        // return res.json(order)
        // return res.json({'status':true,data:{'customer_details':customer_details,'shipping_details':order.shipping_address,'items':orderDetails,'subtotal':subtotal,'total':total},'message':'My order list'})
    }catch(err){
    console.log(err)
       return res.json({'status':false,'message':'Something is wrong.'});
    }
});



//product filter

app.post('product-filter',)

module.exports = app;