export class Status{
  id: number;
  name: string;

  constructor(status: Status){
    this.id = status.id;
    this.name = status.name;
  }

}
