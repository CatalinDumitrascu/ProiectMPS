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

  competitors: AngularFirestoreCollection<Competitor>;
  private competitorDoc: AngularFirestoreDocument<Competitor>;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) {
    this.contests = db.collection<Contest>(config.collection_endpoint);
    this.competitors = db.collection<Competitor>(config.competitors);
  }

  addContest(contest: Contest) {
    return this.contests.add(contest);
  }

  getContests() {
    return new Promise<any>((resolve, reject) => {
      this.contests.snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots)
        })
    })
  }

  getContestsAsync() {
    return this.contests.valueChanges();
  }

  addCompetitor(competitor) {
    return this.competitors.add(competitor)
  }

  getCompetitors(contestId: string) {
    return this.db.collection(config.competitors, ref => ref.where('contest', '==', contestId))
      .snapshotChanges()
  }

  updateContest(id: string, contest: Contest) {
    // get contestDoc
    this.contestDoc = this.db.doc<Contest>(`${config.collection_endpoint}/${id}`);
    this.contestDoc.update(contest);
  }

  deleteContest(id: string) {
    // get contestDoc
    this.contestDoc = this.db.doc<Contest>(`${config.collection_endpoint}/${id}`);
    // delete the document
    this.contestDoc.delete();
  }
}
