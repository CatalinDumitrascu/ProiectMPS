// Login for jury and admin
// Admin - only password
// Jury - username and password

import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';

import { NavigationScreenProp } from "react-navigation";
import {fire_base} from '../res/Firebase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import {login, getContestants} from '../res/actions'

// TODO
// check first if there is an event going on
// if not, cant log in



const mapStateToProps = (state: any) => {
	return {
       event: state.reducer.event
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onLogin(username: string) {
        dispatch (
            login(username)
        )
    },
   
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    onLogin(username: string): void
    event: any
}
  
interface State {
    username: string,
    password: string,
    hide_password: boolean,
    error_message: string,
    found_error: boolean,
}

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            hide_password: true,
            error_message: "",
            found_error: false,
        }
    }

    componentDidMount() {

        // Get contestants
        
    }

    renderHeader() {
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, 
                            padding: 10, justifyContent: 'space-between',
                            backgroundColor: '#b8860b',
                            paddingTop: Platform.OS === 'ios' ? 40 : 10}}>
                <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Jury authentication
                </Text>     
                <TouchableOpacity></TouchableOpacity>
            </View>
        )
    }


    renderUserNameInput(){
        return(
            <View style = {{alignSelf: "center", width: '80%', borderWidth: 1, borderRadius: 10, backgroundColor: 'white',
                            borderColor: 'gray', marginVertical: 30, flexDirection: "row", alignContent: "space-between"}}>   
                <View style = {{ alignSelf: 'center', margin: 10}}>
                    <Icon 
                        name = "account"
                        size={25} 
                        color = "#8E9093"/>  
                </View> 
                <TextInput
                        onChangeText={(text) => this.setState({username: text, found_error: false})}
                        placeholder={"Username"}
                        placeholderTextColor="#8E9093"
                        style={{flex: 1, fontSize: 18, marginRight: 40}}
                        autoCorrect={false}
                        returnKeyType="next"/>
            </View>
        )
    }

    renderPasswordInput() {
        const {hide_password} = this.state
        // Change the icon based on hide_password value
        let password_eye_icon: string = (hide_password) ? "eye-off" : "eye"

        return (
            <View style = {{alignSelf: "center", width: '80%', borderWidth: 1, borderRadius: 10, backgroundColor: 'white',
                            borderColor: 'gray', flexDirection: "row", alignContent: "space-between"}}>   
                <View style = {{ alignSelf: 'center', margin: 10}}>
                    <Icon 
                        name = "key"
                        size={25} 
                        color = "#8E9093"/>  
                </View> 
                <TextInput
                        onChangeText={(text) => this.setState({password: text, found_error: false})}
                        placeholder={"Password"}
                        autoCapitalize="none"
                        secureTextEntry={this.state.hide_password}
                        placeholderTextColor="#8E9093"
                        style={{flex: 1, fontSize: 18, marginRight: 40}}
                        autoCorrect={false}
                        returnKeyType="next"/>
                <TouchableOpacity 
                    onPress={() => this.setState( {hide_password : !hide_password})}
                    style = {{ alignSelf: 'center', margin: 10}}>
                    <Icon 
                        name = {password_eye_icon}
                        size={25} 
                        color = "#8E9093"/>  
                </TouchableOpacity> 
            </View>
        )
    }

    renderLoginButton() {
        return (
            <TouchableOpacity 
                onPress = {() => this.tryLogin()}
                style = {{alignSelf: 'center', backgroundColor: '#8b4513',borderRadius: 10, margin: 20}}>
                <Text style = {{fontSize: 18, color: 'white', paddingVertical: 20, paddingHorizontal: 40}}>Login</Text>
            </TouchableOpacity>
        )
    }

    // Try to login a user with the username and password provided
    async tryLogin() {
        const {username, password} = this.state
        // Get password from database
        let password_app = "parola"

        // Create a new user with the username provided and matching password
        if (username === null
            || username.includes(' ') || username.trim() === "" ) {
            // Email is invalid, put error
            console.log("Invalid Username")
            this.setState({found_error: true, error_message: "Invalid Username"})
        } else if ( password === null || password.trim() === "" ) {
            console.log("Invalid password")
            this.setState({found_error: true, error_message: "Password is too short or invalid"})
        }  else if (password !== password_app && password != "admin") {
            console.log("Password incorrect")
            this.setState({found_error: true, error_message: "Password incorrect"})
        } else if (password == "admin" && username == "admin") {
            // Admin pass
            this.props.navigation.navigate("JurySetup", {username: username})
        } 
        else {
            // Create an email based on the username
            let email = username + "@juryduty.com"
            console.log("Correct password and valid username \n Connecting user ...")
            await fire_base.auth().createUserWithEmailAndPassword(email, password)
                .then(() => (this.props.navigation.navigate("JurySetup", {username: username})))
                .catch(error => (  (console.warn(error),
                                    this.setState({found_error: true, error_message: "User already exists"}))))
        }
    }

    showErrorMessage() {
        return (
            <View style = {{position: 'absolute', bottom: 0, width: '100%',
                            backgroundColor: '#800000'}}> 
                <Text style = {{ padding: 10, color: 'white', alignSelf: 'center'}}>{this.state.error_message}</Text>
            </View>
        )
    }

    render() {
        return (
           <View style = {{flex: 1,  backgroundColor: '#fff8dc'}}>   
               {this.renderHeader()}
               {this.renderUserNameInput()}
               {this.renderPasswordInput()}
               {this.renderLoginButton()}
               {this.state.found_error
                ? this.showErrorMessage()
                : <View></View>}
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)