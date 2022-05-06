import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { NotifUser } from '../models/notif-user';
import { NotifUserService } from './notif-user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, 
              private notifUserService: NotifUserService) {
            this.angularFireMessaging.messages.subscribe(
              (_messaging: AngularFireMessaging) => {
              _messaging.onMessage = _messaging.onMessage.bind(_messaging);
              _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            })
  }
  requestPermission() {
    this.angularFireMessaging.requestToken
      .subscribe(
        (token) => { 
          this.notifUserService.notifUserList(token).then((data: NotifUser[])=>{
            if(data.length>0){
              const notif = data[0];
              if(notif.user ==""){
                notif.user = localStorage.getItem('userMail');
                this.notifUserService.updateNotifUser(notif).then((data: NotifUserService)=>{
                  
                }).catch((error) => {
                });
              }
        
            }else{
              const email = localStorage.getItem('userMail');
              const notifUser = new NotifUser(email, token);
              this.notifUserService.sendNotifUser(notifUser).then((data: NotifUserService)=>{
                // console.log(data);
              }).catch((error) => {
              });
            }
          }).catch((error) => {
          });
        
        },
        (error) => { console.error(error); },  
      );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
    (payload) => {
    // console.log("new message received. ", payload);
    this.currentMessage.next(payload);
    })
  }
}
