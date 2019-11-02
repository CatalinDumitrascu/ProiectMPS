export interface NotesCateg{
  categ: string,
  note: string
}
export interface Competitor {
    name: string,
    contest: string,
    notes: Array<NotesCateg>
  }
export interface Battle {
  battle: {
    0: Competitor,
    1: Competitor
  }
}
export interface Round {
  roundNr: string,
  round: Array<Battle>
}
  export interface Contest {
    key: string,
    contest_name_id: string,
    contest_name: string,
    contest_categ: Array<String>,
    contest_type: string,
    total_competitors_number: string,
    rounds_number: string,
    series_number: string,
    competitors_number: string,
    password: string,
    done: boolean,
    competitors: Array<Competitor>,
    rounds: Array<Round>
  }