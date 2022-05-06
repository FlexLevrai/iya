import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Boutique} from '../models/boutique';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  user = false;
  query;
  boutique: Boutique;
  boutiques: Boutique[];
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendBoutique(boutique: Boutique){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/products`, boutique, { headers: headers}).toPromise();
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
  updateBoutique(boutique: Boutique){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/products/${boutique.id}`, boutique, { headers: headers}).toPromise();
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
  deleteProduct(id){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.delete(`${this.url}api/products/${id}`,  { headers: headers}).toPromise();
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
  boutiqueList(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/products`, { headers: headers}).toPromise();
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
  boutiquebyId(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/products/${id}`, { headers: headers}).toPromise();
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
  boutiquebyCategory(category:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/products/?category=${category}`, { headers: headers}).toPromise();
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