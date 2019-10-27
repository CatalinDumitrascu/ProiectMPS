import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Competitor, Contest } from './../models'
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
  dropdownSettings = {}
  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: Title) {
      this.titleService.setTitle("JuryDuty - contest setup");
    }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      limitSelection: 5
    };
  }

  onSubmit(contest: Contest){
    contest.contest_categ = this.contest_categs[contest.contest_name].categories
    console.log(contest.contest_categ)
    this.http.post(
      'https://juryduty-5b884.firebaseio.com/contest.json',
      contest
      ).subscribe(response => {
        console.log(response)
      });
      this.router.navigate(['/add-competitor'])
  }

  onSelect(contestTypeId) {
    console.log(contestTypeId)
    this.categories = this.contest_categs[contestTypeId].categories;
    console.log(this.categories)
  }
}
