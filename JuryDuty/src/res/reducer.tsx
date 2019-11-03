import constants from './constants'
import { combineReducers } from 'redux'
import {fire_base, fire_store} from './Firebase'



export const login_details = (state: any = [], action: any) => {
    if (action.type === constants.LOGIN){
        // Save username in the database
        let ref = fire_store.collection('juries').doc(action.payload)
        ref.set({
            'username': action.payload,
            'id': ref,
          });
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
        let event:any = []
        fire_store.collection('contests').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                console.log()
                if (doc.data().done == false) {
                    let ev = []
                    ev.push(doc.id)
                    ev.push(doc.data())
                    event.push(ev)
                }
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
            return event
    }
       return state
}

export const contestants = (state: any = [], action: any) => {
    if (action.type === constants.GET_CONTESTANTS){
        let contestants: any = []
        console.log("Getting contestants")
        fire_store.collection('contests').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                if (doc.data().done == false) {
                   // return doc.data().competitors
                   doc.data().competitors.forEach((element: any) => {
                       contestants.push(element)
                   });
                }
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        return contestants
    } else 
        return state
}

export const categories = (state: any = [], action: any) => {
    if (action.type === constants.SET_CATEGORY){
        return action.payload
    }else return state
}

export const round = (state: any = [], action: any) => {
    if (action.type === constants.CHANGE_ROUND){
        return action.payload
    } else {
        return state
    }
}

export default combineReducers({ 
    login_details,
    event,
    contestants,
    categories,
    round
  })