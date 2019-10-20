// Login for jury and admin
// Admin - only password
// Jury - username and password

import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base, data_base} from '../res/Firebase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    navigation: NavigationScreenProp<any>; 
}
  
interface State {
    login_type: any,
    username: string,
    password: string,
    hide_password: boolean
}

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            login_type: this.props.navigation.getParam('type', "" ),
            username: "",
            password: "",
            hide_password: true
        }
    }

    renderHeader() {
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between'}}>
                <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                {this.state.login_type == "ORG"
                    ?<Text style = {{color: 'white', fontSize: 20}}>
                        Admin authentication
                    </Text>
                    :<Text style = {{color: 'white', fontSize: 20}}>
                        Jury authentication
                    </Text>
                }
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
                        onChangeText={(text) => this.setState({username: text})}
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
                        onChangeText={(text) => this.setState({password: text})}
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
                onPress = {() => this.login()}
                style = {{alignSelf: 'center', margin: 20}}>
                <Text>Login</Text>
            </TouchableOpacity>
        )
    }

    // Try to login a user with the username and password provided
    login() {

    }


    render() {
        return (
           <View style = {{flex: 1,  backgroundColor: '#b8860b'}}>   
               {this.renderHeader()}
               {this.renderUserNameInput()}
               {this.renderPasswordInput()}
               {this.renderLoginButton()}
           </View>
        )
    }
}

export default Login