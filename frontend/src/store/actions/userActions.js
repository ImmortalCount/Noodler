
import http from '../../http-common.js'

import { 
    USER_REGISTER_FAIL, 
    USER_REGISTER_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGOUT,
    USER_DETAILS_RESET
  } from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })
        //I may not need config since I have http-commons
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        const {data}= await http.post(
            'users/login',
            {'email': email, 'password': password},
            config
        )
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })
        console.log(data, '!!!')
        
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
    dispatch({type: USER_DETAILS_RESET})
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        const { data } = await http.post(
            '/users',
            {name, email, password},
            config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: 
            error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message
        })
    }
}