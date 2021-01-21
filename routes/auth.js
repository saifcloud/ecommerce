const express    = require('express');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { sequelize, User } = require('../models');
const accessTokenSecret  = require('../middleware/authMiddleware');
const  transportMailer   = require('../helper/transportMailer');

const app     = express();


//user login
app.post('/login',async(req, res)=>{
	 console.log('login');
});



//user register
app.post('/register',async(req, res)=>{
	// console.log('register');
	const { phone } = req.body;
	if(!phone) throw res.json({'status':false,"message":"Phone number is required"});

	try{
		const checkIfAlreadyExist =  await User.findOne({where:{phone:phone,is_deleted:0}});
		// if(checkIfAlreadyExist) throw res.json({'status':false,"message":"Number already exist"});
		const otp = 1234;//Math.floor((Math.random()*9999)+1111);
		
		if(checkIfAlreadyExist) {
        var user = await User.findOne({where:{phone:phone,is_deleted:0}});
        user.otp = otp;
        user.save();
       
		}else{
		 var user =  await User.create({phone:phone,otp:otp});

		}
		return res.json({'status':true,'data':{user_id:user.id},'message':"Otp has been sent to your number"})
	}catch(err){
	    console.log(err)
		return res.json({'status':false,"message":"Something is wrong please try again later"}); 
	}
});



// otp verfication



app.post('/otp-verification',async(req,res)=>{
   const { user_id, otp } = req.body;

   if(!user_id) return res.json({'status':false,'message':"User id is required"});
   if(!otp)     return res.json({'status':false,'message':"Otp is required"});

   try{
     user = await User.findOne({where:{id:user_id,is_deleted:0}});
     if(!user) return res.json({'status':false,"message":"User not found"});

     if(user.otp == otp)
     {  
     	user.status =1;
     	user.save();
     	const accessToken = jwt.sign({user_id:user.id,phone:user.phone},'sssshhhh');


      const message = {
        from: 'saif.cloudwapp@gmail.com', // Sender address
        to: 'saif@mailinator.com',         // recipients
        subject: 'OTP verfication code', // Subject line
        // text: 'Successfully! received mail using nodejs' // Plain text body
        html:'<h2>Welcome your are registered successfully</h2>'
      };

       var sentRegMail = await transportMailer.sendMail(message);


     	return res.json({"status":true,"data":{accessToken:accessToken},"message":"Registered successfully"});
     }else{
     	return res.json({'status':false,"message":"Otp is not matched"});
     }

   }catch(err){
     console.log(err);
   }
});


module.exports = app;


