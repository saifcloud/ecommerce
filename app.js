const express        = require('express');
const bodyParser     = require('body-parser');
const path           = require('path');
const multer              = require('multer');
const { sequelize }  = require('./models');
const app            = express();

const HomeRoute      = require('./routes/home');
const AuthRoute      = require('./routes/auth');
const UserRoute      = require('./routes/user');




app.use(express.json());
app.use(bodyParser.json())
app.use(express.static(__dirname+'/public'))



app.use('/api',HomeRoute);
app.use('/api/auth',AuthRoute);
app.use('/api/user',UserRoute);

app.listen({port:5000}, async()=>{
	console.log("port 5000 is running");
})
