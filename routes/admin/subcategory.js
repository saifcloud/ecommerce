const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Subcategory} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;


// const store_subcat_img = multer.diskStorage({
// 	destination :(req,file,cb)=>{
// 		cb(null, 'public/category/');
// 	},
// 	filename:(req,file,cb)=>{
// 		cb(null,Date.now()+path.extname(file.originalname));
// 	}

// });

// const upload_subcategory = multer({storage: store_subcat_img});
app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Subcategory.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Sub Category Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});

//Add SubCategory
app.post('/add',async(req,res) =>{
	const {name} = req.body;

	 if(!name) return res.json({'status':false,'message':'Name is required!!'});
	try{

		var checkName = await Subcategory.findOne({where:{subcategory_name:req.body.name,is_deleted:0}})
			if(!checkName){
	           var Sub_cat_data = await Subcategory.create({
			    subcategory_name:req.body.name,
			    category_id:req.body.category_id,
			    status:1
			    });
	        }else{
	        return res.json({'status':false,'data':"","message":"Sub Category Name Exist!!"})
	        }
		//console.log(catdata);
		return res.json({'status':true,"message":"Sub Category Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update category

// const store_subcat_update = multer.diskStorage({
// 	destination :(req,file,cb)=>{
// 		cb(null, 'public/category/');
// 	},
// 	filename:(req,file,cb)=>{
// 		cb(null,Date.now()+path.extname(file.originalname));
// 	}

// });
// const upload_subcategory_update = multer({storage: store_subcat_update});
app.post('/update',async(req, res)=>{
   
   try{
   	    var checkName = await Subcategory.findOne(
   	    {where:{[Op.and]: [{subcategory_name: req.body.name},{is_deleted: 0}, { id:{[Op.ne]: req.body.id}}]}}
   	    )
   	    console.log(checkName);
		if(!checkName){
		   	subcat = await Subcategory.update(
	            {subcategory_name: req.body.name,
	             category_id:req.body.category_id},
				{where:{id:req.body.id}
			});
			var sub_cat_data = await Subcategory.findOne({where:{id:req.body.id}});
			console.log(sub_cat_data);	
			return res.json({'status':true,'data':sub_cat_data,"message":"Sub Category Updated"})
		}else{
			return res.json({'status':false,"message":"Sub Category Name Exist!!"})
		} 
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Sub  Category
app.post('/Delete',async(req, res)=>{
   
    try{
   	        var cat = await Subcategory.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}
			});
			//console.log(cat_data);	
			return res.json({'status':true,'data':"","message":"Sub Category Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});

module.exports = app;





