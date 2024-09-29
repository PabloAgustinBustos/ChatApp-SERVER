import { Response } from "express"
import jwt from "jsonwebtoken"

const generateToken = (userID: string, res: Response) => {
  // Podemos pasar cualquier cosa como payload, pero es mejor pasar
  // solo el ID para identificar al usuario.
  const token = jwt.sign({ userID }, process.env.SECRET!, {
    expiresIn: "15d"
  })

  // Guarda el token en una cookie
  res.cookie("jwt", token, {
    maxAge: 15*24*60*60*1000,
    httpOnly: true,       // Para que la cookie no sea accesible por javascript y evitar ataques XSS
    sameSite: "strict",   // Previene ataques CSRF
    secure: process.env.NODE_ENV !== "development"
  })

  return token
}

export default generateToken