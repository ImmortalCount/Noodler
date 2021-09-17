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

