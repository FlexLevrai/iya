import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Users} from '../../models/users';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CustomValidators } from './../signup/custom-validators';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  valid = Validators.nullValidator;
  // this.valid =Validators.required;
  return: '';
  token;

  resetForm: FormGroup;
  errorMessage: string;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar
              ) {
                this.route.queryParams.subscribe(params => this.return = params['return']|| '/dashboard')
              }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.initForm();
  }

  initForm() {
    this.resetForm = this.formBuilder.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          // CustomValidators.patternValidator(
          //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          //   {
          //     hasSpecialCharacters: true
          //   }
          // ),
          Validators.minLength(8)
        ])
      ],
      confirmPassword: [null, Validators.compose([Validators.required])]
    },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  onSubmit() {

    const password = this.resetForm.get('password').value;

    this.authService.resetPasswordUser(password, this.token).then((data)=>{
      this.openSnackBar('Mot de passe redéfini ', 'ok');
      this.router.navigate(['/auth/signin']);
    }).catch((error) =>{
      this.openSnackBar('Echec lors de la réinitialisation', 'ok');
    });
  }

}
