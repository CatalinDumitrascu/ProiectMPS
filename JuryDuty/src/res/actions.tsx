import constants from './constants'

export const login = (username: any ) => 
    ({
        type: constants.LOGIN,
        payload: username 
    })

export const getEvent = () => 
    ({
        type: constants.GET_EVENT,
    })  

