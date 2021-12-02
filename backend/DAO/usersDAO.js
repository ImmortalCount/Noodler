import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

var userSchema = {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }

var userPrototype = {
    name: 'Bill NoBody',
    password: '123456',
    email: 'BillNobody@gmail.com',

}

let users

export default class usersDAO {

    static async addUser(){
        try {
            return await users.insertOne(userPrototype)
        } catch (e) {
            console.error(`Unable to add module: ${e}`)
            return {error: e}
        }
        
    }

    static async updateUser(obj){
        try {
            const updateResponse = await users.updateOne(

            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e}
        }
    }

    static async deleteUser(){
        try {
            const deleteResponse = await users.deleteOne({
                _id: ObjectId(moduleID),
                user_id: userId,
            })
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete module: ${e}`)
            return {error: e}
        }
    }
}