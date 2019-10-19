// Splash screen for getting data from firebase

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base, data_base} from '../res/Firebase'

interface Props {
    navigation: NavigationScreenProp<any>; 
}
  
interface State {
    login_type: any
}

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            login_type: this.props.navigation.getParam('type', "" )
        }
    }



    render() {
        return (
           <View>
               <Text> Login page for {this.state.login_type}</Text>
           </View>
        )
    }
}

export default Login