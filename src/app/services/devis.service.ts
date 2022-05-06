import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Devis } from './../models/devis';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  url: string = environment.apiUrl;
  devis: Devis[] = [];
  devisSubject = new Subject<Devis[]>();
  constructor(private httpClient: HttpClient) { }

  emitDevis() {
    this.devisSubject.next(this.devis);
  }

  createNewDevis(newDevis: Devis) {
    this.saveDevis(newDevis);
  }

  removeBook(devis: Devis) {
    const bookIndexToRemove = this.devis.findIndex(
      (bookEl) => {
        if (bookEl === devis) {
          return true;
        }
      }
    );
    this.devis.splice(bookIndexToRemove, 1);
    // this.saveDevis();
    this.emitDevis();
  }
  saveDevis(devis: Devis){
    console.log(devis);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/devis`, devis, { headers: headers}).toPromise();
        promise.then(
              (data: Devis) => {
                console.log(data);
                this.devis.push(data);
                this.emitDevis();
                resolve(data);
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
  }
  updateDevis(devis: Devis){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/devis/${devis.id}`, devis, { headers: headers}).toPromise();
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
  // deleteDevis(devis: Devis){
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  // });
  //   return new Promise(
  //     (resolve, reject) => {
  //       const promise = this.httpClient.delete(`${this.url}api/devis/${devis.id}`, devis, { headers: headers}).toPromise();
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
  devisList(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/devis/?proprietaire=${email}`, { headers: headers}).toPromise();
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
  devisById(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/devis/?demande=${id}`, { headers: headers}).toPromise();
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
