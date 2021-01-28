const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Subcategory ,Brand ,Size ,Color} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;



app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Color.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Color Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});

//Add Color

app.post('/add',async(req,res) =>{
	const {name} = req.body;

	 if(!name) return res.json({'status':false,'message':'Name is required!!'});
	try{

		var checkName = await Color.findOne({where:{name:req.body.name}})
			if(!checkName){
	           var data = await Color.create({
			    name:req.body.name,
			    status:1
			    });
	        }else{
	        return res.json({'status':false,'data':"","message":"Color Name Exist!!"})
	        }
		//console.log(catdata);
		return res.json({'status':true,"message":"Color Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update brand


app.post('/update',async(req, res)=>{
   
   try{
   	    var checkName = await Color.findOne(
   	    {where:{[Op.and]: [{name: req.body.name }, { id:{[Op.ne]: req.body.id}}]}}
   	    )
		if(!checkName){
		   	subcat = await Color.update(
	            {name: req.body.name},
				{where:{id:req.body.id}
			});
			var data = await Color.findOne({where:{id:req.body.id}});
			//console.log(data);	
			return res.json({'status':true,'data':data,"message":"Color Updated"})
		}else{
			return res.json({'status':false,"message":"Color Name Exist!!"})
		} 
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Sub  Category
app.post('/delete',async(req, res)=>{
   
    try{
   	        var cat = await Color.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}}
				);
			//console.log(cat_data);		
			return res.json({'status':true,'data':"","message":"Color Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});

module.exports = app;





