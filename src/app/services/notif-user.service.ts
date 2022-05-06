import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router} from '@angular/router';
import { NotifUser } from '../models/notif-user';

@Injectable({
  providedIn: 'root'
})
export class NotifUserService {

  user = false;
  query;
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;
  notifUsers: NotifUser[]

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendNotifUser(notifUser: NotifUser){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/notification_suscribers`, notifUser, { headers: headers}).toPromise();
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
  updateNotifUser(notifUser: NotifUser){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/notification_suscribers/${notifUser.id}`, notifUser, { headers: headers}).toPromise();
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
  notifUserList(token: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/notification_suscribers/?token=${token}`, { headers: headers}).toPromise();
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
}

