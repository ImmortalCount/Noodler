
import usersDAO from "../DAO/usersDAO"

export default class UsersController {
    
    static async apiAddUsers(req, res, next){
        await usersDAO.addUser()
        res.json({status: 'sucess'})
    }
    


}