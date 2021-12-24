
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
    let query;
    if (dataRequest.keyword !== undefined && dataRequest.keyword.length > 0){
      query = {
        "pool": dataRequest.pool,
        "dataType": dataRequest.dataType, 
         $text: {$search: dataRequest.keyword}
        }
    } else {
      query = {
        "pool": dataRequest.pool,
        "dataType": dataRequest.dataType, 
        }
    }
    
    try {
      const dataResults = await music_data.find(query).toArray()
      return dataResults
    } catch (e){
      console.error(`Unable to return reviews: ${e}`)
      return { error: e }
    }

  }

}