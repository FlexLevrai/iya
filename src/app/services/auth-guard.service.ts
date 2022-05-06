import { ServerToken } from './../models/server-token';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  userStatus :ServerToken[];
  token;
  constructor(private router: Router,
              private authService: AuthService) { }

  // canActivate(): Observable<boolean> | Promise<boolean> | boolean {
  //   return new Promise(
  //     (resolve, reject) => {
  //       const user = this.authService.user;
  //       if (user) {
  //             resolve(true);
  //           } else {
  //             this.router.navigate(['/auth', 'signin']);
  //             resolve(false);
  //           }
  //       }
  //   );
  // }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
    this.token = localStorage.getItem('userActive');
    return new Promise(
      (resolve, reject) => {
      this.authService.getUserStatus(this.token).then((data:ServerToken[]) => {
        this.userStatus= data;
        if (!this.userStatus[0].expire) {
          resolve(true);
        } else {
          this.router.navigate(['/auth', 'signin'], {
            queryParams: {
              return: state.url
            }
          });
          resolve(false);
        }
      }).catch((error) =>{
        this.router.navigate(['/auth', 'signin'], {
          queryParams: {
            return: state.url
          }
        });
        resolve(false);
      });
    });
  }
}
