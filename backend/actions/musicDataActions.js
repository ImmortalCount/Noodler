let music_data
import { ObjectId } from "mongodb"

export default class musicDataActions {
  static async injectDB(conn) {
    if (music_data) {
      return
    }
    try {//
      music_data = await conn.db('main').collection("music_data")
    } catch (e) {
      console.error(`Unable to connect to collection: music_data ${e}`)
    }
  }

  static async addMusicData(dataObject) {
    try {
      const dataType = dataObject.dataType
      const dataName = dataObject.name
      // let displayName;
      // if (dataType === 'scale'){
      //   displayName = dataObject
      // }
      console.log(dataObject, 'dataObject from musicDataActions')
      const authorId = dataObject.authorId
      const pool = dataObject.pool
      let poolName;
      if (pool === authorId){
        poolName = 'local'
      } else {
        poolName = pool
      }
      const identicalItem = await music_data.findOne(
        {authorId: authorId, name: dataName, pool: pool}
      )
      const isUnique = (identicalItem === null)
      if (!isUnique){
        return {message: `You have already uploaded a file named ${dataName} to ${poolName} pool.`, success: false}
      } else {
        await music_data.insertOne(dataObject)
        return {message: `${dataName} successfully uploaded to ${poolName} pool`, success: true}
      }

    } catch (e) {
      console.error(`Unable to add music_data: ${e}`)
      return { error: e }
    }
  }

  static async updateMusicData(dataObject) {
    try {
      const dataName = dataObject.name
      await music_data.replaceOne(
        {_id: ObjectId(dataObject['_id'])},{dataObject}
      )
      return {message: `${dataName} was successfully updated`, success: true}
    } catch (e) {
      console.error(`Unable to update music_data: ${e}`)
      return { error: e }
    }
  }

  static async deleteMusicData(music_data_ID, user_ID) {

    try {
      const deleteData = await music_data.deleteOne({
        _id: music_data_ID,
        user_id: user_ID
      })
      
      return deleteData
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getMusicData(dataRequest){
    const userID = dataRequest.userID
    const countPerPage = 10;
    const pageNumber = dataRequest.pageNumber;
    const totalNumberOfPages = (count) => {
      return Math.max(Math.floor(count/countPerPage), 1)
    }
    // const totalPages = totalNumberOfPages(count)
    let query = {};

      if (dataRequest.pool !== 'all'){
        query["pool"] = dataRequest.pool
      } else {
        query['$or'] = [{'pool': 'global'},{'pool': userID}]
      }

      if (dataRequest.dataType !== 'all'){
        query["dataType"] = dataRequest.dataType
      }
      if (dataRequest.keyword !== undefined && dataRequest.keyword.length > 0){
        query["$text"] = {$search: dataRequest.keyword}
      }
      
    try {
      const dataResults = await music_data.find(query).sort({_id: -1}).skip(countPerPage * pageNumber).limit(10).toArray()
      const count = await music_data.find(query).count();
     const returnObj = {}
     returnObj['dataResults'] = dataResults
     returnObj['numberOfPages'] = totalNumberOfPages(count)
      return returnObj
    } catch (e){
      console.error(`Unable to return reviews: ${e}`)
      return { error: e }
    }

  }

}