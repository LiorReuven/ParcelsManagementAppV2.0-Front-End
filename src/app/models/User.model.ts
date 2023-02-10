export class User {
  _id:string  = '';
  token:string = ''; 
  tokenExpiration: Date;
  constructor( _id: string, token: string, tokenExpiration: Date) {
   this._id = _id
   this.token = token
   this.tokenExpiration= tokenExpiration
  }

  get tokenValue() {
    if (!this.tokenExpiration || new Date() > this.tokenExpiration) {
      return null
    }
    return this.token
  }
}
