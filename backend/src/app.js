const express = require("express");

const app = express();


//handling GET request
app.get(/.*fly$/,(req,res)=>{
  res.send({firstName:"Prachurya", lastName:"Ray"});
});

//handling GET request
app.get("/user/:userID/:name/:pw",(req,res)=>{
  console.log(req.params)
  console.log(req.query)
  res.send({firstName:"Prachurya", lastName:"Ray"});
});



app.listen(3000, () => {
  console.log("Successfully connected to 3000");
});
