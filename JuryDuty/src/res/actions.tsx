import constants from './constants'

export const sendMessage = (username: any ) => 
    ({
        type: constants.LOGIN,
        payload: username
    })

