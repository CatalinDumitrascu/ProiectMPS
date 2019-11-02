import { Component, OnInit } from '@angular/core';
import { Contest, Competitor } from '../models';
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
  competitors = null;
  battles = [];
  rounds = null;
  series = null;

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
    this.contest = {done: false, key: ""};

    this.getContest()
    
    if(this.contest.done == true){
      this.disabled = true;
    }
  }

  getContest(){
    this.firebaseService.getContests()
    .then(result => 
      {
        this.contest = result.filter(x => x.payload.doc.data().done == false)[0].payload.doc.data()
        console.log(this.contest.rounds[0].round.battle[0].notes)
        this.emptyTable = false;
        this.firebaseService.getCompetitors(this.contest.key)
        .subscribe( result => {
          this.competitors = result.map(it => it.payload.doc.data())
          console.log(this.competitors)
        })
      }
    )
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
    this.contest.rounds = [];
    this.competitors = this.shuffle(this.competitors)

    var size = 2;
    while (this.competitors.length > 0)
        this.battles.push(this.competitors.splice(0, size));
    for(let battle of this.battles){
      // battle[0].notes = [
      //   {Categ1: '10'},
      //   {Categ2: '10'},
      //   {Categ3: '10'}
      // ]
      // battle[1].notes = [
      //   {Categ1: '10'},
      //   {Categ2: '10'},
      //   {Categ3: '10'}
      // ]
      this.contest.rounds.push({roundNr: '0', round: {battle: battle}});
    }
    console.log(this.contest.rounds)
    this.firebaseService.updateContest(this.contest.key, this.contest)
  }

  getWinners(){
  }

}
