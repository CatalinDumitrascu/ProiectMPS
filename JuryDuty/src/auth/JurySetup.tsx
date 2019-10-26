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
        event: state.reducer.event
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onLogin(username: string) {
        dispatch (
            login(username)
        )
    }
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    event: any
    onLogin(username: string): void
}
  
interface State {
    user_name: string,
    start_round: boolean,
    end_round: boolean,
    start_series:boolean,
    end_serries:boolean,
    error_message: string,
    found_error: boolean,
    series_num: any
}

class JurySetup extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            user_name: this.props.navigation.getParam("username", ""),
            start_round: false,
            end_round: false,
            error_message: "",
            start_series: false,
            end_serries: false,
            found_error: false,
            series_num: 0
        }
    }

    componentDidMount(){
        this.props.onLogin(this.state.user_name)

        // There is an event, so a round can be started
        if (this.props.event != undefined) {
            this.setState({start_round: true})
        }
    }

    renderHeader() {
        console.log(this.state.user_name)
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between',
                        backgroundColor: '#b8860b'}}>
                 <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Jury setup - connected as {this.state.user_name}
                </Text>     
                <TouchableOpacity></TouchableOpacity>
            </View>
        )
    }

    // Try starting round
    startRound() {
        // Cant start if there is no event going on,
        // or if the catergory hasnt been choosed
        if(this.props.event == undefined) {
            this.setState({found_error: true, error_message: "Can't start round yet"})
        } else {
            console.log("Can start round")
        }
    }


    startSeries(){
        // Cant start if start_round is false
        if(!this.state.start_round) {
            this.setState({found_error: true, error_message: "Round hasnt started"})
        } else {
            console.log("Can start series")
            this.props.navigation.navigate("UsersList", {num: this.state.series_num})
        }
    }


    rederJuryOptions(){
        return (
            <ScrollView style = {{margin: 20, alignContent: 'center'}}>
                {/* Start round button */}
                <TouchableOpacity 
                    onPress = {() => this.startRound()}
                    style = {{margin: 10, backgroundColor: this.state.start_round ? 'white' : 'red',
                             borderRadius: 20, alignSelf: 'center'}}>
                    <Text
                        style = {{padding: 20}}>
                        START ROUND
                    </Text>
                </TouchableOpacity>
                {/* Type of contest */}
                <Text
                    style = {{margin: 10, fontSize: 20}}>
                    Event type: </Text>
                <Text style = {{fontSize: 20, margin: 10}}>
                    Choose a category to vote</Text>
                <Picker
                        selectedValue={"NONE"}
                        style={{height: 50, width: 200, margin: 10}}
                        onValueChange={(itemValue, itemIndex) =>
                            console.log("picker")
                        }>
                        <Picker.Item label="Dance" value="dance" />
                </Picker>
                
                {/* Start series */}
                <TouchableOpacity 
                    onPress = {() => this.startSeries()}
                    style = {{margin: 10, backgroundColor: 'white', borderRadius: 20, alignSelf: 'center'}}>
                    <Text
                        style = {{padding: 20}}>
                        START SERIES
                    </Text>
                </TouchableOpacity>
                {/* End series */}
                <TouchableOpacity 
                    style = {{margin: 10, backgroundColor: 'white', borderRadius: 20, alignSelf: 'center'}}>
                    <Text
                        style = {{padding: 20, paddingHorizontal: 25}}>
                        END SERIES
                    </Text>
                </TouchableOpacity>
                {/* End round button */}
                <TouchableOpacity 
                    style = {{margin: 10, backgroundColor: 'white', borderRadius: 20, alignSelf: 'center'}}>
                    <Text
                        style = {{padding: 20}}>
                        END ROUND
                    </Text>
                </TouchableOpacity>
            </ScrollView>
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
               {this.rederJuryOptions()}
               {this.state.found_error
                ? this.showErrorMessage()
                : <View></View>}
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JurySetup)