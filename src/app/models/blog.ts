export class Blog {
    constructor(
        public title: string,
        public article: string,
        public vues: number,
        public images: string,
        public auteur: string,
        ){
      }
      id: number;
      createdAt: Date;
}
