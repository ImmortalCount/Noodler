
let data_pools

export default class dataPoolsActions {
  static async injectDB(conn) {
    if (data_pools) {
      return
    }
    try {
      data_pools = await conn.db('main').collection("data_pools")
    } catch (e) {
      console.error(`Unable to connect to collection: data_pools ${e}`)
    }
  }

  static async addDataPool(dataObject) {
    try {
      return await data_pools.insertOne(dataObject)
    } catch (e) {
      console.error(`Unable to add data_pools: ${e}`)
      return { error: e }
    }
  }

  static async updateDataPool(dataObject) {
    try {
      const updateData = await data_pools.updateOne(
        {dataObject},
      )
      return updateData
    } catch (e) {
      console.error(`Unable to update data_pools: ${e}`)
      return { error: e }
    }
  }

  static async deleteDataPool(data_pools_ID, user_ID) {

    try {
      const deleteData = await data_pools.deleteOne({
        _id: data_pools_ID,
        user_id: user_ID
      })
      
      return deleteData
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getDataPools(dataRequest){
    const userID = dataRequest.userID
    let query = {};

      // if (dataRequest.pool !== 'all'){
      //   query["pool"] = dataRequest.pool
      // } else {
      //   query['$or'] = [{'pool': 'global'},{'pool': userID}]
      // }

      // if (dataRequest.dataType !== 'all'){
      //   query["dataType"] = dataRequest.dataType
      // }
      // if (dataRequest.keyword !== undefined && dataRequest.keyword.length > 0){
      //   query["$text"] = {$search: dataRequest.keyword}
      // }
      
    try {
      const dataResults = await music_data.find(query).toArray()
      return dataResults
    } catch (e){
      console.error(`Unable to return reviews: ${e}`)
      return { error: e }
    }

  }

}