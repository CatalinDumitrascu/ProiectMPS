// Splash screen for getting data from firebase

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base, data_base} from '../res/Firebase'

interface Props {
    navigation: NavigationScreenProp<any>; 
}
  
interface State {

}

class Splash extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    checkScreen() {
      // Testing the database
     /* data_base.ref()
      .child('/test/')
      .child("test")
      .update({test: "test" });
        */
    }

    render() {
        return (
            <View style = {{flex: 1, justifyContent: 'center', backgroundColor: '#b8860b'}}>
                {/* Intro title */}
                <Text style = {{margin: 20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
                        Welcome to JuryDuty !</Text>
                {/* Admin button */}
                <TouchableOpacity 
                    style = {{margin: 10, alignSelf: 'center', width: '80%', backgroundColor: 'white', borderRadius: 10}}
                    onPress = {() => this.props.navigation.navigate("Login", {type: "ORG"})}>
                    <View style = {{flexDirection: 'row', margin: 20, alignSelf: 'center'}}>
                        <Text style = {{fontSize: 18}}>ORGANIZATOR</Text>
                    </View>
                </TouchableOpacity>
                {/* Jury button */}
                <TouchableOpacity 
                    style = {{margin: 10, alignSelf: 'center', width: '80%', backgroundColor: 'white', borderRadius: 10}}
                    onPress = {() => this.props.navigation.navigate("Login", {type: "JUR"})}>
                    <View style = {{flexDirection: 'row', margin: 20, alignSelf: 'center'}}>
                        <Text style = {{fontSize: 18}}>JURAT</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Splash