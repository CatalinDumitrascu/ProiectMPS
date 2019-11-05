export interface Serie{
  competitors: Array<Competitor>,
  serieNr: number
}

export interface Runda{
  series: Array<Serie>,
  roundNr: number
}

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
    key: string,
    medie: string
  }

export interface Serie {
  serieNr : number,
  serie: {
    0: Competitor,
    1: Competitor
  }
}

export interface Round {
  roundNr: number,
  round: Array<Serie>
}

  export interface Contest {
    key: string,
    contest_name_id: string,
    contest_name: string,
    contest_categs: Array<String>,
    contest_type: string,
    total_competitors_number: number,
    rounds_number: number,
    competitors_number_per_serie: number,
    competitors_eliminate: number,
    password: string,
    done: boolean,
    rounds: Array<Round>,
    current_round_number: number,
    current_series_number: number,
    jury_stop_round: number;
    connected_juries_num: number
  }