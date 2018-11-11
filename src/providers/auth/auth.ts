import { Injectable } from '@angular/core';
import firebase from 'firebase';

//providers
import { UserProvider } from '../user/user';

@Injectable()
export class AuthProvider {

  constructor(
    public user: UserProvider
  ) {
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(newUser => {        
        this.user.uid = newUser.user.uid;
        this.user.loadUser();
      });
  }

  signupUser(email: string, password: string, nickName:string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.user.nickName = nickName;
        this.user.email = email;
        this.user.uid = newUser.user.uid;
        this.user.saveNewUser();
      });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }
}
