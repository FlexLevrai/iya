export class Annonce {
    constructor(
      public title: string,
      public description: string,
      public images: string,
      public categorie: string,
      public nombre: string,
      public promoteur: string,
      public adresse: string,
      public longitude: string,
      public latitude: string,
      public isValid: boolean,
      ){
    }
    id: number;
}
