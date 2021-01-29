const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Subcategory ,Brand ,Help} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;



app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Help.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Help Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});


//Add 

app.post('/add',async(req,res) =>{
	const {description} = req.body;

	 if(!description) return res.json({'status':false,'message':'Description is required!!'});
	try{
               var data = await Help.create({
			    description:req.body.description
			    });
	    console.log(data);
		return res.json({'status':true,"message":"Help Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update 


app.post('/update',async(req, res)=>{
   
   try{
   	    ubcat = await Help.update(
	            {description: req.body.description},
				{where:{id:req.body.id}
			});
			var data = await Help.findOne({where:{id:req.body.id}});
			//console.log(data);	
			return res.json({'status':true,'data':data,"message":"Help Updated"})
		 
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


// //Delete 
// app.post('/delete',async(req, res)=>{
   
//     try{
//    	        var cat = await Brand.update(
// 	            {is_deleted: 1},
// 				{where:{id:req.body.id}
// 			});
// 			//console.log(cat_data);	
// 			return res.json({'status':true,'data':"","message":"Brand Deleted"})
		
// 		}catch(err){
// 			console.log(err);
// 		    return res.json({'status':false,"message":"Something is wrong!!"})
//         }
  
// });

module.exports = app;





