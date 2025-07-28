const express = require("express");

const app = express();

const {adminAuth, userAuth} = require('./middleware/auth') 

app.use("/admin", adminAuth);

app.get("/admin",(req,res)=>{
  res.send("Done.")
})

app.delete("/admin",(req,res)=>{
  res.send("Deleted.")
})

app.get('/user/login',(req,res)=>{
  res.send('Login')
})

app.get('/user/data',userAuth,(req,res)=>{
  res.send('User.')
})

app.listen(3000, () => {
  console.log("Successfully connected to 3000");
});
