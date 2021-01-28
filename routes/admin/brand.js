const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Subcategory ,Brand} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;



app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Brand.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Brand Data"})
		
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

		var checkName = await Brand.findOne({where:{name:req.body.name}})
			if(!checkName){
	           var data = await Brand.create({
			    name:req.body.name,
			    status:1
			    });
	        }else{
	        return res.json({'status':false,'data':"","message":"Brand Name Exist!!"})
	        }
		//console.log(catdata);
		return res.json({'status':true,"message":"Brand Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update brand


app.post('/update',async(req, res)=>{
   
   try{
   	    var checkName = await Brand.findOne(
   	    {where:{[Op.and]: [{name: req.body.name }, { id:{[Op.ne]: req.body.id}}]}}
   	    )
		if(!checkName){
		   	subcat = await Brand.update(
	            {name: req.body.name},
				{where:{id:req.body.id}
			});
			var data = await Brand.findOne({where:{id:req.body.id}});
			console.log(data);	
			return res.json({'status':true,'data':data,"message":"Brand Updated"})
		}else{
			return res.json({'status':false,"message":"Brand Name Exist!!"})
		} 
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Sub  Category
app.post('/delete',async(req, res)=>{
   
    try{
   	        var cat = await Brand.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}
			});
			//console.log(cat_data);	
			return res.json({'status':true,'data':"","message":"Brand Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});

module.exports = app;





