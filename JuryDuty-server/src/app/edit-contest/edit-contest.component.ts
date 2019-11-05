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
  selector: 'app-edit-contest',
  templateUrl: './edit-contest.component.html',
  styleUrls: ['./edit-contest.component.css']
})
export class EditContestComponent implements OnInit {

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
    {id: 0, categories: [{name: 'Tehnica', weight: '1/3'}, {name: 'Coregrafie', weight: '1/3'}, {name: 'Impresie ansamblu', weight: '1/3'}]},
    {id: 1, categories: [{name: 'Timbru', weight: '1/3'}, {name: 'Intonatie', weight: '1/3'}, {name: 'Interpretare', weight: '1/3'}]},
    {id: 2, categories: [{name: 'Gust', weight: '1/3'}, {name: 'Aspect', weight: '1/3'}, {name: 'Inventivitate', weight: '1/3'}]}
  ]
  categories = []
  currentContest = null
  contests: Observable<any[]>;
  currentContests: Contest[];
  contest = null;
  disabled: Boolean;
  emptyTable: Boolean;
  competitors = [];
  competitors_in_contest = [];
  types_id = 2;

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
    this.getContest();
  }
  getContest(){
    this.firebaseService.getContestsAsync().subscribe(actionArray => {
      this.currentContests = actionArray.map(item => { return item as Contest });
      this.contest = this.currentContests[0];
      this.emptyTable = false;
      this.firebaseService.getCompetitors(this.contest.key)
      .subscribe( result => {
        this.competitors = result.map(it => it.payload.doc.data())
      })
    });
  }

  onSubmit(){
    
    console.log(this.contest)
    // contest.contest_categs = this.contest_categs[contest.contest_name_id].categories
    // contest.contest_name = this.contest_names[contest.contest_name_id].name
    this.firebaseService.updateContest(this.contest.key, this.contest)
    this.router.navigate(['/home'])
  }
  addNewCategory(categ){
    let id = -1;
    for (let i = 0; i < this.contest_names.length; i++){
      if (this.contest_names[i].name == this.contest.contest_name){
        id = i;
      }
    }
    this.contest_categs[id].categories = this.contest_categs[id].categories.concat({name:categ.new_category, weight:''});
    for (let i = 0; i < this.contest_categs[id].categories.length; i++){
      this.contest_categs[id].categories[i].weight = '1/' + (this.contest_categs[id].categories.length).toString()
    }
    this.contest.contest_categs = this.contest_categs[id].categories
    console.log(this.contest.contest_categs)
  }
  removeCategory(categ){
     // verific ce lista de categorii corespunde
    let id = -1;
    for (let i = 0; i < this.contest_names.length; i++){
      if (this.contest_names[i].name == this.contest.contest_name){
        id = i;
      }
    }
    for (let i = 0; i < this.contest_categs[id].categories.length; i++){
      if(this.contest_categs[id].categories[i].name == categ.delete_category){
        this.contest_categs[id].categories.splice(i, 1)
        break;
      }
    }
    for (let i = 0; i < this.contest_categs[id].categories.length; i++){
      this.contest_categs[id].categories[i].weight = '1/' + (this.contest_categs[id].categories.length).toString()
    }
    this.contest.contest_categs = this.contest_categs[id].categories
    console.log(this.contest.contest_categs)
  }

  onSelect(contestTypeId) {
    this.categories = this.contest_categs[contestTypeId].categories;
  }

}
