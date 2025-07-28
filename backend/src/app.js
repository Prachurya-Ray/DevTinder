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
  throw new Error("Go")
  res.send('User.')
})

app.use('/',(err,req,res,next)=>{
  if(err){
    res.status(500).send("Sorry for interuption")
  }
})

app.listen(3000, () => {
  console.log("Successfully connected to 3000");
});
