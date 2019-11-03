import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Contest } from '../models';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})

export class ScreenComponent implements OnInit {

  contests: Contest[];
  contest: Contest;

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

}
