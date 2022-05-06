import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';
import { pairwise, filter} from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import {MatSnackBar} from '@angular/material/snack-bar';
// import {filter} from 'rxjs/add/operator/filter';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [MatSnackBar]
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  errorMessage: string;
  return: '';
  fieldTextType: boolean;
  
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private location: Location,
              public toastService: ToastService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {

              }

  ngOnInit() {
    this.initForm();
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/dashboard');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[0-9]{8,}/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const em = this.signinForm.get('email').value;
    let num;
    if(em.substring(0, 1)=="+"){
      num = em.substring(1, em.length);
    }else if(em.substring(0, 2)=="00"){
      num = em.substring(2, em.length);
    }else{
      num =em;
    }
    const email = `iyatg${num}@iyatg.com`;
    // const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    this.authService.signInUser(email, password).then((data) => {
      this.openSnackBar('Connexion réussie', 'ok');
      this.toastService.show('Utilisateur créer avec succès', { classname: 'bg-success text-light', delay: 15000 });
      this.router.navigateByUrl(this.return);
    }).catch((error) =>{
      this.openSnackBar('erreur lors de la connexion', 'Vérifiez vos identifiants');
    });
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


}
