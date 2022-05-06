import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Postulation } from '../models/postulation';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostulationService {

  user = false;
  query;
  annonceDispo: string;
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendPostulation(postulation: Postulation){
    const headers = new HttpHeaders({
    'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
    const promise = this.httpClient.post(`${this.url}api/postulations`, postulation, { headers: headers}).toPromise();
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
    updatePostulation(postulation: Postulation){
    const headers = new HttpHeaders({
    'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
    const promise = this.httpClient.put(`${this.url}api/postulations/${postulation.id}`, postulation, { headers: headers}).toPromise();
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
    postulationList(telephone: string){
    const headers = new HttpHeaders({
    'Content-Type': 'application/json'
    });
    return new Promise(
    (resolve, reject) => {
    const promise = this.httpClient.get(`${this.url}api/postulations/?telephone=${telephone}`, { headers: headers}).toPromise();
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
  getAllPostulation(){
  const headers = new HttpHeaders({
  'Content-Type': 'application/json'
  });
  return new Promise(
  (resolve, reject) => {
  const promise = this.httpClient.get(`${this.url}api/postulations`, { headers: headers}).toPromise();
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
  postulationbyId(id: number){
  const headers = new HttpHeaders({
  'Content-Type': 'application/json'
  });
  return new Promise(
  (resolve, reject) => {
  const promise = this.httpClient.get(`${this.url}api/postulations/${id}`, { headers: headers}).toPromise();
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
  postulationPostulant(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/postulations/?postulant=${email}`, { headers: headers}).toPromise();
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
  postulationPromoteur(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/postulations/?promoteur=${email}`, { headers: headers}).toPromise();
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
  postulationPromoteurById(id){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/postulations/?chantier=${id}`, { headers: headers}).toPromise();
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