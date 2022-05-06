import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Demande} from '../models/demande';
import { Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  user = false;
  query;
  demandeDispo: string;
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendDemande(demande: Demande){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/demandes`, demande, { headers: headers}).toPromise();
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
  updateDemande(demande: Demande){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/demandes/${demande.id}`, demande, { headers: headers}).toPromise();
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
  demandeList(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/demandes/?proprietaire=${email}`, { headers: headers}).toPromise();
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
  getAllDemande(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/demandes`, { headers: headers}).toPromise();
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
  demandebyId(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/demandes/${id}`, { headers: headers}).toPromise();
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
  demandeExecuteur(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/demandes/?executeur=${email}`, { headers: headers}).toPromise();
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
  demandeProprietaire(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/demandes/?proprietaire=${email}`, { headers: headers}).toPromise();
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
  UploadFile(file: FormData) {
    const headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin':'*',
      // 'Content-Type': 'multipart/form-data'
      // 'Authorization' : `Bearer ${this.token}`
  });
    // formData.append('image', file);
    return new Promise(
    (resolve, reject) => {
      this.httpClient
      .post<any>(`${this.url}api/media_objects`, file, {headers: headers})
      .subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.log('Erreur ! : ' + error.message);
          reject(error.message);
        }
      );
    }
  );
  }
}
