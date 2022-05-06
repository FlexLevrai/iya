import { ServerToken } from './../models/server-token';
import { Token } from './../models/token';
import { SigninUser } from './../models/signin-user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Users} from '../models/users';
import { ToastService } from './toast.service';
import { Router} from '@angular/router';
import { RecoverPassword } from './../models/recover-password';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ResetPassword } from './../models/reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token;
  user = false;
  query;
  url: string = environment.apiUrl;
  typeId: string;
  userStatus: ServerToken[];
  constructor(private httpClient: HttpClient,
              private router: Router,
              private snackBar: MatSnackBar,
              public toastService: ToastService) { }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  createNewUser(newUser: Users){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/users`, newUser, { headers: headers}).toPromise();
        promise.then(
              (data) => {
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  updateUser(newUser: Users){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/users`, newUser, { headers: headers}).toPromise();
        promise.then(
              (data) => {
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  recoverPasswordUser(email: string){
    const recoverData = new RecoverPassword(email);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}reset-password`, recoverData, { headers: headers}).toPromise();
        promise.then(
              (data) => {
                resolve(data);
                localStorage.setItem('userMail', email);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  resetPasswordUser(password: string, token: string){
    const resetData = new ResetPassword(password, localStorage.getItem('userMail'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}reset-password/reset/${token}`, resetData, { headers: headers}).toPromise();
        promise.then(
              (data) => {
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  profilUser(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/users?email=${email}`, { headers: headers}).toPromise();
        promise.then(
              (data) => {
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  signInUser(email: string, password: string) {
    const signinData = new SigninUser(email, password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.post(`${this.url}authentication_token`, signinData, { headers: headers}).toPromise();
      promise.then(
        (data: Token) => {
          localStorage.setItem('userActive', data.token);
          localStorage.setItem('userMail', email);
          this.sendToken(data.token).then((ev) => {
            resolve(data);
            resolve(ev);
          }).catch((error) => {
            reject(error);
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
    )
  }
  getUserStatus(token: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.get(`${this.url}api/tokens/?token=${token}`, { headers: headers}).toPromise();
      promise.then(
        (data: ServerToken) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    )
  }
  verifyNumber(email: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.post(`${this.url}verify`, { email: email }, { headers: headers}).toPromise();
      promise.then(
        (data: ServerToken) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    );
  }
  verifyCode(code: any){
    const email = localStorage.getItem('userMail');
    console.log(email);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.post(`${this.url}verify-number/${code}`, { email: email }, { headers: headers}).toPromise();
      promise.then(
        (data: ServerToken) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    );
  }
  verifyCodeReset(code: any){
    const email = localStorage.getItem('userMail');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.post(`${this.url}reset-password/verify-code-reset/${code}`, { email: email },
       { headers: headers}).toPromise();
      promise.then(
        (data: ServerToken) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    );
  }
  sendToken(token: any){
    const tps = Date.now();
    const serverTkn = new ServerToken(token, tps+'', false);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.post(`${this.url}api/tokens`, serverTkn, { headers: headers}).toPromise();
      promise.then(
        (data: Token) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    )
  }
  updateToken(token: any, id:any){
    const tps = Date.now();
    const serverTkn = new ServerToken(token, tps+'', true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.put(`${this.url}api/tokens/${id}`, serverTkn, { headers: headers}).toPromise();
      promise.then(
        (data: Token) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    }
    )
  }
  signOutUser() {
    this.token = localStorage.getItem('userActive');
    this.getUserStatus(this.token).then((data: ServerToken[]) => {
      this.userStatus= data;
      console.log(this.userStatus[0])
      if (!this.userStatus[0].expire) {
        console.log(this.userStatus[0].id);
        this.updateToken(this.userStatus[0].token,this.userStatus[0].id).then((ev) => {
          this.openSnackBar('Déconnexion réussie', 'OK');
          localStorage.setItem('userActive', '');
          localStorage.setItem('userMail', '');
          localStorage.setItem('role', '');
          this.router.navigate(['/']);
        }).catch((error) => {
          this.openSnackBar('Erreur lors de la déconnexion', 'OK');
        });
      } else {
        this.openSnackBar('Déconnexion réussie', 'OK');
        this.router.navigate(['/']);
      }
    }).catch((error) =>{
      this.openSnackBar('Erreur lors de la déconnexion', 'OK');
      console.log(error);
    });
 }
}
