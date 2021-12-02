import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

const dataModulePrototype = {
    // _id: ObjectId,
    name: "prototype module",
    series: 'part 5 of the jazz pack',
    author: 'devnaut',
    category: 'jazz', 
    key: 0,
    chord: '',
    scale: [],
    pattern: [],
    rhythm: [],
    position: [],
    numNotes: 8,
    beats: 4,
    speed: '4d'
}

let modules;

export default class modulesDAO {
    static async injectDB(conn) {
        if (modules){
            return
        } try {
            modules = await conn.db(process.env.MODULES_NS).collection("modules")
        } catch (e) {
            console.error(`Unable to establish a collection handle in modulesDAO: ${e}`)
        }
    }

    static async getModules({
        filters = null,
        page = 0,
        modulesPerPage = 20,
    } ={}){
        let query
        if (filters){
            if ("name" in filters){
                query = {$test: { $search: filters['name']}}
            } else if ("category" in filters){
                query = {"category": {$eq: filters["category"]}}
            } else if ("numNotes" in filters){
                query = {"numNotes": {$eq: filters["numNotes"]}}
            } else if ("beats" in filters){
                query = {"beats": {$eq: filters["beats"]}}
            }
        }
        let cursor

        try {
            cursor = await modules.find(query)
        } catch (e){
            console.error(`Unable to issue find command, ${e}`)
            return { modulesList: [], totalNumModules: 0 }
        }

        const displayCursor = cursor.limit(modulesPerPage).skip(modulesPerPage * page)

        try {
            const modulesList = await displayCursor.toArray()
            const totalNumModules = await modules.countDocuments(query)

            return { modulesList, totalNumModules}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return {modulesList: [], totalNumModules: 0 }
        }
    }

    static async addModule(){
        try {
            return await modules.insertOne(dataModulePrototype)
        } catch (e) {
            console.error(`Unable to add module: ${e}`)
            return {error: e}
        }
        
    }

    static async updateModule(obj){
        try {
            const updateResponse = await modules.updateOne(

            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e}
        }
    }

    static async deleteModule(){
        try {
            const deleteResponse = await modules.deleteOne({
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


