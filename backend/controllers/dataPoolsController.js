import dataPoolsActions from "../actions/dataPoolsActions.js";

export default class dataPoolsController{
    static async addDataPool(req, res, next){
        try{
            await dataPoolsActions.addDataPool(req.body)
            res.status(201).json({message: 'data_pool created'})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }
}