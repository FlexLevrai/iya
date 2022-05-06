export class Commande {
    constructor(
        public nombre: string,
        public fullname: string,
        public productcode: string,
        public product: any,
        public adresse: string,
        public telephone: string,
        public longitude: any,
        public latitude:any,
        public isTreat: boolean,
        ){
      }
      id: number;
}
