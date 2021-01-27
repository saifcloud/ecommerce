const express = require('express');
const { sequelize, Sequelize, Admin } = require('../../models');
const bcrypt    = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const app     = express();



const accessTokenSecret   = require('../../middleware/authMiddleware');
const Op = Sequelize.Op;




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
        if(!admin) return res.json({'status':false,'message':'User not found'});
        
        const match = await bcrypt.compare(password, admin.password);
        
         console.log(match)
        if(match){

           const accessToken = jwt.sign({admin:admin.id,email:admin.email,name:admin.name},'sssshhhh');
           return res.json({'status':true,'data':{token:accessToken},'message':'Login successfully.'});
        }
         return res.json({'status':false,'message':'Check email or password.'});
       
	}catch(err){
          console.log(err)
          return res.json({'status':false,'message':'Something is wrong.'});
	}
});






module.exports = app;





