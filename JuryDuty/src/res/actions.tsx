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

export const getContestants = () => 
    ({
        type: constants.GET_CONTESTANTS,
    })  

export const setCategories = (categories: any) =>
    ({
        type: constants.SET_CATEGORY,
        payload: categories
    }) 

export const setRound = (round: any) => 
    ({
        type: constants.CHANGE_ROUND,
        payload: round
    })   

