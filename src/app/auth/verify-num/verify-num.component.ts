import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-verify-num',
  templateUrl: './verify-num.component.html',
  styleUrls: ['./verify-num.component.css']
})
export class VerifyNumComponent implements OnInit {

  verifyForm: FormGroup;
  errorCode= false;
  return: '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {
              }

  ngOnInit() {
    this.initForm();
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/dashboard/profil');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  initForm() {
    this.verifyForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/[0-9]{5,}/)]],
    });
  }

  onSubmit() {
    const code = this.verifyForm.get('code').value;
    this.authService.verifyCode(code).then((data) => {
      // this.router.navigate(['/dashboard/profil']);
      this.router.navigateByUrl(this.return);
    }).catch((error) =>{
      this.errorCode = true;
    });
  }


}
