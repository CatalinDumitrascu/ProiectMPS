import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Competitor, Contest } from './../models'
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../services/firebase.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { config } from '../config';

@Component({
  selector: 'app-contest-setup',
  templateUrl: './contest-setup.component.html',
  styleUrls: ['./contest-setup.component.css']
})

export class ContestSetupComponent implements OnInit {
  contest_types = [
    {id: 0, name: 'Battle'},
    {id: 1, name: 'Evolutie sincrona'},
    {id: 2, name: 'Evolutie asincrona'}
  ]
  contest_names = [
    {id: 0, name: 'Dans'},
    {id: 1, name: 'Muzica'},
    {id: 2, name: 'Gatit'}
  ]
  contest_categs = [
    {id: 0, categories: [{name: 'Tehnica', weight: '35'}, {name: 'Coregrafie', weight: '35'}, {name: 'Impresie ansamblu', weight: '30'}]},
    {id: 1, categories: [{name: 'Timbru', weight: '35'}, {name: 'Intonatie', weight: '35'}, {name: 'Interpretare', weight: '30'}]},
    {id: 2, categories: [{name: 'Gust', weight: '35'}, {name: 'Aspect', weight: '35'}, {name: 'Inventivitate', weight: '30'}]}
  ]
  categories = []
  currentContest = null
  contests: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private firebaseService: FirebaseService,
    private db: AngularFirestore) {
      this.titleService.setTitle("JuryDuty - contest setup");
    }

  ngOnInit() {
    this.contests = this.db.collection(config.collection_endpoint).valueChanges();
    // this.contests = this.db
    // .collection(config.collection_endpoint)
    // .snapshotChanges()
    // .map(actions => {
    //   return actions.map(a => {
    //     // Get document data
    //     const data = a.payload.doc.data() as Contest;
    //     //Get document id
    //     const id = a.payload.doc.id;
    //     //Use spread operator to add the id to the document data
    //     return { id, ...data };
    //   });
    // });
  }

  onSubmit(contest: Contest){
    contest.contest_categ = this.contest_categs[contest.contest_name_id].categories
    contest.contest_name = this.contest_names[contest.contest_name_id].name
    contest.done = false;
    return this.firebaseService.addContest(contest)
    .then(
      res => {
        contest.key = res.id;
        this.firebaseService.updateContest(res.id, contest)
        this.router.navigate(['/add-competitor', res.id])
      }
    )
  }

  onSelect(contestTypeId) {
    this.categories = this.contest_categs[contestTypeId].categories;
  }
}
