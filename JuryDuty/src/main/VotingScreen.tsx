// Setup page for admin
import * as React from 'react';
import { View, Text, TouchableOpacity, Alert ,FlatList} from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import User from '../comp/User'

const mapStateToProps = (state: any) => {
	return {
        event: state.reducer.event,
        round: state.reducer.round,
        categories: state.reducer.categories,
        login_details: state.reducer.login_details
	}
}

const mapDispatchToProps = (dispatch: any) => ({
})

interface Props {
    navigation: NavigationScreenProp<any>; 
    event: any,
    round: any,
    categories: any,
    login_details: any
}
  
interface State {
    found_error: boolean,
    error_message: string,
    id: any,
    users: any
}

class VotingScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error_message: "",
            found_error: false,
            id: this.props.navigation.getParam("id", ""),
            users: []
        }
    }

    componentDidMount(){
        // Get concurents from this series
        let round_num = this.props.round
       console.log(this.props.event[0][1].rounds[round_num].round[this.state.id].serie) 
       // round_num.round[this.state.id].serie
       this.props.event[0][1].rounds[round_num].round[this.state.id].serie.forEach( (element: any) => {
           console.log(element)
           this.state.users.push(element)
       });
       
       
    }

    renderHeader() {
        return (
            <View style = {{flexDirection: 'row', marginBottom: 20, padding: 10, justifyContent: 'space-between',
                        backgroundColor: '#b8860b'}}>
                 <TouchableOpacity
                    onPress = {() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
                <Text style = {{color: 'white', fontSize: 20}}>
                    Voting series {this.state.id}
                </Text>     
                <TouchableOpacity
                    onPress = {() => this.showInfo()}>
                    <Icon name="information" size={30} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    showInfo() {
        Alert.alert(
            'Voting system',
            "You can only vote with a number between 1 and 10 \n" + 
            "1 means the lowest score \n" + 
            "10 is the highest score",
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log("Ok pressed")},
            ],
            {cancelable: true},
        );
    }


    showConcurents(){
        return (
        <FlatList
            data = {this.state.users}
            extraData = {this.state}
            renderItem = {this.renderUser}
            keyExtractor = {(item: any, index: number) => index.toString()}/> 
        )
    }

    renderUser = ({item, index}: any) => (     
        <User
            event = {this.props.event}
            round = {this.props.round}
            id_serie = {this.state.id}
            id_user = {index}
            categories = {this.props.categories}
            name = {item.name}
            jury = {this.props.login_details}>
        </User>
    );

   
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
               {this.showConcurents()}
               {this.state.found_error
                ? this.showErrorMessage()
                : <View></View>}
           </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VotingScreen)