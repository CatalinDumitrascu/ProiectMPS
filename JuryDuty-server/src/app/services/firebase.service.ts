import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Contest, Competitor } from '../models';
import { config } from '../config'


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  contests: AngularFirestoreCollection<Contest>;
  private contestDoc: AngularFirestoreDocument<Contest>;
  competitorsPerContest = [];
  competitors: AngularFirestoreCollection<Competitor>;
  private competitorDoc: AngularFirestoreDocument<Competitor>;
  competitor: Competitor;
  constructor(
    private http: HttpClient,
    private db: AngularFirestore
    ) {
      this.contests = db.collection<Contest>(config.collection_endpoint);
      this.competitors = db.collection<Competitor>(config.competitors);
     }

  addContest(contest: Contest){
    return this.contests.add(contest);
  }

  getContestsAsync() {
    return this.contests.valueChanges();
  }

  getContests(){
    return new Promise<any>((resolve, reject) => {
      this.contests.snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots)
      })
    })
  }

  addCompetitor(competitor){
    return this.competitors.add(competitor)
  }

  getCompetitors(contestId: string){
    return this.db.collection(config.competitors, ref => ref.where('contest', '==', contestId)
    .where('flag', '==', '0'))    // sunt inca in concurs
    .snapshotChanges()
  }
  
  getCompetitorsAsync(){
    return this.db.collection(config.competitors, ref => ref.where('flag', '==', '0'))    // sunt inca in concurs
    .valueChanges()
  }

  eliminateCompetitor(id:string){
    return this.db.collection(config.competitors).doc(id).update({flag: "1"});
  }

  updateCompetitor(id: string, competitor: Competitor){
    // get contestDoc
    let competitorDoc = this.db.doc<Competitor>(`${config.competitors}/${id}`);
    competitorDoc.set(competitor);
  }

  updateContest(id: string, contest: Contest){
    // get contestDoc
    this.contestDoc = this.db.doc<Contest>(`${config.collection_endpoint}/${id}`);
    this.contestDoc.set(contest);
  }

  deleteContest(id: string){
    // delete all contest competitors
    // does not work properly
    this.getCompetitors(id)
      .subscribe( result => {
        this.competitorsPerContest = result.map(it => it.payload.doc.data())
        for(let competitor of this.competitorsPerContest){
          this.db.collection(config.competitors).doc(competitor.key).delete();
        }
      });

    return this.db.collection(config.collection_endpoint).doc(id).delete();
  }

}
