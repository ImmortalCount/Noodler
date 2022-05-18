import musicDataActions from "../actions/musicDataActions.js";

export default class musicDataController{
    static async addMusicModule(req, res, next){
        try{
            const reply = await musicDataActions.addMusicData(req.body)
            res.status(201).json(reply)
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async updateMusicModule(req, res, next){
        try{
            const reply = await musicDataActions.updateMusicData(req.body)
            res.status(201).json(reply)
        } catch (e){
            res.status(500).json({error: e.message})
        }
    }
    static async getMusicModules(req, res, next){
        let dataRequest = {}
            dataRequest.dataType = req.query.dataType
            dataRequest.keyword = req.query.keyword
            dataRequest.pool = req.query.pool
            dataRequest.userID = req.query.userID
            dataRequest.pageNumber = req.query.pageNumber
        try {
            const list = await musicDataActions.getMusicData(dataRequest)
            res.status(201).json(list)
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }
}