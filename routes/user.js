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
    Cart,
    Shipping_address
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
       user.address= '';//address;
       user.save();

       // const useraddress = await Shipping_address.create({
       //        user_id:user.id,
       //        name   : name,
       //        phone  :"",
       //        address:address,
       //        city   :"",
       //        country:"",
       //        address_type:"",
       // });
       return res.json({'status':true,"message":"Profile updated successfully"})
	}catch(err){
       console.log(err)
       return res.json({'status':false,'message':"Something is wrong"})
	}
	// return res.json(req.user)
});







module.exports = app;