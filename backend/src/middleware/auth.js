const adminAuth = (req, res, next) => {
  const auth = "xyz";
  const isAdmin = auth === "xyz";
  if (isAdmin) next();
  else res.status(401).send("Error");
};

const userAuth = (req, res, next) => {
  const auth = "xyz";
  const isUser = auth === "xyz";
  if (isUser) next();
  else res.status(401).send("Error");
};

module.exports ={
    adminAuth,
    userAuth
}