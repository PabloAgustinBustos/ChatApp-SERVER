import { Request, Response } from "express";
import bcryptjs, { hash } from "bcryptjs"
import prisma from "../prisma";
import generateToken from "../utils/generateToken";

export const signup = async(req: Request, res: Response) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body

    // Si no están los datos necesarios
    if (!fullname || !username || !password || !confirmPassword || !gender) {
      res.status(400).json({ error: "Please fill in all fields" })
      return 
    }
    
    // Si la contraseña no está confirmada
    if (password !== confirmPassword) {
      res.status(400).json({ error: "passwords don't match" })
      return
    }

    // Primero comprueba si ya existe un usuario con ese nombre
    const user = await prisma.user.findUnique({ where: { username } })

    if (user) {
      const obj = res.status(400).json({ error: "username already exists" })
      return
    }

    // Hashea la contraseña y crea una foto para ese usuario
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`

    // Crea el usuario
    const newUser = await prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        gender,
        profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture
      }
    })

    if (newUser) {
      // Generamos el token
      generateToken(newUser.id, res)

      res.status(200).json({
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePicture: newUser.profilePicture
      })
    } else {
      res.status(400).json({
        error: "invalid data"
      })
    }
  } catch(e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return 
  }
}

export const login = async(req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      const obj = res.status(404).json({ error: "Invalid username" })
      return
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      const obj = res.status(404).json({ error: "Invalid password" })
      return
    }

    generateToken(user.id, res)

    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePicture: user.profilePicture
    })
  } catch(e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return 
  }
}

export const logout = async(req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logout successfully" })
  } catch(e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return
  }
}