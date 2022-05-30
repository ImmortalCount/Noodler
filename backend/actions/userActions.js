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
    try {
      if (userEmail.length === 0 && userPassword.length === 0){
        return {authUser: false, message: 'please enter your email and password'}
      } 
      if (userEmail.length === 0){
        return {message: 'please enter your email address'}
      }
      if (userPassword.length === 0){
        return {message: 'please enter your password'}
      }

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
        return {authUser: true, message: 'success', payload: userPayload} 
      } else if (dbUser && !isPassword){
        return {authUser: false, message: 'wrong password'}
      }  else {
        return
      }
    } catch (e) {
      return {authUser: false, message: 'user was not found'}
    }
    
  }

  static async addUser(userObject) {
    let newUser = {}
    const userEmail = userObject.email
    const userPassword = userObject.password
    const confirmPassword = userObject.confirmPassword
    const userName = userObject.name
    try {
      const dbUserEmail = await users.findOne({"email": userEmail})
      const dbUserName = await users.findOne({"name": userName})
      if (dbUserEmail){
        return {message: `The email ${userEmail} is already registered`, registered: false}
      }
      if (dbUserName){
        return {message: `Sorry, the username ${userName} is already taken`}
      }
      if (userPassword.length === 0){
        return {message: `Please enter a password`}
      }
      if (userPassword.length < 6){
        return {message: `Please make your password 6 characters or longer`}
      }
      if (confirmPassword.length === 0){
        return {message: `Please confirm your password`}
      }
      if (confirmPassword !== userPassword){
        return {message: `Your passwords do not match`}
      }
      if (!dbUserEmail && !dbUserName){
        const hashedPassword = await bcrypt.hash(userPassword, saltRounds)
        newUser.name = userObject.name
        newUser.email = userObject.email
        newUser.password = hashedPassword
        newUser.isAdmin = false
        newUser.pools = []
        newUser.token = generateWebToken(userObject._id)
        await users.insertOne(newUser)
        return {message: `Successfully Registered`, registered: true}
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