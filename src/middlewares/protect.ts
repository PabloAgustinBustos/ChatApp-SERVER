import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express" 
import cookieParser from "cookie-parser"
import prisma from "../prisma"

// Creamos una interface para que typescript sepa que el payload tendrá un userID
interface DecodedToken extends JwtPayload {
  userID: string
}

// Permitimos que typescript sepa que el objeto req puede tener un user
declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string
      }
    }
  }
}

const protect = async(req: Request, res: Response, next: NextFunction) => {
  console.log("protect")
  try {
    const token = req.cookies.jwt

    console.log("token", token)
    if (!token) {
      res.status(401).json({ error: "No token provided" })
      return
    }

    const decoded = jwt.verify(token, process.env.SECRET!) as DecodedToken

    console.log("decoded", decoded)

    if (!decoded) {
      res.status(401).json({ error: "Invalid token" })
      return
    }
    
    console.log("Buscando user")
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userID },  
      select: { id: true, username: true, fullname: true, profilePicture: true }
    })
    console.log("user", user)

    if (!user) {
      res.status(404).json({ error: "user not found" })
      return
    }

    req.user = user
    console.log("user anclado a la request")

    next()
  } catch (e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return
  }
}

export default protect