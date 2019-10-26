import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Competitor, Contest } from './../models'
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contest-setup',
  templateUrl: './contest-setup.component.html',
  styleUrls: ['./contest-setup.component.css']
})

export class ContestSetupComponent implements OnInit {
  contest_types = [
    {id: 1, name: 'Battle'},
    {id: 2, name: 'Evolutie sincrona'},
    {id: 3, name: 'Evolutie asincrona'}
  ]
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: Title) {
      this.titleService.setTitle("JuryDuty - contest setup");
    }

  ngOnInit() {
  }

  onSubmit(contest: Contest){
    this.http.post(
      'https://juryduty-5b884.firebaseio.com/contest.json',
      contest
      ).subscribe(response => {
        console.log(response)
      });
      this.router.navigate(['/add-competitor'])
  }
}
