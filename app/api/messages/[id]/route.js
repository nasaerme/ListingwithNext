import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic'

// PUT /api/messages/:id

export const PUT = async(request,{params})=>{
  try {
    await connectDB()
    const {id} = params
    const sessionUser = await getSessionUser();

    if(!sessionUser || !sessionUser.user){
      return new Response('user id is required', {status:401})
    }
    const {userId} = sessionUser;
    const message = await Message.findById(id);
    if(!message){
      return new Response('Message not found', {status:404})
    }
    //verify ownership
    if(message.recipient.toString() !== userId){
      return new Response('Unathorized', {status:401})
    }

    //update message to read/unread depending on the current status
    message.read = !message.read;

    await message.save();

    return new Response(JSON.stringify(message),{status:200})


  } catch (error) {
    console.log(error)
    return new Response('Something went wrong', {status:500})
  }
}

// Delete /api/messages/:id

export const DELETE = async(request,{params})=>{
  try {
    await connectDB()
    const {id} = params
    const sessionUser = await getSessionUser();

    if(!sessionUser || !sessionUser.user){
      return new Response('user id is required', {status:401})
    }
    const {userId} = sessionUser;
    const message = await Message.findById(id);
    if(!message){
      return new Response('Message not found', {status:404})
    }
    //verify ownership
    if(message.recipient.toString() !== userId){
      return new Response('Unathorized', {status:401})
    }

    //Delete message to 
    await message.deleteOne()

    return new Response('Message has been deleted',{status:200})


  } catch (error) {
    console.log(error)
    return new Response('Something went wrong', {status:500})
  }
}
