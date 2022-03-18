import http from '../../http-common.js'

import {
POOL_LIST_REQUEST, 
POOL_LIST_SUCCESS, 
POOL_LIST_FAIL,

} from '../constants/poolConstants.js'

// export const insertData = (musicData) => async (dispatch) => {
//     try {
//         dispatch({
//             type: POOL_INSERT_REQUEST
//         })

//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }

//         const data = await http.post(
//             'data',
//             (musicData),
//             config
//         )

//         dispatch({
//             type: POOL_INSERT_SUCCESS,
//             payload: data,
//         })

//     } catch (error) {
//         dispatch({
//             type: POOL_INSERT_FAIL,
//             payload: error.response && error.response.data.message 
//             ? error.response.data.message 
//             : error.message
//         })
//     }
// }

export const getPoolData = (requestData) => async (dispatch) => {
    try {
        dispatch({type: POOL_LIST_REQUEST})

        const dataType = requestData.dataType
        const pool = requestData.pool
        const keyword = requestData.keyword
        const userID = requestData.userID
        const data = await http.get(
            `data?dataType=${dataType}&pool=${pool}&keyword=${keyword}&userID=${userID}`
        )

        dispatch({
            type: POOL_LIST_SUCCESS,
            payload: data
        })
    } catch (error){
        dispatch({
            type: POOL_LIST_FAIL,
            payload: error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message
        })
    }
}