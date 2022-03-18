
let music_data

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
      return await music_data.insertOne(dataObject)
    } catch (e) {
      console.error(`Unable to add music_data: ${e}`)
      return { error: e }
    }
  }

  static async updateMusicData(dataObject) {
    try {
      const updateData = await music_data.updateOne(
        {dataObject},
      )
      return updateData
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
      const dataResults = await music_data.find(query).skip(countPerPage * pageNumber).limit(10).toArray()
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