export class  Parcel {
  constructor(
  public _id: string,
  public barcode: string,
  public position: string,
  public company: string,
  public isOnStock: boolean,
  public createdAt:Date,
  public released:string,
  public returned:boolean,
  public returnLocked:boolean,
  public updatedAt:Date,
  public created?:string,
  public releasedAt?:Date,
  ) 
  {}
}