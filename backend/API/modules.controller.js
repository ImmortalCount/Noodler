
import modulesDAO from "../DAO/modulesDAO.js";

export default class ModulesController {
    static async apiGetModules(req, res, next){
        const modulesPerPage = req.query.modulesPerPage ? parseInt(req.query.modulesPerPage, 10) : 20
        const page = req.query.page ? (parseInt(req.query.page, 10)) : 0

        let filters = {}
        if (req.query.category) {
            filters.category = req.query.category
        } else if (req.query.numNotes){
            filters.numNotes = req.query.numNotes
        } else if (req.query.beats){
            filters.beats = req.query.beats
        } else if (req.query.name){
            filters.name = req.query.name
        } 

        const { modulesList, totalNumModules } = await modulesDAO.getModules({
            filters,
            page,
            modulesPerPage
        })

        let response = {
            modules: modulesList,
            page: page,
            filters: filters,
            entries_per_page: modulesPerPage,
            total_results: totalNumModules,
            test: 'test'
        }
        res.json(response)
    }
    


}