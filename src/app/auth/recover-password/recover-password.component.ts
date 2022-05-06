import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  recoverForm: FormGroup;
  errorMessage: string;
  return: '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              public toastService: ToastService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {

              }

  ngOnInit() {
    this.initForm();
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/auth/signin');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  initForm() {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[0-9]{8,}/)]],
    });
  }

  onSubmit() {
    const em = this.recoverForm.get('email').value;
    let num;
    if(em.substring(0, 1)=="+"){
      num = em.substring(1, em.length);
    }else if(em.substring(0, 2)=="00"){
      num = em.substring(2, em.length);
    }else{
      num =em;
    }
    const email = `iyatg${num}@iyatg.com`;
    this.authService.recoverPasswordUser(email).then((data) => {
      this.openSnackBar('Vous recevrez un message de confirmation', 'ok');
      this.toastService.show('Demande envoyée. Vérifiée dans votre boîte email', { classname: 'bg-success text-light', delay: 15000 });
      this.router.navigate(['/auth/verify-code']);
    }).catch((error) =>{
      this.openSnackBar('erreur sur le serveur', 'OK');
      console.log(error);
    });
  }

}
