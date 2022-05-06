import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Annonce} from '../models/annonce';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  user = false;
  query;
  annonceDispo: string;
  annonces: Annonce[];
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendAnnonce(annonce: Annonce){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/chantiers`, annonce, { headers: headers}).toPromise();
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
  updateAnnonce(annonce: Annonce){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/chantiers/${annonce.id}`, annonce, { headers: headers}).toPromise();
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
  annonceList(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/chantiers/?promoteur=${email}`, { headers: headers}).toPromise();
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
  getAllAnnonce(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/chantiers`, { headers: headers}).toPromise();
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
  annoncebyId(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/chantiers/${id}`, { headers: headers}).toPromise();
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
  deleteAnnonce(id){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.delete(`${this.url}api/chantiers/${id}`,  { headers: headers}).toPromise();
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
  // annonceExecuteur(email: string){
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  // });
  //   return new Promise(
  //     (resolve, reject) => {
  //       const promise = this.httpClient.get(`${this.url}api/annonces/?executeur=${email}`, { headers: headers}).toPromise();
  //       promise.then(
  //             (data) => {
  //               resolve(data);
  //             },
  //             (error) => {
  //               reject(error);
  //             }
  //           );
  //         }
  //       );
  // }
  // annonceProprietaire(email: string){
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  // });
  //   return new Promise(
  //     (resolve, reject) => {
  //       const promise = this.httpClient.get(`${this.url}api/annonces/?proprietaire=${email}`, { headers: headers}).toPromise();
  //       promise.then(
  //             (data) => {
  //               resolve(data);
  //             },
  //             (error) => {
  //               reject(error);
  //             }
  //           );
  //         }
  //       );
  // }
  // UploadFile(file: FormData) {
  //   const headers = new HttpHeaders({
  //     // 'Access-Control-Allow-Origin':'*',
  //     // 'Content-Type': 'multipart/form-data'
  //     // 'Authorization' : `Bearer ${this.token}`
  // });
  //   // formData.append('image', file);
  //   return new Promise(
  //   (resolve, reject) => {
  //     this.httpClient
  //     .post<any>(`${this.url}api/media_objects`, file, {headers: headers})
  //     .subscribe(
  //       (response) => {
  //         resolve(response);
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + error.message);
  //         reject(error.message);
  //       }
  //     );
  //   }
  // );
  // }
}

