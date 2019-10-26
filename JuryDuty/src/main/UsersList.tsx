// Setup page for admin
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_base, data_base} from '../res/Firebase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import {login} from '../res/actions'

const mapStateToProps = (state: any) => {
	return {
	}
}

const mapDispatchToProps = (dispatch: any) => ({
})

interface Props {
    navigation: NavigationScreenProp<any>; 
}
  
interface State {
    series_num: string,
    error_message: string,
    found_error: boolean,
}

class UsersList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            series_num: this.props.navigation.getParam("num", ""),
            error_message: "",
            found_error: false,
        }
    }

    renderHeader() {
        console.log(this.state.series_num)
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between',
                        backgroundColor: '#b8860b'}}>
                 <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Series {this.state.series_num}
                </Text>     
                <TouchableOpacity></TouchableOpacity>
            </View>
        )
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
               {this.state.found_error
                ? this.showErrorMessage()
                : <View></View>}
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)