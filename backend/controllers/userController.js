import userActions from "../actions/userActions.js"

export default class userController{
    static async authUser(req, res, next){
        try{
            const isAuth = await userActions.authUser(req.body)
            res.json(isAuth)
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }
    static async addUser(req, res, next){
        try{
            const userStatus = await userActions.addUser(req.body)
            res.status(201).json({message: userStatus.message, registered: userStatus.registered})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }
}