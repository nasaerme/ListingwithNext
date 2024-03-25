import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/database';
import User from '@/models/User';

export const authOptions = {
  providers:[
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks:{
    //Invoked on successfull signin
    async signIn({profile}){
      //1. Connect to database
      await connectDB();
      //2. Check if user exists
      const userExists = await User.findOne({email:profile.email})
      //3. if not, then add user to database
      if(!userExists){
        // Truncate user name if too long
        const username = profile.name.slice(0,20);
        await User.create({
          email:profile.email,
          username,
          image: profile.picture
        })
      }
      //4. return true to allowe sign in
      return true;
    },
    // Modifies the session object
    async session({session}){
      //1.Get the user from database
      const user = await User.findOne({email:session.user.email});
      //2. Assign the user id to session
      session.user.id = user._id.toString();
      //3. return session
      return session;
    }
  }
}