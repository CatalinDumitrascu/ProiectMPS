import React, { Component } from "react";
import { View, Text, TextInput,TouchableOpacity } from 'react-native';
import {fire_store} from '../res/Firebase'

interface CustomProps {
    event: any,
    round: any,
    id_serie: any,
    id_user: any
    categories: any
    name: any,
    jury: any
}

interface CustomState {
    note1: any,
    note2: any,
    note3: any,
    found_error: boolean,
    error_message: any,
    stop_vote: boolean
}

 class User extends Component<CustomProps, CustomState> {
 

    constructor(props: CustomProps) {
        super(props)
        this.state = {
            note1: "",
            note2: "",
            note3: "",
            found_error: false,
            error_message: "",
            stop_vote: false
        }
    }
    
    async sendRatings(){
        console.log("Sending rating")
        const {note1, note2, note3} = this.state
        if (note1 == "" || note2 == "" || note3 == "" ||
            note1 < 1 || note2 < 1 || note3 < 1 ||
            note1 > 10 || note2 > 10 || note3 > 10 ||
            !isNaN(note1) || !isNaN(note2) || !isNaN(note3)) {
                this.setState({found_error : true, error_message: "Rating incorrect"})
            } else {
                // Add rating to database
                let round_num = this.props.round
                let serie = this.props.id_serie
                let id = this.props.id_user
                console.log(this.props.event[0][1].rounds[round_num].round[serie].serie[id]) 
                let categ1 = {categ: this.props.categories[0].name,
                                note: this.state.note1,
                                weight: this.props.categories[0].weight}
                let categ2 = {categ: this.props.categories[1].name,
                                note: this.state.note2,
                                weight: this.props.categories[1].weight}
                let categ3 = {categ: this.props.categories[2].name,
                                note: this.state.note3,
                                weight: this.props.categories[2].weight}
                let nota_juriu = []
                nota_juriu.push(categ1)
                nota_juriu.push(categ2)
                nota_juriu.push(categ3)
                
                if (this.props.event[0][1].rounds[round_num].round[serie].serie[id].notes == undefined) {
                    this.props.event[0][1].rounds[round_num].round[serie].serie[id].notes = []
                }
                
                this.props.event[0][1].rounds[round_num].round[serie].serie[id].notes.push({nota_juriu: nota_juriu})
  
                let ref = fire_store.collection('notes')
                ref.add({contest: this.props.event[0][0],
                        name: this.props.name,
                        serie: this.props.id_serie,
                        round: this.props.round,
                        nota_juriu: nota_juriu,
                        jury : this.props.jury})       
                this.setState({stop_vote: true})

                console.log(this.props.event[0][1]) 

               await fire_store.collection("contests").doc(this.props.event[0][0])
                .update(this.props.event[0][1])
            }
    }

    render() {
        return (
			<View style = {{margin: 30}}> 
                <Text style = {{alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20}}>{this.props.name}</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', margin: 5}}>
                    <Text style = {{fontSize: 20}}>{this.props.categories[0].name}:</Text>
                    <TextInput
                      onChangeText={(text) => this.setState({note1: text,  found_error: false})}
                      placeholder={"Raiting"}
                      autoCapitalize="none"
                      maxLength= {2}
                      placeholderTextColor="#8E9093"
                      style={{ fontSize: 18, marginRight: 40 ,backgroundColor: 'white', alignSelf: 'center',padding: 10, borderWidth: 0.5, borderColor: 'gray', borderRadius: 10}}
                      returnKeyType="next"></TextInput>
                </View>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between',margin: 5}}>
                    <Text style = {{fontSize: 20}}>{this.props.categories[1].name}:</Text>
                    <TextInput
                      onChangeText={(text) => this.setState({note2: text,  found_error: false})}
                      placeholder={"Raiting"}
                      autoCapitalize="none"
                      maxLength= {2}
                      placeholderTextColor="#8E9093"
                      style={{ fontSize: 18, marginRight: 40,backgroundColor: 'white', padding: 10, borderWidth: 0.5, borderColor: 'gray', borderRadius: 10}}
                      returnKeyType="next"></TextInput>
                </View>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', margin: 5}}>
                    <Text style = {{fontSize: 20}}>{this.props.categories[2].name}:</Text>
                    <TextInput
                      onChangeText={(text) => this.setState({note3: text,  found_error: false})}
                      placeholder={"Raiting"}
                      autoCapitalize="none"
                      maxLength= {2}
                      placeholderTextColor="#8E9093"
                      style={{ fontSize: 18, marginRight: 40,backgroundColor: 'white', padding: 10, borderWidth: 0.5, borderColor: 'gray', borderRadius: 10}}
                      returnKeyType="next"></TextInput>
                </View>
                <TouchableOpacity
                    disabled = {this.state.stop_vote}
                    style = {{marginTop: 10, alignSelf: 'center', 
                    backgroundColor: this.state.stop_vote ? 'red': 'green', 
                    borderRadius: 10}}
                    onPress = {() => this.sendRatings()}>
                        <Text style = {{fontSize: 16, color: 'white', paddingHorizontal: 20, paddingVertical: 10}}>Save</Text>
                </TouchableOpacity>
                {this.state.found_error
                    ?<Text style = {{ fontSize: 16, alignSelf: 'center', color: 'red'}}>{this.state.error_message}</Text>
                    :<View></View>}
        </View>
        )
    }
}

export default User