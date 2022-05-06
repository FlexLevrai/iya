export class ServerToken {
  constructor(
    public token: string,
    public validity: string,
    public expire: boolean,
  ) {

  }
  id : string;
}
