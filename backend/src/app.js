const express = require("express");

const app = express();


app.use('/user',[(req,res,next)=>{
  console.log('hii')
  next();

  // res.send('Hello')
},(req,res,next)=>{
  console.log('hii 2')
  res.send('Hello 2')
  // next();

}])

app.listen(3000, () => {
  console.log("Successfully connected to 3000");
});
