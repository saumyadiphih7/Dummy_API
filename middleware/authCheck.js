import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"


const authCheck = asyncHandler(async (req, res, next) => { 

  let token

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user=decoded
      next()
    } catch (error) {
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if(!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }

})


export default authCheck