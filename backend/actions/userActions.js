import bcrypt from 'bcrypt'
import generateWebToken from '../utils/generateWebToken.js';
const saltRounds = 10;

let users

export default class userActions {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db('main').collection("users")
    } catch (e) {
      console.error(`Unable to connect to collection: Users ${e}`)
    }
  }

  static async authUser(userObject){
    const userEmail = userObject.email
    const userPassword = userObject.password
    console.log(userObject)
    try {
      const dbUser = await users.findOne({"email": userEmail})
      const isPassword = await bcrypt.compare(userPassword, dbUser.password)
      if (dbUser && isPassword){
        const userPayload = {
          _id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
          isAdmin: dbUser.isAdmin,
          pools: dbUser.pools,
          token: generateWebToken(dbUser._id)
        }
        return userPayload
      } else if (dbUser && !isPassword){
        return {authUser: false, message: 'wrong password'}
      } else if (!dbUser){
        return {authUser: false, message: 'user not found'}
      } else {
        return
      }
    } catch (e) {
      console.error(`Unable to determine if user is authorized or not: ${e}`)
      return
    }
    
  }

  static async addUser(userObject) {
    let newUser = {}
    const userEmail = userObject.email
    const userPassword = userObject.password
    try {
      const dbUser = await users.findOne({"email": userEmail})
      if (!dbUser){
        const hashedPassword = await bcrypt.hash(userPassword, saltRounds)
        newUser.name = userObject.name
        newUser.email = userObject.email
        newUser.password = hashedPassword
        newUser.isAdmin = false
        newUser.pools = []
        newUser.token = generateWebToken(userObject._id)
        await users.insertOne(newUser)
        return {message: `Welcome to Noodler,  ${newUser.name}`, registered: true}
      } else {
        return {message: `Sorry, email ${userObject.email} already exists`, registered: false}
      }
    } catch (e) {
      return { error: e }
    }
  }

 

  static async updateUser(userObject) {
    try {
      const updateData = await users.updateOne(
        {userObject},
      )
      return updateData
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }

  static async deleteUser(user_ID) {

    try {
      const deleteData = await users.deleteOne({
        _id: user_ID,
      })
      
      return deleteData
    } catch (e) {
      console.error(`Unable to delete user: ${e}`)
      return { error: e }
    }
  }

}