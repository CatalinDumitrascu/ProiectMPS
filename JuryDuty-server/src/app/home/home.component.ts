import { Component, OnInit } from '@angular/core';
import { Contest, Competitor, NotaJuriu, NotaCategorie, Serie} from '../models';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { config } from '../config';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContestSetupComponent } from '../contest-setup/contest-setup.component';
import { Key } from 'protractor';
import { debug } from 'util';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contests: Contest[];
  contest = null;
  disabled = false;
  emptyTable: Boolean;
  competitors = [];
  competitors_in_contest = [];
  series = [];
  contest_series = [];
  rounds = null;
  current_round = [];
  startDisabled = false;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private db: AngularFirestore
  ) { 
    this.rounds = null;
    this.emptyTable = true;

    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.emptyTable = false;
      this.disabled = true;
    });
    this.firebaseService.getCompetitorsAsync().subscribe(actionArray => {
      this.competitors = actionArray.map(item => { return item as Competitor });
    });
  }
  
  ngOnInit() {
    this.contest = {done: false, key: ""};
    this.getContest()
  }

  refresh(){
    window.location.reload();
  }

  deleteContest(){
    this.getContest();
    if(this.contest.done == true){
      this.firebaseService.deleteContest(this.contest.key)
      .then(
        res => {
          window.location.reload();
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  getContest(){
    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.disabled = true;
      this.emptyTable = false;
    });
    this.firebaseService.getCompetitorsAsync().subscribe(actionArray => {
      this.competitors = actionArray.map(item => { return item as Competitor });
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

  compareNotes(nota_juriuConc1: Array<NotaCategorie>, nota_juriuConc2: Array<NotaCategorie>){
    for(let i = 0; i < nota_juriuConc1.length; i++){
        if(nota_juriuConc1[i].note < nota_juriuConc2[i].note){
          return -1;
        }
        if(nota_juriuConc1[i].note > nota_juriuConc2[i].note){
          return 1;
        }
    }
    return Math.round(Math.random());
  }
  compare = (competitor1: Competitor, competitor2: Competitor) => {
    if(this.calculateAverageNote(competitor1.notes) < this.calculateAverageNote(competitor2.notes)){
      return -1;
    }
    if(this.calculateAverageNote(competitor1.notes) > this.calculateAverageNote(competitor2.notes)){
      return 1;
    }
    if(this.calculateAverageNote(competitor1.notes) == this.calculateAverageNote(competitor2.notes)){
      // departajare
      // compar notele incepand cu prima categorie
      for(let i = 0; i < competitor1.notes.length; i++){
        this.compareNotes(competitor1.notes[i].nota_juriu, competitor2.notes[i].nota_juriu)
      }
    }
    return Math.round(Math.random());
  }

  compareAsinc = (serie1: Serie, serie2: Serie) =>{
    var comp1 = serie1.serie[0];
    var comp2 = serie2.serie[0]
    if(this.calculateAverageNote(comp1.notes) < this.calculateAverageNote(comp2.notes)){
      return -1;
    }
    if(this.calculateAverageNote(comp1.notes) > this.calculateAverageNote(comp2.notes)){
      return 1;
    }
    if(this.calculateAverageNote(comp1.notes) == this.calculateAverageNote(comp2.notes)){
      // departajare
      // compar notele incepand cu prima categorie
      for(let i = 0; i < comp1.notes.length; i++){
        this.compareNotes(comp1.notes[i].nota_juriu, comp2.notes[i].nota_juriu)
      }
    }
    return Math.round(Math.random());
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
    this.getContest()
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

    for (let index = 0; index < this.competitors_in_contest.length; index += +size) {
      let myChunk = this.competitors_in_contest.slice(index, index + +size);
      this.series.push(myChunk);
    }

    // pun in alt array pt firebase
    for(let i = 0; i < this.series.length; i++){
      // // simulare note sincron
      // for(let j = 0; j < this.series[i].length; j++){
      //   this.series[i][j].notes = [];
      //   this.series[i][j].notes.push(
      //     {
      //       nota_juriu: [
      //         {categ: 'Tehnica', note: '10', weight: '1/3'},
      //         {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //         {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      //       ]
      //     }
      //   )
      //   this.series[i][j].notes.push(
      //     {
      //       nota_juriu: [
      //         {categ: 'Tehnica', note: '9', weight: '1/3'},
      //         {categ: 'Coregrafie', note: '8', weight: '1/3'},
      //         {categ: 'Impresie Ansamblu', note: '7', weight: '1/3'}
      //       ]
      //     }
      //   )
      // }
      // // simulare note asincron
      // this.series[i][0].notes = []
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
      //       {categ: 'Tehnica', note: '10', weight: '1/3'},
      //       {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //       {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      //     ]
      //   }
      // )

      // // simulare note battle
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
    // this.contest.juries_votes_finish = '2';
    this.contest.rounds.push({roundNr: this.contest.current_round_number, round: this.contest_series});
    this.firebaseService.updateContest(this.contest.key, this.contest)

  }


  getWinners(){
    //while(this.contest.jury_stop_round != this.contest.connected_juries_num){
    //  this.getContest();
    //}
    if(this.contest.jury_stop_round == this.contest.connected_juries_num &&
      this.contest.jury_stop_round > 0 && this.contest.connected_juries_num > 0){ // s-a terminat runda
      switch (this.contest.contest_type) {
        case 'Battle': {
          for(let i = 0; i < this.contest.rounds[this.contest.current_round_number].round.length; i++){ // seriile curente
            // battle
            let cmp = this.compare(this.contest.rounds[this.contest.current_round_number].round[i].serie[0],
               this.contest.rounds[this.contest.current_round_number].round[i].serie[1]);
            if(cmp == 1){
              this.firebaseService.eliminateCompetitor(this.contest.rounds[this.contest.current_round_number].round[i].serie[1].key)
            } else if(cmp == -1){
              this.firebaseService.eliminateCompetitor(this.contest.rounds[this.contest.current_round_number].round[i].serie[0].key)
            }
          }
          break;
        }

        case 'Evolutie asincrona': {
          var competitors_number_eliminate = this.contest.competitors_eliminate;
          var series = this.contest.rounds[this.contest.current_round_number].round;
          // sort
          series.sort(this.compareAsinc)

          if(this.contest.current_round_number == this.contest.rounds_number - 1) { // ultima runda
            // numai elimin cat trebuia, iau doar castigatorul
            for(let i = 0; i < this.competitors.length - 1; i++){ // seriile curente
              this.firebaseService.eliminateCompetitor(series[i].serie[0].key)
            }
            break;
          }

          // eliminate last competitors
          for(let i = 0; i < competitors_number_eliminate; i++){ // seriile curente
            this.firebaseService.eliminateCompetitor(series[i].serie[0].key)
          }
          break;
        }

        case 'Evolutie sincrona': {
          console.log(this.contest.rounds[this.contest.current_round_number].round);
          var competitors_number_eliminate = this.contest.competitors_eliminate;
          var series = this.contest.rounds[this.contest.current_round_number].round;
          // sort
          if(this.contest.current_round_number == this.contest.rounds_number - 1) { // ultima runda
            // numai elimin cat trebuia, iau doar castigatorul
            serie = this.contest.rounds[this.contest.current_round_number].round[0].serie
            serie.sort(this.compare)
            for(let j = 0; j < this.competitors.length - 1; j++){
              this.firebaseService.eliminateCompetitor(serie[j].key)
              console.log(serie[j].key)
            }
            break;
          }

          for(let i = 0; i < this.contest.rounds[this.contest.current_round_number].round.length; i++){ // seriile curente
            // sortez desc seria
            var serie = this.contest.rounds[this.contest.current_round_number].round[i].serie;
            serie.sort(this.compare)
            for(let j = 0; j < competitors_number_eliminate; j++){
              this.firebaseService.eliminateCompetitor(serie[j].key)
              console.log(serie[j].key)
            }
          }
          break;
        }

        default: {
          break;
        }

      }
      this.contest.current_round_number++;
      if(this.contest.current_round_number == this.contest.rounds_number){
        this.contest.done = true;
      }
      this.firebaseService.updateContest(this.contest.key, this.contest);
    }
  }

  startRound(){
    if(this.contest.current_round_number < this.contest.rounds_number){
      this.contest.jury_stop_round = 0;
      this.firebaseService.updateContest(this.contest.key, this.contest);
      this.manageRounds();
    }
  }

}
