import { Response, Request, } from "express";
import prisma from "../prisma";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body
    const { id: receiverID } = req.params
    const senderID = req.user.id

    // Primero busca si ya hay algun chat creado para estos dos usuarios
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderID, receiverID]
        }
      }
    })

    // De no existir, la creamos
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderID, receiverID]
          }
        }
      })
    }

    // Creamos el mensaje
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderID,
        body: message,
        conversationId: conversation.id
      }
    })

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id
            }
          }
        }
      })
    }

    // TODO SocketIO implementation

    res.status(201).json({ newMessage })
  } catch(e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params
    const senderId = req.user.id

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId]
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    })

    if (!conversation) {
      res.status(200).json([])
      return 
    }

    res.status(200).json(conversation.messages)
  } catch(e) {
    res.status(500).json({ message: "Internal server error", error: e })
    return
  }
}