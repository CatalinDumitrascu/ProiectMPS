// Setup page for admin
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import {fire_store, fire_base} from '../res/Firebase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import {login, setCategories, getEvent, setRound} from '../res/actions'


const mapStateToProps = (state: any) => {
	return {
        event: state.reducer.event,
        contestants: state.reducer.contestants
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onLogin(username: string) {
        dispatch (
            login(username)
        )
    },
    onSetCategory(categories: any) {
        dispatch (
            setCategories(categories)
        )
    },
    onCheck() {
        dispatch (
            getEvent()
        )
    },
    onSetRound(round: any) {
        dispatch (
            setRound(round)
        )
    },
  
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    event: any,
    contestants: any
    onLogin(username: string): void
    onSetCategory(categories: any): void
    onCheck(): void
    onSetRound(round: any): void
}
  
interface State {
    user_name: string,
    start_round: boolean,
    end_round: boolean,
    error_message: string,
    found_error: boolean,
    series_num: any,
    loading: boolean;
}

class JurySetup extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            user_name: this.props.navigation.getParam("username", ""),
            start_round: false,
            end_round: false,
            error_message: "",
            found_error: false,
            series_num: 0,
            loading:false
        }
    }

    async componentDidMount(){
        this.props.onLogin(this.state.user_name)
        console.log("JurySetup")
        console.log(this.props.event)
        // There is an event, so a round can be started
        if (this.props.event != undefined) {
            this.setState({start_round: true})
            this.props.onSetCategory(this.props.event[0][1].contest_categs)

            if (this.props.event[0][1].connected_juries_num == undefined) {
                this.props.event[0][1].connected_juries_num = 1
            } else {
                this.props.event[0][1].connected_juries_num += 1
            }

            // Add jury
            await fire_store.collection("contests").doc(this.props.event[0][0])
                .update(this.props.event[0][1])
                
        }
        
    }

    renderHeader() {
        console.log(this.state.user_name)
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between',
                        backgroundColor: '#b8860b',
                        paddingTop: Platform.OS === 'ios' ? 40 : 10}}>
                 <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Connected as {this.state.user_name}
                </Text>     
                <TouchableOpacity
                    onPress = {() => this.refresh()}>
                    <Icon name="refresh" size={30} color="white" ></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    async refresh(){
        this.setState({loading: true})
        await this.props.onCheck()

        setTimeout(() => 
   
        (this.props.onSetRound(this.props.event[0][1].current_round_number),
        this.setState({loading: false}) ) ,
         3000)
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


    startVoting(){
        // Cant start if start_round is false
        if(!this.state.start_round) {
            this.setState({found_error: true, error_message: "Round hasnt started"})
        } else {
            console.log("Can start series")
            this.props.navigation.navigate("Rounds")
        }
    }


    rederJuryOptions(){
        return (
            <ScrollView style = {{margin: 20, alignContent: 'center'}}>
                {/* Type of contest */}
                <Text
                    style = {{margin: 10, fontSize: 20}}>
                    Event name: {this.props.event[0][1].contest_name}</Text>
                <Text
                    style = {{margin: 10, fontSize: 20}}>
                    Event type: {this.props.event[0][1].contest_type}</Text>
                <Text
                    style = {{margin: 10, fontSize: 20}}>
                    Numbers of contestants: {this.props.event[0][1].competitors.length}</Text>
                <Text
                    style = {{margin: 10, fontSize: 20}}>
                    Number of rounds: {this.props.event[0][1].rounds_number}</Text>
              
                <Text style = {{fontSize: 20, margin: 10, fontWeight: 'bold'}}>
                    Categories to vote:</Text>
               <View style = {{justifyContent: 'center'}}>
                    <Text style = {{margin: 10, fontSize: 20}}>{this.props.event[0][1].contest_categs[0].name}</Text>
                    <Text style = {{margin: 10, fontSize: 20}}>{this.props.event[0][1].contest_categs[1].name}</Text>
                    <Text style = {{margin: 10, fontSize: 20}}>{this.props.event[0][1].contest_categs[2].name}</Text>
               </View>
                {/* Start voting */}
                <TouchableOpacity 
                    onPress = {() => this.startVoting()}
                    style = {{margin: 10, marginVertical: 20, backgroundColor: 'white', borderRadius: 20, alignSelf: 'center'}}>
                    <Text
                        style = {{padding: 20}}>
                        START VOTING
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{alignSelf: 'flex-end', backgroundColor: '#8b4513', borderRadius: 20, }}
                     onPress = {() => this.signOut()}>
                         <Text style = {{color: 'white', padding: 10}}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    signOut(){

        fire_base.auth().signOut().then(function() {
            Alert.alert(
                'Signed out succesfully',
                "You signed out of JuryDuty app",
                [{
                    text: 'Close',
                    onPress: () => console.log('Close Pressed'),
                },
                {text: 'OK', onPress: () => console.log("Ok pressed")},
                ],
                {cancelable: true},
            );
          }, function(error) {
            // An error happened.
          });
          this.props.navigation.goBack()
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
            {this.state.loading
                ? <ActivityIndicator style = {{flex:1}} size="large" color="#0000ff" />
                : <View>
                {this.renderHeader()}
                {this.state.start_round 
                    ? <View>
                    {this.rederJuryOptions()}
                        {this.state.found_error
                        ? this.showErrorMessage()
                        : <View></View>}
                    </View>
                    :<Text>No contest going on</Text>
                }
                </View>
            }  
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JurySetup)