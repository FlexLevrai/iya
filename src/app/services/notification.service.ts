import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router} from '@angular/router';
import { Notification } from '../models/notification'; 

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  user = false;
  query;
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;
  notifs: Notification[]

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendNotif(notif: Notification){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/notifications`, notif, { headers: headers}).toPromise();
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

  notifList(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/notifications`, { headers: headers}).toPromise();
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


