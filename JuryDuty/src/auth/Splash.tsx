// Splash screen for getting data from firebase

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base, data_base} from '../res/Firebase'
import { connect } from 'react-redux'
import {getEvent} from '../res/actions'
const mapStateToProps = (state: any) => {
	return {
       
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onCheck() {
        dispatch (
            getEvent()
        )
    }
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    onCheck(): void
}
  
interface State {

}

class Splash extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.checkEvent()

        this.checkAuth()
    }

    // Check if there is an event 
    checkEvent(){
        this.props.onCheck()
    }

     // Check if there is an account created for this user
    async checkAuth() {
        let parent = this
        console.log("Checking for user")
        await fire_base.auth().onAuthStateChanged(function(user) {
            user 
            ? parent.props.navigation.navigate('JurySetup', {username: user.displayName})
            : parent.props.navigation.navigate('HomeScreen')
          });
    }
     

    render() {
        return (
            <TouchableOpacity 
                onPress = {() => (this.checkAuth())}
                style = {{flex: 1, justifyContent: 'center', backgroundColor: '#b8860b'}}> 

                    {/* Intro title */}
                    <Text style = {{margin: 20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
                            Welcome to JuryDuty !</Text>
             
            </TouchableOpacity>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)