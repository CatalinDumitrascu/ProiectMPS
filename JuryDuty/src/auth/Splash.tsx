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
       /* setTimeout(()=>{
            this.props.navigation.navigate("Login")
       }, 2000);
       */
      data_base.ref()
      .child('/test/')
      .child("test")
      .update({test: "test" });

    }

    render() {
        return (
            <View style = {{flex: 1, justifyContent: 'center'}}>
                <Text>Welcome to JuryDuty !</Text>
                <TouchableOpacity>
                    <View style = {{flexDirection: 'row'}}>
                        <Text>ADMIN</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style = {{flexDirection: 'row'}}>
                        <Text>JURY</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Splash