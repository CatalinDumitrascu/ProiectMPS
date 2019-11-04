export interface Serie{
  competitors: Array<Competitor>,
  serieNr: string
}

export interface Runda{
  series: Array<Serie>,
  roundNr: string
}

// export interface NoteConcurentiRunda{
//   noteRunda: Array<NotesCateg>,
//   medie: string
// }

// export interface Competitor{
//   name: string,
//   contest: string,
//   notes: Array<NoteConcurentiRunda>,
//   flag: string // 0 - in concurs, 1 - eliminat, 2 - descalificat ?
// }


export interface NotaCategorie{
  categ: string,
  note: string,
  weight: string 
}

export interface NotaJuriu{
  nota_juriu: Array<NotaCategorie>
}

export interface Competitor {
    name: string,
    contest: string,
    notes: Array<NotaJuriu>,
    flag : string, // 0 - in concurs, 1 - eliminat, 2 - descalificat ?
  }

export interface Serie {
  serieNr : string
  serie: {
    0: Competitor,
    1: Competitor
  }
}

export interface Round {
  roundNr: string,
  round: Array<Serie>
}

  export interface Contest {
    key: string,
    contest_name_id: string,
    contest_name: string,
    contest_categs: Array<String>,
    contest_type: string,
    total_competitors_number: string,
    rounds_number: string,
    competitors_number_per_serie: string,
    password: string,
    done: boolean,
    competitors: Array<Competitor>,
    rounds: Array<Round>,
    current_round_number: string,
    current_series_number: string,
    juries_votes_finish: string;
    connected_juries_num: string
  }