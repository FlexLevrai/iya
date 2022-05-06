import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Users } from './../../models/users';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  email = localStorage.getItem('userMail');
  profils;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.profilUser(this.email).then((data: Users) => {
      this.profils = data[0];
      const admin = this.profils.roles.filter(element => element == 'ROLE_ADMIN');
      let role = 'user';
      if(admin.length > 0){
        role = 'admin';
      };
      localStorage.setItem('profession', this.profils.profession);
      localStorage.setItem('role', role);
        }).catch((error) =>{
        });
  }

  logout(){
    this.authService.signOutUser();
  }

}
