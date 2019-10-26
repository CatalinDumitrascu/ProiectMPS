import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private titleService: Title) {
      this.titleService.setTitle("Welcome to JuryDuty!");
     }

  ngOnInit() {
  }

  onLogin(credentials: {username: string, password: string}) {
    // just for now
    if(credentials.username == 'admin' && credentials.password == 'admin'){
      console.log(credentials)
      this.router.navigate(['/home'])
    }
  }

}
