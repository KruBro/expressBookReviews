const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const authenticate = (req, res, next) => {
    if (req.session && req.session.authorization) {
      const token = req.session.authorization.accessToken;
      jwt.verify(token, 'kingdom', (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({ message: "No token provided" });
    }
  };
  
  

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });  
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
