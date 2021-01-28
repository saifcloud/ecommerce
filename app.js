const express        = require('express');
const bodyParser     = require('body-parser');
const path           = require('path');
const multer         = require('multer');
const { sequelize }  = require('./models');
const app            = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(express.static(__dirname+'/public'))

//user
const HomeRoute      = require('./routes/home');
const AuthRoute      = require('./routes/auth');
const UserRoute      = require('./routes/user');
const UserCart       = require('./routes/cart');
const UserCheckout   = require('./routes/checkout');
const UserOrder      = require('./routes/order');


//admin 

const AdminHome         = require('./routes/admin/home');
const AdminCategory     = require('./routes/admin/category');
const AdminSubCategory  = require('./routes/admin/subcategory');
const AdminBrand        = require('./routes/admin/brand');
const AdminSize         = require('./routes/admin/size');
const AdminColor        = require('./routes/admin/color');
const AdminBanner       = require('./routes/admin/banner');


// user 
app.use('/api',HomeRoute);
app.use('/api/auth',AuthRoute);
app.use('/api/user',UserRoute);
app.use('/api/user/cart',UserCart);
app.use('/api/user/checkout',UserCheckout);
app.use('/api/user/order',UserOrder);


// admin
app.use('/admin',AdminHome);
app.use('/admin/category',AdminCategory);
app.use('/admin/subcategory',AdminSubCategory);
app.use('/admin/brand',AdminBrand);
app.use('/admin/size',AdminSize);
app.use('/admin/color',AdminColor);
app.use('/admin/banner',AdminBanner);




app.listen({port:5000}, async()=>{
	console.log("port 5000 is running");
})
