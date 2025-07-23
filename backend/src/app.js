const express = require("express");

const app = express();


//handling GET request
app.get("/user",(req,res)=>{
  res.send({firstName:"Prachurya", lastName:"Ray"});
});

app.post("/user", (req, res) => {
  res.send("Saved");
});

app.patch("/user", (req, res) => {
  res.send("Saved");
});

app.delete("/user", (req, res) => {
  res.send("Deleted");
});


app.use("/test", (req, res) => {
  res.send("Hello to our test");
});
app.use("/check", (req, res) => {
  res.send("Hello for checking");
});
app.use("/", (req, res) => {
  res.send("Hello from our server!");
});

app.listen(3000, () => {
  console.log("Successfully connected to 3000");
});
