import { Demande } from './demande';
export class Devis {
  constructor(
    public titre: string,
    public designation: string,
    public quantite: number,
    public prixUnitaire: string,
    public total: number,
    public demande: string,
  ) {
  }
  id: number;
}
