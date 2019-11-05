import { Component, OnInit } from '@angular/core';
import { Contest, Competitor, NotaJuriu, NotaCategorie} from '../models';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { config } from '../config';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContestSetupComponent } from '../contest-setup/contest-setup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contests: Contest[];
  contest = null;
  disabled: Boolean;
  emptyTable: Boolean;
  competitors = [];
  competitors_in_contest = [];
  series = [];
  contest_series = [];
  rounds = null;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private db: AngularFirestore
  ) { 
    this.disabled = true;
    this.emptyTable = true;
    this.rounds = null;

    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.emptyTable = false;
      this.firebaseService.getCompetitors(this.contest.key)
      .subscribe( result => {
        this.competitors = result.map(it => it.payload.doc.data())
      })
    });

  }

  ngOnInit() {
    this.contest = {done: false, key: ""};
    this.getContest()
    if(this.contest.done == true){
      this.disabled = false;
    }
  }

  getContest(){
    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.emptyTable = false;
      this.firebaseService.getCompetitors(this.contest.key)
      .subscribe( result => {
        this.competitors = result.map(it => it.payload.doc.data())
      })
    });
  }

  calculateAverageNote(notes: Array<NotaJuriu>){
    var sum = 0;
    for(let i = 0; i < notes.length; i++){
      for(let j = 0; j < notes[i].nota_juriu.length; j++){
        sum += parseInt(notes[i].nota_juriu[j].note, 10) * parseFloat(notes[i].nota_juriu[j].weight);
      }
    }
    return sum / notes.length;
  }

  shuffle(array) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  manageRounds(){
    this.series = [];
    this.contest_series = []
    this.competitors_in_contest = this.competitors;
    console.log(this.competitors_in_contest);
    this.competitors_in_contest = this.shuffle(this.competitors_in_contest)
    var size = 0;
    if(this.contest.current_round_number == 0){
      this.contest.rounds = [];
    }
    switch (this.contest.contest_type) {
      case 'Battle': {
        size = 2;
        break;
      }
      case 'Evolutie asincrona': {
        size = 1;
        break;
      }
      case 'Evolutie sincrona': {
        size = this.contest.competitors_number_per_serie;
        break;
      }
      default: {
        break;
      }
    }
    // while (this.competitors_in_contest.length > 0)
    //     this.series.push(this.competitors_in_contest.splice(0, size));

    for (let index = 0; index < this.competitors_in_contest.length; index += size) {
      let myChunk = this.competitors_in_contest.slice(index, index+size);
      console.log(myChunk)
      this.series.push(myChunk);
    }
    // pun in alt array pt firebase
    for(let i = 0; i < this.series.length; i++){
      // simulare note
      // this.series[i][0].notes = [];
      // this.series[i][1].notes = [];
  
      // this.series[i][0].notes.push(
      //   {
      //     nota_juriu: [
      //       {categ: 'Tehnica', note: '10', weight: '1/3'},
      //       {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //       {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      //     ]
      //   }
      // )
      // this.series[i][0].notes.push(
      //   {
      //     nota_juriu: [
      //       {categ: 'Tehnica', note: '9', weight: '1/3'},
      //       {categ: 'Coregrafie', note: '8', weight: '1/3'},
      //       {categ: 'Impresie Ansamblu', note: '7', weight: '1/3'}
      //     ]
      //   }
      // )
      // this.series[i][1].notes.push(
      //   {
      //     nota_juriu: [
      //       {categ: 'Tehnica', note: '10', weight: '1/3'},
      //       {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //       {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      //     ]
      //   }
      // )
      // this.series[i][1].notes.push(
      //   {
      //     nota_juriu: [
      //       {categ: 'Tehnica', note: '10', weight: '1/3'},
      //       {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //       {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      //     ]
      //   }
      // )
      this.contest_series.push({serieNr: i, serie: this.series[i]})
    }
    this.contest.rounds.push({roundNr: this.contest.current_round_number, round: this.contest_series});
    this.firebaseService.updateContest(this.contest.key, this.contest)

  }


  getWinners(){
    this.competitors = [];
    // trigger here
    // if(this.contest.juries_votes_finish == this.contest.connected_juries_num){ // s-a terminat runda
    switch (this.contest.contest_type) {
      case 'Battle': {
        for(let i = 0; i < this.contest.rounds[this.contest.current_round_number].round.length; i++){ // seriile curente
          // battle
          if(this.calculateAverageNote(this.contest.rounds[this.contest.current_round_number].round[i].serie[0].notes) >= 
          this.calculateAverageNote(this.contest.rounds[this.contest.current_round_number].round[i].serie[1].notes)){
            this.competitors.push(this.contest.rounds[this.contest.current_round_number].round[i].serie[0])
          } else{
            this.competitors.push(this.contest.rounds[this.contest.current_round_number].round[i].serie[1])
          }
        }
        break;
      }

      case 'Evolutie asincrona': {
        var competitors_number_pass = 2; // tbd!!
        // handle winner
        var series = this.contest.rounds[this.contest.current_round_number].round;
        series.sort((a, b) => {
          return this.calculateAverageNote(b.serie[0].notes) - this.calculateAverageNote(a.serie[0].notes)
        })
        console.log(this.contest.competitors)
        for(let i = 0; i < this.contest.competitors.length - competitors_number_pass; i++){ // seriile curente
            this.competitors.push(series[i].serie[0])
        }
        break;
      }

      case 'Evolutie sincrona': {
        var competitors_number_eliminate = this.contest.competitors_number_per_serie / 2; // tbd!!
        for(let i = 0; i < this.contest.rounds[this.contest.current_round_number].round.lengths; i++){ // seriile curente
          // sortez desc seria
          var series = this.contest.rounds[this.contest.current_round_number].round;
          series.sort((a, b) => {
            return this.calculateAverageNote(b.serie[0].notes) - this.calculateAverageNote(a.serie[0].notes)
          })
          for(let j = 0; j < competitors_number_eliminate; j++){
            this.competitors.push(series[i].serie[j])
          }
          
        }
        break;
      }
      default: {
        break;
      }
    }
    this.contest.current_round_number++;
    this.contest.competitors = this.competitors;
    this.firebaseService.updateContest(this.contest.key, this.contest);
  //}
  }

  startContest(){
    while(this.contest.current_round_number < this.contest.rounds_number){
      this.manageRounds();
      this.getWinners();
    }
  }

}
