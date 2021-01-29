const express = require('express');
const { sequelize, Sequelize, Admin } = require('../../models');
const bcrypt    = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const multer  = require('multer');
const app     = express();



const accessTokenSecret   = require('../../middleware/authMiddleware');
const Op = Sequelize.Op;



// login
app.post('/login',async(req,res) =>{
	const {email, password} = req.body;

	if(!email)    return res.json({'status':false,'message':'Email is required.'});
	if(!password) return res.json({'status':false,'message':'Password is required.'});

	try{

		// const hash = bcrypt.hashSync("123456", 10);
  //       const admin = Admin.create({
  //       	email:"admin@admin.com",
  //       	password:hash
  //       })
     
        const admin = await Admin.findOne({where:{email:email,status:1,is_deleted:0}}); 
        if(!admin) return res.json({'status':false,'message':'User not found.'});
        
        const match = await bcrypt.compare(password, admin.password);
        
         console.log(match)
        if(match){

           const accessToken = jwt.sign({admin_id:admin.id,email:admin.email,name:admin.name},'sssshhhh');
           return res.json({'status':true,'data':{token:accessToken},'message':'Login successfully.'});
        }
         return res.json({'status':false,'message':'Check email or password.'});
       
	}catch(err){
          console.log(err)
          return res.json({'status':false,'message':'Something is wrong.'});
	}
});





// profile
app.get('/get-profile',accessTokenSecret,async(req,res) =>{
  // console.log(req.user)
   try{

        const admin = await Admin.findOne({where:{id:req.user.admin_id,status:1,is_deleted:0},attributes:{exclude: ['password']}}); 
        
        return res.json({'status':false,'data':{'profile':admin},'message':'Profile data.'});
       
  }catch(err){
          console.log(err)
          return res.json({'status':false,'message':'Something is wrong.'});
  }
});



// profile update
var ProfileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/users');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var profupload = multer({ storage : ProfileStorage }).array('image',1);



app.post('/update-profile',accessTokenSecret,profupload,async(req,res) =>{
     // console.log(req.files)
     const { name, password} = req.body;
   try{
         
        const hash = bcrypt.hashSync(password, 10);

        const admin = await Admin.update({
          name:name,password:hash,image:'users/'+req.files[0].filename
        },{where:{id:req.user.admin_id,status:1,is_deleted:0}}); 
         
         return res.json({'status':true,'message':'Profile updated successfully.'});
       
  }catch(err){
          console.log(err)
        return res.json({'status':false,'message':'Something is wrong.'});
  }
});







module.exports = app;





