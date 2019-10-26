import constants from './constants'
import { combineReducers } from 'redux'
import {fire_base, data_base} from './Firebase'


export const login_details = (state: any = [], action: any) => {
    if (action.type === constants.LOGIN){
        // Save username in the database
            data_base.ref()
				.child('/juries/' + action.payload)
                .update({username: action.payload});
        // Update display name
        var user = fire_base.auth().currentUser;

        if (user) {
            user.updateProfile({
                displayName: action.payload,
            }).then(function() {
                // Update successful.
            }).catch(function(error) {
                // An error happened.
            });
        }
        
        return action.payload
    } else {
        return state
    }
}


export const event = (state: any = [], action: any) => {
    if (action.type === constants.GET_EVENT){
        // Get event from database
        console.log("Getting event")
        data_base.ref().child("contest").once('value', (snapshot) => {
            console.log(snapshot.val())
        })
    }
       return state
}

export default combineReducers({ 
    login_details,
    event
  })