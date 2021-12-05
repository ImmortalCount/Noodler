import http from '../../http-common.js'

import {
DATA_POOL_LIST_REQUEST, 
DATA_POOL_LIST_SUCCESS, 
DATA_POOL_LIST_FAIL,
DATA_POOL_LIST_RESET, 

DATA_POOL_INSERT_REQUEST,
DATA_POOL_INSERT_SUCCESS, 
DATA_POOL_INSERT_FAIL, 

DATA_POOL_DELETE_REQUEST, 
DATA_POOL_DELETE_SUCCESS, 
DATA_POOL_DELETE_FAIL, 

DATA_POOL_UPDATE_REQUEST, 
DATA_POOL_UPDATE_SUCCESS, 
DATA_POOL_UPDATE_FAIL, 
DATA_POOL_UPDATE_RESET, 
} from '../constants/dataPoolConstants.js'

export const insertData = (musicData, pool) => async (dispatch) => {
    try {
        dispatch({
            type: DATA_POOL_INSERT_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        const {data} = await http.post(
            `/data/${pool}`,
            {musicData},
            config
        )

        dispatch({
            type: DATA_POOL_INSERT_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: DATA_POOL_INSERT_FAIL,
            payload: error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message
        })
    }
}