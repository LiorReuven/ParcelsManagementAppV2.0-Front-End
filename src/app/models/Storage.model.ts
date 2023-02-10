export class Storage {
  constructor(
    public name: string,
    public color: string,
    public position: number,
    public company?:string,
    public _id?: string,
  ) {}
}