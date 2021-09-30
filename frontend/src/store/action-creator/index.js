export const sendModuleData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "send",
            payload: data
        });
    }
}

export const receiveModuleData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "receive",
            payload: data
        });
    }
}

export const sendScaleData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "send",
            payload: data
        });
    }
}

export const receiveScaleData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "receive",
            payload: data
        });
    }
}

