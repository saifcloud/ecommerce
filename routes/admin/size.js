const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Subcategory ,Brand ,Size} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;




app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Size.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Size Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});

//Add Brand

app.post('/add',async(req,res) =>{
	const {name} = req.body;

	 if(!name) return res.json({'status':false,'message':'Name is required!!'});
	try{

		var checkName = await Size.findOne({where:{name:req.body.name,is_deleted:0}})
			if(!checkName){
	           var data = await Size.create({
			    name:req.body.name,
			    status:1
			    });
	        }else{
	        return res.json({'status':false,'data':"","message":"Size Name Exist!!"})
	        }
		//console.log(catdata);
		return res.json({'status':true,"message":"Size Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update brand


app.post('/update',async(req, res)=>{
   
   try{
   	    var checkName = await Size.findOne(
   	    {where:{[Op.and]: [{name: req.body.name },{is_deleted: 0 }, { id:{[Op.ne]: req.body.id}}]}}
   	    )
		if(!checkName){
		   	subcat = await Size.update(
	            {name: req.body.name},
				{where:{id:req.body.id}
			});
			var data = await Size.findOne({where:{id:req.body.id}});
			//console.log(data);	
			return res.json({'status':true,'data':data,"message":"Size Updated"})
		}else{
			return res.json({'status':false,"message":"Size Name Exist!!"})
		} 
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Sub  Category
app.post('/delete',async(req, res)=>{
   
    try{
   	        var cat = await Size.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}
			});
			//console.log(cat_data);	
			return res.json({'status':true,'data':"","message":"Size Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});

module.exports = app;





