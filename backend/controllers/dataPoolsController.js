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
    static async getDataPools(req, res, next){
        let dataRequest = {}
            // dataRequest.dataType = req.query.dataType
            // dataRequest.keyword = req.query.keyword
            // dataRequest.pool = req.query.pool
            // dataRequest.userID = req.query.userID
        try {
            const list = await  dataPoolsActions.addDataPool(dataRequest)
            res.status(201).json(list)
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }
}