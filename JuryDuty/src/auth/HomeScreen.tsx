// Splash screen for getting data from firebase

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base} from '../res/Firebase'

interface Props {
    navigation: NavigationScreenProp<any>; 
}
  
interface State {

}

class HomeScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View style = {{flex: 1, justifyContent: 'center', backgroundColor: '#b8860b'}}>
                {/* Intro title */}
                <Text style = {{margin: 20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
                        Welcome to JuryDuty !</Text>
                {/* Jury button */}
                <TouchableOpacity 
                    style = {{margin: 10, alignSelf: 'center', width: '80%', backgroundColor: 'white', borderRadius: 10}}
                    onPress = {() => this.props.navigation.navigate("Login")}>
                    <View style = {{flexDirection: 'row', margin: 20, alignSelf: 'center'}}>
                        <Text style = {{fontSize: 18}}>JURAT</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default HomeScreen