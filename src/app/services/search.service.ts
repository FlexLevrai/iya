import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Users} from '../models/users';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient,
              private router: Router) { }
  getProfession(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/users?exists[profession]=true`, { headers: headers}).toPromise();
        promise.then(
              (data:Users[]) => {
                const profession = [];
                data.forEach(e => { if(e.profession !== ""){
                  profession.push(e.profession);
                }})
                resolve(profession);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  getSearch(search: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/users?profession=${search}`, { headers: headers}).toPromise();
        promise.then(
              (data:Users[]) => {
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  getArtisans(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/users?exists[profession]=true`, { headers: headers}).toPromise();
        promise.then(
            (data:Users[]) => {
              const profession = [];
              let em;
              let email;
              data.forEach(e => { if(e.profession !== ""){
                em = e.email.match(/(\d+)/);
                if(em){
                  email = `+${em[0]}`;
                  profession.push(email);
                }
              }})
              resolve(profession);
            },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
}
