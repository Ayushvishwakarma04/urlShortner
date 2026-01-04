import jwt from "jsonwebtoken";

function authMiddleware(req,res,next){
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer ")){
    return res.status(401).json({messge:"Unauthorized"});
  }
  const token = authToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded; //for req.user.userID thus info store on req.user
    next()
  } catch (error) {
    return res.status(401).json({messge:"Invalid Token"});
  }
}

export{authMiddleware}

