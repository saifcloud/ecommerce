const express = require('express');
const {sequelize, Sequelize,  Admin,Category ,Banner} = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;



app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await Banner.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"Banner Updated"})
		
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});
  

//Add Banner
const store_img = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/banner/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});

const upload_banner = multer({storage: store_img});

app.post('/add',upload_banner.single('image'),async(req,res) =>{
	
	 if(!req.file) return res.json({'status':false,'message':'Image is required.'});

	try{
           
	           var catdata = await Banner.create({
			    image:'banner/'+req.file.filename,
			    status:1
			    });
	    //console.log(catdata);
		return res.json({'status':true,"message":"Banner Added Successfully."})
    
    }catch(err){
    console.log(err)
     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
	}
});



//update Banner

const store_img_update = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/banner/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});
const upload_update = multer({storage: store_img_update});
app.post('/update',upload_update.single('image'),async(req, res)=>{
   
   try{
   	    var catrec = await Banner.findOne({where:{id:req.body.id}});
		   	if(!req.file){
		   		imagedata = catrec.image;
		   	}else{
		        imagedata = 'banner/'+req.file.filename;
		   	}
			 var cat = await Banner.update(
	            {image:imagedata },
				{where:{id:req.body.id}
			});
			var cat_data = await Banner.findOne({where:{id:req.body.id}});
			//console.log(cat_data);	
			return res.json({'status':true,'data':cat_data,"message":"Banner Updated"})
		
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete Banner
app.post('/delete',async(req, res)=>{
   
    try{
   	        var cat = await Banner.update(
	            {is_deleted: 1},
				{where:{id:req.body.id}
			});
			//console.log(cat_data);	
			return res.json({'status':true,'data':"","message":"Banner Deleted"})
		
		}catch(err){
			console.log(err);
		    return res.json({'status':false,"message":"Something is wrong!!"})
        }
  
});


module.exports = app;





