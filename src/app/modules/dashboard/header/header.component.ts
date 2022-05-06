import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { Users } from './../../../models/users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ema = localStorage.getItem('userMail');
  em = localStorage.getItem('userMail').match(/(\d+)/);
  email = this.em[0];
  profils: Users;
  fullname: string;

  constructor(private authService: AuthService) {
   }

  ngOnInit(): void {
    this.authService.profilUser(this.ema).then((data: Users) => {
      this.profils = data[0];
        this.fullname = this.profils.firstname;
    }).catch((error) =>{
    });
  }

}
