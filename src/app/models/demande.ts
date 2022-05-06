export class Demande {
  constructor(
    public metier: string,
    public description: string,
    public status: string,
    public proprietaire: string,
    public executeur: string,
    public detailQuestions: string,
    public details: string,
    public imagePath: string,
  ) {
  }
  id: number;
  disponibilite: string;
  executionDate: string;
  createAt: Date;
}

