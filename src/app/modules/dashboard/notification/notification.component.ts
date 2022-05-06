import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {


  sendStatus = false;
  notifications: Notification[];
  notificationForm: FormGroup;
  constructor(private notificationService: NotificationService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.notificationService.notifList().then((data: Notification[]) => {
      this.notifications = data;
    }).catch((error) => {
      console.log(error);
    });
  }
  initForm() {
    this.notificationForm = this.formBuilder.group({
      libele: ['', [Validators.required]],
      description: [''],
    });
  }
  onSubmit() {
    const libele = this.notificationForm.get('libele').value;
    const description = this.notificationForm.get('description').value;
    const notif = new Notification(libele, description);
    this.notificationService.sendNotif(notif).then((data: Notification) => {
      this.sendStatus = true;
      this.notifications.push(data);
      console.log(data);
    }).catch((error) =>{
      console.log(error);
    });
  }
  addAgain() {
    this.sendStatus = false;
  }
}
