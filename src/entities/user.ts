export class User {
  public avatar: string;
  public password: string;

  constructor(public name: string, public email: string, avatar?: string, passord?: string) {
    this.avatar = '';
    this.password = '';
    if (avatar){
      this.avatar = avatar;
    }
    if (passord) {
      this.password = passord;
    }
  }
}
