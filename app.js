const express        = require('express');
const bodyParser     = require('body-parser');
const path           = require('path');
const multer              = require('multer');
const { sequelize }  = require('./models');
const app            = express();

const HomeRoute      = require('./routes/home');
const AuthRoute      = require('./routes/auth');
const UserRoute      = require('./routes/user');
const UserCart       = require('./routes/cart');
const UserCheckout   = require('./routes/checkout');
const UserOrder      = require('./routes/order');




app.use(express.json());
app.use(bodyParser.json())
app.use(express.static(__dirname+'/public'))



app.use('/api',HomeRoute);
app.use('/api/auth',AuthRoute);
app.use('/api/user',UserRoute);
app.use('/api/user/cart',UserCart);
app.use('/api/user/checkout',UserCheckout);
app.use('/api/user/order',UserOrder);

app.listen({port:5000}, async()=>{
	console.log("port 5000 is running");
})
