import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Commande} from '../models/commande';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  user = false;
  query;
  annonceDispo: string;
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient,
              private router: Router) { }

  sendCommande(commande: Commande){
  const headers = new HttpHeaders({
  'Content-Type': 'application/json'
  });
  return new Promise(
  (resolve, reject) => {
  const promise = this.httpClient.post(`${this.url}api/commandes`, commande, { headers: headers}).toPromise();
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
  updateCommande(commande: Commande){
  const headers = new HttpHeaders({
  'Content-Type': 'application/json'
  });
  return new Promise(
  (resolve, reject) => {
  const promise = this.httpClient.put(`${this.url}api/commandes/${commande.id}`, commande, { headers: headers}).toPromise();
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
  commandeList(telephone: string){
  const headers = new HttpHeaders({
  'Content-Type': 'application/json'
  });
  return new Promise(
  (resolve, reject) => {
  const promise = this.httpClient.get(`${this.url}api/commandes/?telephone=${telephone}`, { headers: headers}).toPromise();
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
getAllCommande(){
const headers = new HttpHeaders({
'Content-Type': 'application/json'
});
return new Promise(
(resolve, reject) => {
const promise = this.httpClient.get(`${this.url}api/commandes`, { headers: headers}).toPromise();
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
commandebyId(id: number){
const headers = new HttpHeaders({
'Content-Type': 'application/json'
});
return new Promise(
(resolve, reject) => {
const promise = this.httpClient.get(`${this.url}api/commandes/${id}`, { headers: headers}).toPromise();
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
mesCommandes(telephone: string){
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});
  return new Promise(
    (resolve, reject) => {
      const promise = this.httpClient.get(`${this.url}api/commandes?telephone=${telephone}`, { headers: headers}).toPromise();
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
