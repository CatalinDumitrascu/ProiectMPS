import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContestSetupComponent } from './contest-setup/contest-setup.component';
import { AddCompetitorComponent } from './add-competitor/add-competitor.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: ContestSetupComponent
  },
  {
    path: 'add-competitor',
    component: AddCompetitorComponent
  },
  { 
    path : '',
    redirectTo:'/login',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
