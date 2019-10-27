import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContestSetupComponent } from './contest-setup/contest-setup.component';
import { AddCompetitorComponent } from './add-competitor/add-competitor.component';
import { ScreenComponent } from './screen/screen.component';
import { HomeComponent } from './home/home.component';
import { EditContestComponent } from './edit-contest/edit-contest.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'add-contest',
    component: ContestSetupComponent
  },
  {
    path: 'edit-contest',
    component: EditContestComponent
  },
  {
    path: 'add-competitor',
    component: AddCompetitorComponent
  },
  {
    path: 'screen',
    component: ScreenComponent

  },
  {
    path: 'home',
    component: HomeComponent
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
