// Setup page for admin
import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import {setRound} from '../res/actions'
import {fire_store} from '../res/Firebase'

const mapStateToProps = (state: any) => {
	return {
        event: state.reducer.event
	}
}

const mapDispatchToProps = (dispatch: any) => ({
    onSetRound(round: any) {
        dispatch (
            setRound(round)
        )
    },
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    event: any,
    onSetRound(round: any): void
}
  
interface State {
    error_message: string,
    found_error: boolean,
    round_num: any, 
    disable_button: boolean
}

class Rounds extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error_message: "",
            found_error: false,
            round_num: 0,
            disable_button: false
        }
    }

    componentDidMount() {
        // TODO change this
        let num = this.props.event[0][1].current_round_number - 1
        this.setState({round_num: num})
        this.props.onSetRound(num)
    }

    renderHeader() {
        console.log("Main menu")
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between',
                        backgroundColor: '#b8860b',
                        paddingTop: Platform.OS === 'ios' ? 40 : 10}}>
                 <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Series for round {this.state.round_num}
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

    showRounds() {
        console.log("Current round " + this.state.round_num)
        return (
            <FlatList
			    data = {this.props.event[0][1].rounds[this.state.round_num].round}
				extraData = {this.props}
				renderItem = {this.renderRound}
				keyExtractor = {(item: any, index: number) => index.toString()}/> 

        )
    }


    renderRound = ({item, index}: any) => (     
        <TouchableOpacity
            onPress = {() => this.props.navigation.navigate("VotingScreen", {id: item.serieNr})}
            style = {{margin: 10, alignSelf: 'center', borderRadius: 20, 
                    borderWidth: 1, borderColor:'#8b4513', backgroundColor: '#fffaf0'}}>
            <Text
                style = {{alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 30, fontSize: 20}}>
            Series num {item.serieNr}</Text>
        </TouchableOpacity>
    );

    finishButton(){
        return(
            <TouchableOpacity 
                disabled = {this.state.disable_button}
                onPress = {() => this.finishRound()}
                style = {{margin: 20, backgroundColor: this.state.disable_button ? 'red' : 'green',
                borderRadius: 20, alignSelf: 'center'}}>
                <Text style = {{fontSize: 16, padding: 20, color: 'white', fontWeight: 'bold'}} >Finish voting</Text>
            </TouchableOpacity>
        )
    }

    async finishRound() {
        if (!this.state.disable_button){
            if (this.props.event[0][1].jury_stop_round == undefined) {
                this.props.event[0][1].jury_stop_round = 1
            } else {
                this.props.event[0][1].jury_stop_round += 1
            }

            // Add jury
            await fire_store.collection("contests").doc(this.props.event[0][0])
                .update(this.props.event[0][1])
        }
    }

    render() {
        return (
           <View style = {{flex: 1,  backgroundColor: '#fff8dc'}}>   
               {this.renderHeader()}
               {this.showRounds()}
               {this.finishButton()}
               {this.state.found_error
                ? this.showErrorMessage()
                : <View></View>}
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rounds)