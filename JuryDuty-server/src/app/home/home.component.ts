import { Component, OnInit } from '@angular/core';
import { Contest, Competitor, NotesCateg, Round, Serie, NoteConcurentiRunda } from '../models';
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
  contest: Contest;
  disabled: Boolean;
  emptyTable: Boolean;
  competitors: Competitor[];
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
    this.disabled = false;
    this.emptyTable = true;
    this.rounds = null;
  }

  ngOnInit() {
    this.contest = <Contest>{ done: false, key: "" };

    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
      this.emptyTable = false;
    }); 
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
            this.competitors = result.map(it => it.payload.doc.data() as Competitor)
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

  manageFirstRound() {
    this.contest.rounds = new Array<Round>();

    switch (this.contest.contest_type) {
      case 'Battle': {
        this.contest.competitors_number_per_serie = '2';
        break;
      }
      case 'Evolutie sincrona': {
        this.contest.competitors_number_per_serie = '1';
        break;
      }
      default: {
        break;
      }
    }

    var numberOfSeries = parseInt(this.contest.total_competitors_number) / parseInt(this.contest.competitors_number_per_serie);

    var newRound = <Round>{};
    newRound.roundNr = '1';
    newRound.series = new Array<Serie>();

    this.competitors = new Array<Competitor>();
    this.competitors = this.contest.competitors.concat();

    for (let i = 0; i < numberOfSeries; i++) {
      var newSeries = <Serie>{};
      newSeries.competitors = new Array<Competitor>();
      newSeries.serieNr = (i + 1).toString();

      var competitors = this.competitors.splice(0, parseInt(this.contest.competitors_number_per_serie));

      competitors.forEach(function (c) {
        c.noteConcurentRunda = <NoteConcurentiRunda>{};
        c.noteConcurentRunda.medie = '0';
        c.noteConcurentRunda.noteRunda = new Array<NotesCateg>();

        newSeries.competitors.push(c);
      });

      newRound.series.push(newSeries);
    }

    this.contest.rounds.push(newRound);
    this.firebaseService.updateContest(this.contest.key, this.contest)
  }

  getWinners() {
  }

}
