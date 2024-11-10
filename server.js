 // Requiring express module
 const express = require('express');
 const app = express();
 const path =require('path')
const session = require('express-session');
const nocache = require('nocache')


// Requiring the access to the file 'user and admin' inside the 'routes' foulder.
const usreRoutes = require('./routes/user.js')
const adminRoutes = require('./routes/admin.js');
//const { connect } = require('http2');
const connectDB = require('./db/connectDB.js');


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));// Serve static files from the public directory


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(nocache())
app.use(session({
   secret:'mysecretkey',
   resave:false,
   saveUninitialized:true,
   cookie:{
      maxAge:1000*60*60*24
   }
}))



app.use('/user',usreRoutes)
app.use('/admin',adminRoutes)

connectDB()

 app.listen(3000,()=>{
    console.log('server is running');
 })

