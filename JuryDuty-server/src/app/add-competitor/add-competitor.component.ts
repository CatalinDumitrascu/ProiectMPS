import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competitor } from '../models';
import { HttpClient} from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { map} from 'rxjs/operators'

@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.css']
})
export class AddCompetitorComponent implements OnInit {
    competitors: Competitor[];
    emptyTable: Boolean;
    disabled: Boolean;

    constructor(
        private router: Router,
        private http: HttpClient,
        private titleService: Title) {
            this.titleService.setTitle("JuryDuty - add competitor");
            this.emptyTable = true;
            this.disabled = false;
        }

    ngOnInit() {
        this.fetchCompetitors();
    }

    onSubmit(competitor: Competitor){
        this.http.post(
            'https://juryduty-5b884.firebaseio.com/competitor.json',
            competitor
            ).subscribe(response => {
                this.competitors.push(competitor)
            });
    }

    fetchCompetitors(){
        this.http.get<Competitor[]>('https://juryduty-5b884.firebaseio.com/competitor.json')
        .pipe(map(responseData => {
            const array = [];
            for(const key in responseData) {
                if(responseData.hasOwnProperty(key)){
                    array.push({...responseData[key], id: key})
                }
            }
            return array;
        }))
        .subscribe(data => {
            console.log(data);
            this.competitors = data;
            this.emptyTable = false;
        })
    }

}