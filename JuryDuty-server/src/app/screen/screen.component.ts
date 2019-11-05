import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Contest, NotaJuriu, Competitor } from '../models';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})

export class ScreenComponent implements OnInit {

  contests: Contest[];
  contest: Contest;
  rounds = [];

  constructor(
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.contest = <Contest>{ done: false, key: "" };

    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contests = actionArray.map(item => { return item as Contest });
      this.contest = this.contests[0];
    });
  }

  calculateAverage(notes: Array<NotaJuriu>){
    var sum = 0;
    for(let i = 0; i < notes.length; i++){
      for(let j = 0; j < notes[i].nota_juriu.length; j++){
        sum += parseInt(notes[i].nota_juriu[j].note, 10) * parseFloat(notes[i].nota_juriu[j].weight);
      }
    }
    return sum / notes.length;
  }

  compareComp(competitor1: Competitor, competitor2: Competitor){
    if(competitor1.key == competitor2.key){
      if(competitor1.flag == '0'){
        return true;
      }
    }
  }


}