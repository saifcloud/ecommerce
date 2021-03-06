const express = require('express');
const {sequelize, Sequelize,  Admin,Category } = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;


app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Category.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Category Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});

//Add Category
const store_cat_img = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/category/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});

const upload_category = multer({storage: store_cat_img});

app.post('/add',upload_category.single('image'),async(req,res) =>{
	const {name} = req.body;

	 if(!name) return res.json({'status':false,'message':'Name is required.'});
	 if(!req.file) return res.json({'status':false,'message':'Image is required.'});

	try{

		var checkName = await Category.findOne({where:{category_name:req.body.name,is_deleted:0}})
			if(!checkName){
	           var catdata = await Category.create({
			    category_name:req.body.name,
			    image:'category/'+req.file.filename,
			    status:1
			    });
	        }else{
	        return res.json({'status':false,'data':"","message":"Category Name Exist!!"})
	        }
		//console.log(catdata);
		return res.json({'status':true,"message":"Category Added Successfully."})
    
    }catch(err){
     console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update category

const store_cat_update = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/category/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});
const upload_category_update = multer({storage: store_cat_update});
app.post('/update',upload_category_update.single('image'),async(req, res)=>{
   
   try{
   	    var checkName = await Category.findOne(
   	    {where:{[Op.and]: [{category_name: req.body.name },{is_deleted: 0}, { id:{[Op.ne]: req.body.id}}]}}
   	    )
		if(!checkName){
		   	var catrec = await Category.findOne({where:{id:req.body.id}});
		   	if(!req.file){
		   		imagedata = catrec.image;
		   	}else{
		        imagedata = 'category/'+req.file.filename;
		   	}
			 var cat = await Category.update(
	            {category_name: req.body.name,
	             image:imagedata },
				{where:{id:req.body.id}
			});
			var cat_data = await Category.findOne({where:{id:req.body.id}});
			console.log(cat_data);	
			return res.json({'status':true,'data':cat_data,"message":"Category Updated"})
		}else{
			return res.json({'status':false,"message":"Category Name Exist!!"})
		} 
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Category
app.post('/delete',upload_category_update.single('image'),async(req, res)=>{
   
    try{
   	        var cat = await Category.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}
			});
			//console.log(cat_data);	
			return res.json({'status':true,'data':"","message":"Category Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});



module.exports = app;





