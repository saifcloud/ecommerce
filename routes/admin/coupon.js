const express = require('express');
const { sequelize, Sequelize, Admin, Coupon } = require('../../models');
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

        const coupon = await Coupon.findAll({where:{status:1,is_deleted:0}}); 
        
        const coupondata = [];

         coupon.forEach((item)=>{

          coupondata.push({
            id:item.id,
            name:item.name,
            min_purchase:item.min_purchase,
            discount:item.discount,
            uses:item.uses,
            expiry_date: new Date(item.expiry_date).toLocaleString(),
            status:item.status
          })

        })
        // coupon.expiry_date = new Date( coupon.expiry_date).toLocaleString().split(' ');
        
        return res.json({'status':true,'data':{'coupon':coupondata},'message':'Coupons.'});
       
  }catch(err){
          console.log(err)
          return res.json({'status':false,'message':'Something is wrong.'});
  }
});



// profile update
// var ProfileStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, 'public/users');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });

// var profupload = multer({ storage : ProfileStorage }).array('image',1);



app.post('/add',accessTokenSecret,async(req,res) =>{
     // console.log(req.files)
     const { name, min_purchase, discount, uses, expiry_date} = req.body;

     if(!name) return res.json({'status':false,'message':'Name is required'});
     if(!min_purchase) return res.json({'status':false,'message':'Min purchase is required'});
     if(!discount) return res.json({'status':false,'message':'Discount is required'});
     if(!uses) return res.json({'status':false,'message':'Uses is required'});
     if(!expiry_date) return res.json({'status':false,'message':'Expirey date  is required'});


   try{
         
      const coupon = await Coupon.create({name:name, min_purchase:min_purchase, discount:discount, uses:uses, expiry_date:expiry_date}); 
         
         return res.json({'status':true,'message':'Coupon added successfully.'});
       
  }catch(err){
          console.log(err)
        return res.json({'status':false,'message':'Something is wrong.'});
  }
});



//edit coupon
app.post('/edit',accessTokenSecret,async(req,res) =>{
     // console.log(req.files)
     const { coupon_id } = req.body;

     if(!coupon_id) return res.json({'status':false,'message':'Coupon id is required.'});

         try{
               
             const coupon = await Coupon.findOne({where:{id:coupon_id,is_deleted:0}});
             if(!coupon) return res.json({'status':false,'message':'Coupon not found.'}); 
             


            const coupondata = { id:coupon.id,
                  name:coupon.name,
                  min_purchase:coupon.min_purchase,
                  discount:coupon.discount,
                  uses:coupon.uses,
                  expiry_date: new Date(coupon.expiry_date).toLocaleString(),
                  status:coupon.status};

          
         


             return res.json({'status':true,'data':{'coupon':coupondata},'message':'Edit coupon data.'});
             
        }catch(err){
                console.log(err)
              return res.json({'status':false,'message':'Something is wrong.'});
        }
});



// update coupon
app.post('/update',accessTokenSecret,async(req,res) =>{
     // console.log(req.files)
     const {coupon_id, name, min_purchase, discount, uses, expiry_date} = req.body;
     
     if(!coupon_id) return res.json({'status':false,'message':'Coupon id is required'});
     if(!name) return res.json({'status':false,'message':'Name is required'});
     if(!min_purchase) return res.json({'status':false,'message':'Min purchase is required'});
     if(!discount) return res.json({'status':false,'message':'Discount is required'});
     if(!uses) return res.json({'status':false,'message':'Uses is required'});
     if(!expiry_date) return res.json({'status':false,'message':'Expirey date  is required'});


   try{
         
      const coupon = await Coupon.update({name:name, min_purchase:min_purchase, discount:discount, uses:uses, expiry_date:expiry_date},{where:{id:coupon_id}}); 
         
         return res.json({'status':true,'message':'Coupon updated successfully.'});
       
  }catch(err){
          console.log(err)
        return res.json({'status':false,'message':'Something is wrong.'});
  }
});




// coupon delete
app.post('/delete',accessTokenSecret,async(req,res) =>{
     // console.log(req.files)
     const { coupon_id} = req.body;
     if(!coupon_id) return res.json({'status':false,'message':'Coupon id is required.'});

       try{
             
              const coupon = await Coupon.update({is_deleted:1},{where:{id:coupon_id}});  
              if(!coupon) return res.json({'status':false,'message':'Coupon not found.'}); 
             
             return res.json({'status':true,'message':'Profile updated successfully.'});
           
      }catch(err){
              console.log(err)
            return res.json({'status':false,'message':'Something is wrong.'});
      }
});








module.exports = app;





