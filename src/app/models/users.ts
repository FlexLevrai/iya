export class Users {
  constructor(
    public email: string,
    public password: string,
    public username: string,
    public firstname: string,
    public surname: string,
    public telephone: string,
    public userType: string,
    public adresse: string,
    public longitude: string,
    public latitude: string,
    public profession: string,
    public countrCode: string,
    public verified: boolean,
  ) {
  }
  roles: any;
  id: number;
}
