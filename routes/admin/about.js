const express = require('express');
const {sequelize, Sequelize,Admin,About } = require('../../models');
const bcrypt    = require('bcryptjs');
const app     = express();
const multer         = require('multer');
var path    =    require('path');

const Op = Sequelize.Op;


app.get('/',async(req, res)=>{
   
   try{
   	       var rec = await About.findAll();
		   //console.log(cat_data);	
			return res.json({'status':true,'data':rec,"message":"About Data"})
		
		}catch(err){
			//console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
});

//Add 
const storeimg = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/about/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});

const upload = multer({storage: storeimg});

app.post('/add',upload.single('image'),async(req,res) =>{
	const {title,description} = req.body;

	 if(!title) return res.json({'status':false,'message':'Title is required.'});
	 if(!description) return res.json({'status':false,'message':'Description is required.'});
	 if(!req.file) return res.json({'status':false,'message':'Image is required.'});

	try{
               var catdata = await About.create({
			    title:req.body.title,
			    description:req.body.description,
			    image:'about/'+req.file.filename,
			   });
	        
		      //console.log(catdata);
		return res.json({'status':true,"message":"About Added Successfully."})
    
	    }catch(err){
	     console.log(err)
	     return res.json({'status':false,'data':"","message":"Something went Wrong!"})
		}
});



//update 

const storeupdate = multer.diskStorage({
	destination :(req,file,cb)=>{
		cb(null, 'public/about/');
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname));
	}

});
const uploadupdate = multer({storage: storeupdate});
app.post('/update',uploadupdate.single('image'),async(req, res)=>{
   
   try{
   	   
		   	var rec = await About.findOne({where:{id:req.body.id}});
		   	if(!req.file){
		   		imagedata = rec.image;
		   	}else{
		        imagedata = 'about/'+req.file.filename;
		   	}
			 var data = await About.update(
	            {title: req.body.title,
	             description: req.body.description,
	             image:imagedata },
				{where:{id:req.body.id}
			});
			var data = await About.findOne({where:{id:req.body.id}});
			console.log(data);	
			return res.json({'status':true,'data':data,"message":"About Updated"})
		}catch(err){
			console.log(err);
		return res.json({'status':false,"message":"Something is wrong!!"})

		}
  
});


//Delete 
// app.post('/delete',async(req, res)=>{
   
//     try{
//    	        var data = await About.destroy({where:{id:req.body.id}
// 			});
// 			//console.log(cat_data);	
// 			return res.json({'status':true,'data':"","message":"About Deleted"})
		
// 		}catch(err){
// 			console.log(err);
// 		    return res.json({'status':false,"message":"Something is wrong!!"})
//         }
  
// });



module.exports = app;





