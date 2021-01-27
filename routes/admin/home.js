const express = require('express');
const { sequelize, Admin } = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();



app.post('/login',async(req,res) =>{
	const {email, password} = req.body;

	// if(!email)    return res.json({'status':false,'message':'Email is required.'});
	// if(!password) return res.json({'status':false,'message':'Password is required.'});

	try{

		// const hash = bcrypt.hashSync("123456", 10);
  //       const admin = Admin.create({
  //       	email:"admin@admin.com",
  //       	password:hash
  //       })

  
        return res.json(admin)
	}catch(err){
     console.log(err)
	}
});

module.exports = app;





