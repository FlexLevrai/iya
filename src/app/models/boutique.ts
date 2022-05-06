export class Boutique {
    constructor(
      public title: string,
      public description: string,
      public prix: string,
      public livraison: string,
      public images: string,
      public artisan: string,
      public productId: string,
      public isValid: boolean,
      public category: Array<string>,
    ){
    }
    id: number;
}
