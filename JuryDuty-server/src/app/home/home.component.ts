import { Component, OnInit } from '@angular/core';
import { Contest, Competitor, NotesCateg } from '../models';
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
  series = [];
  contest_series = [];
  rounds = null;
  start_round: Boolean;
  end_round: Boolean;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.disabled = true;
    this.emptyTable = true;
    this.rounds = null;
  }

  ngOnInit() {
    this.contest = { done: false, key: "" };

    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.emptyTable = false;
    });

    if (this.contest.done == true) {
      this.disabled = false;
    }
  }

  getContest() {
    this.firebaseService.getContests()
      .then(result => {
        this.contest = result.filter(x => x.payload.doc.data().done == false)[0].payload.doc.data()
        this.emptyTable = false;
        // for(let i = 0; i < this.contest.rounds.length; i++){
        //   if(this.calculateAverageNote(this.contest.rounds[i].round.serie[0].notes) >= this.calculateAverageNote(this.contest.rounds[i].round.serie[1].notes)){
        //     this.competitors.push(this.contest.rounds[i].round.serie[0])
        //   } else{
        //     this.competitors.push(this.contest.rounds[i].round.serie[1])
        //   }
        // }

        console.log(this.competitors)
        this.firebaseService.getCompetitors(this.contest.key)
          .subscribe(result => {
            this.competitors = result.map(it => it.payload.doc.data())
            console.log(this.competitors)
          });
      });
  }

  calculateAverageNote(notes: Array<NotesCateg>) {
    var sum_avg = 0;
    for (let i = 0; i < notes.length; i++) {
      sum_avg += parseInt(notes[i].note, 10) * parseFloat(notes[i].weight);
    }
    return sum_avg;
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

  manageRounds() {
    this.series = [];
    this.contest_series = []
    this.contest.rounds = [];
    this.competitors = this.shuffle(this.competitors)
    this.contest.roundNr = 0;
    var size = 2;
    while (this.competitors.length > 0)
      this.series.push(this.competitors.splice(0, size));
    // pun in alt array pt firebase
    for (let i = 0; i < this.series.length; i++) {
      // this.series[i][0].notes = [
      //   {categ: 'Tehnica', note: '10', weight: '1/3'},
      //   {categ: 'Coregrafie', note: '10', weight: '1/3'},
      //   {categ: 'Impresie Ansamblu', note: '10', weight: '1/3'}
      // ]
      // this.series[i][1].notes = [
      //   {categ: 'Tehnica', note: '10', weight: '1/3'},
      //   {categ: 'Coregrafie', note: '9', weight: '1/3'},
      //   {categ: 'Impresie Ansamblu', note: '8', weight: '1/3'}
      // ]
      // this.contest_series.push({serieNr: i, serie: this.series[i]})
    }
    this.contest.rounds.push({ roundNr: '0', round: this.contest_series });
    console.log(this.contest.rounds)
    this.firebaseService.updateContest(this.contest.key, this.contest)
  }

  getWinners() {
  }

}
