// Splash screen for getting data from firebase

import * as React from 'react';
import { View, Text, TouchableOpacity,ActivityIndicator } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base} from '../res/Firebase'
import { connect } from 'react-redux'
import {getEvent, getContestants} from '../res/actions'


const mapStateToProps = (state: any) => {
	return {
       
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onCheck() {
        dispatch (
            getEvent()
        )
    },
    onGetUsers(){
        dispatch (
            getContestants()
        )
    }
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    onCheck(): void
    onGetUsers(): void,
}
  
interface State {
    loading: boolean
}

class Splash extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    // Check if there is an event 
   async  checkEvent(){
        await this.props.onCheck()

        await this.props.onGetUsers()
    }

     // Check if there is an account created for this user
     // Malaka doesnt work
    async checkAuth() {
        let parent = this
        
        console.log("Checking for user")
       
        await fire_base.auth().onAuthStateChanged(function(user) {
            user 
            ? parent.props.navigation.navigate('JurySetup', {username: user.displayName})
            : parent.props.navigation.navigate('HomeScreen')
          });
    }

     loading() {
        this.checkEvent()
        setTimeout(() => this.props.navigation.navigate('Login'), 1000)
        //this.checkAuth()
        return (
            <ActivityIndicator style = {{flex:1}} size="large" color="#0000ff" />
        )
    }
     

    render() {
        return (
            <View style = {{ flex: 1}}>
                {this.state.loading
                    ?<View style = {{flex: 1}}> 
                        
                        
                        {this.loading()}
                
                    </View>
                    :
                    <TouchableOpacity 
                        onPress = {() => this.setState({loading: true})}
                        style = {{flex: 1, justifyContent: 'center', backgroundColor: '#b8860b'}}> 
                            {/* Intro title */}
                            <Text style = {{margin: 20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
                                 Welcome to JuryDuty !</Text> 
                </TouchableOpacity>}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)