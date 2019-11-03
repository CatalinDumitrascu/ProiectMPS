import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Competitor, Contest } from '../models';
import { HttpClient } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators'
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { filter } from 'minimatch';

@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.css']
})
export class AddCompetitorComponent implements OnInit {
  competitors = null;
  contest = null;
  emptyTable: Boolean;
  disabled: Boolean;
  routeSub: Subscription;
  contestId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title,
    private firebaseService: FirebaseService) {
    this.titleService.setTitle("JuryDuty - add competitor");
    this.emptyTable = true;
    this.disabled = false;
  }

  ngOnInit() {
    // iau id-ul concursului curent din ruta
    this.routeSub = this.route.params.subscribe(params => {
      this.contestId = params['id']
    });
    this.fetchCompetitors();
    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.contest = actionArray.map(item => { return item as Contest })[0];
    });
  }

  onSubmit(competitor: Competitor) {
    this.fetchCompetitors()
    // cand s-au terminat de pus concurentii
    if (this.competitors.length == this.contest.total_competitors_number - 1) {
      competitor.contest = this.contestId
      competitor.flag = '0';
      this.firebaseService.addCompetitor(competitor)
      this.competitors.push(competitor)
      this.contest.competitors = this.competitors
      this.firebaseService.updateContest(this.contestId, this.contest)
      this.router.navigate(['/home']);
      return;
    }
    competitor.contest = this.contestId
    competitor.flag = '0';
    this.firebaseService.addCompetitor(competitor)
  }

  fetchCompetitors() {
    this.firebaseService.getCompetitors(this.contestId)
      .subscribe(result => {
        this.competitors = result.map(it => it.payload.doc.data())
        if (this.competitors.length > 0) {
          this.emptyTable = false;
        }
      })
  }


}
