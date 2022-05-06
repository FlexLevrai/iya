import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Blog} from '../models/blog';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  user = false;
  query;
  blog: Blog;
  blogs: Blog[];
  token = localStorage.getItem('userActive');
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  addBlog(blog: Blog){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.post(`${this.url}api/blogs`, blog, { headers: headers}).toPromise();
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
  updateBlog(blog: Blog){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.put(`${this.url}api/blogs/${blog.id}`, blog, { headers: headers}).toPromise();
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
  deleteBlog(id){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.delete(`${this.url}api/blogs/${id}`,  { headers: headers}).toPromise();
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
  blogList(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/blogs`, { headers: headers}).toPromise();
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
  blogbyId(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return new Promise(
      (resolve, reject) => {
        const promise = this.httpClient.get(`${this.url}api/blogs/${id}`, { headers: headers}).toPromise();
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
