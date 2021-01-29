const express        = require('express');
const bodyParser     = require('body-parser');
const path           = require('path');
const multer         = require('multer');
const { sequelize }  = require('./models');
const app            = express();




// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: false }));
 // app.use(express.json());
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
const AdminProduct      = require('./routes/admin/product');
const AdminProducttest  = require('./routes/admin/producttest');
const AdminCoupon       = require('./routes/admin/coupon');
const AdminOrder        = require('./routes/admin/order');
const AdminAbout        = require('./routes/admin/about');
const AdminHelp        = require('./routes/admin/help');






// user 
app.use('/api',HomeRoute);
app.use('/api/auth',AuthRoute);
app.use('/api/user',UserRoute);
app.use('/api/user/cart',UserCart);
app.use('/api/user/checkout',UserCheckout);
app.use('/api/user/order',UserOrder);


// admin
app.use('/admin',AdminHome);
app.use('/admin/product',AdminProduct);
app.use('/admin/producttest',AdminProducttest);
app.use('/admin/category',AdminCategory);

app.use('/admin/subcategory',AdminSubCategory);
app.use('/admin/brand',AdminBrand);
app.use('/admin/size',AdminSize);
app.use('/admin/color',AdminColor);
app.use('/admin/banner',AdminBanner);

app.use('/admin/coupon',AdminCoupon);
app.use('/admin/order',AdminOrder);
app.use('/admin/about',AdminAbout);
app.use('/admin/help',AdminHelp);




app.listen({port:5000}, async()=>{
	console.log("port 5000 is running");
})
