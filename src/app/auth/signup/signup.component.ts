import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Users} from '../../models/users';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CustomValidators } from './custom-validators';
// import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { trigger } from '@angular/animations';
import * as L from 'leaflet';
import { Metier} from '../../models/metier';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { HttpClient, HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignupComponent implements OnInit {
  separateDialCode = true;
  fieldTextType: boolean;
  fieldTextType1: boolean;
  // TooltipLabel = TooltipLabel;
  onlycountries;
  latitude: number;
  longitude: number;
  zoom:number;
  address: string;
  private geoCoder;
  isProfession= false;
  phoneError = false;
  countrCode ='tg';
  dialCode = '228';
  newMarker;
  valid = Validators.nullValidator;
  // this.valid =Validators.required;
  return: '';
  listMetier: Metier[] = [
    {value: 'peintre-en-batiment', viewValue: 'Peintre en bâtiment'},
    // {value: 'tailleur', viewValue: 'Tailleur'},
    {value: 'peintre-en-decors', viewValue: 'Peintre en décors'},
    {value: 'carreleur', viewValue: 'Carreleur'},
    {value: 'macon', viewValue: 'Maçon'},
    {value: 'plombier', viewValue: 'Plombier'},
    {value: 'tapissier', viewValue: 'Tapissier'},
    // {value: 'coiffeur-euse', viewValue: 'Coiffeur-euse'},
    {value: 'estheticienne', viewValue: 'Esthéticienne'},
    {value: 'fleuriste', viewValue: 'Fleuriste'},
    {value: 'cordonnier', viewValue: 'Cordonnier'},
    {value: 'sculpteur', viewValue: 'Sculpteur'},
    {value: 'ferrailleur', viewValue: 'Ferrailleur'},
    {value: 'mecanicien', viewValue: 'Mécanicien'},
    {value: 'menuisier', viewValue: 'Menuisier'},
    {value: 'ceramiste', viewValue: 'Céramiste'},
    {value: 'artiste-peintre', viewValue: 'Artiste peintre'},
    {value: 'ferronnier', viewValue: 'Ferronnier'},
    {value: 'maroquinier', viewValue: 'Maroquinier'},
    {value: 'serrurier', viewValue: 'Serrurier'},
    {value: 'vulcaniser', viewValue: 'Vulcaniser'},
    {value: 'menuisier-alu', viewValue: 'Menuisier Alu'},
    {value: 'staffeur', viewValue: 'Staffeur'},
    {value: 'soudeur', viewValue: 'Soudeur'},
    {value: 'accessoriste', viewValue: 'Accessoriste'},
    {value: 'electricien', viewValue: 'Electricien'},
    {value: 'coffreur', viewValue: 'Coffreur'},
    {value: 'coiffeur', viewValue: 'Coiffeur'},
    {value: 'frigoriste', viewValue: 'Frigoriste'},
  ];

  firstFormGroup : FormGroup;
  signupForm: FormGroup;
  errorMessage: string;
  submitted = false;

  layersControl;
  options1;
  layers;
  map;
  getCoordinate = false;
  displayAdresse = false;
  adresseByLoc : any[];
  markers: L.Layer[] = [];

  popupText = "Some popup text";
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
    })
  };

  options = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      })
    ],
    zoom: 14,
    center: L.latLng(6.133650, 1.223110)
  };

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private httpClient: HttpClient,
              private ngZone: NgZone) {
                this.route.queryParams.subscribe(params => this.return = params['return']|| '/dashboard/profil')
              }

  ngOnInit() {


    this.initForm();

    this.setCurrentLocation();

  }

  initForm() {
    this.firstFormGroup = this.formBuilder.group({
      profession: [''],
    });
    this.signupForm = this.formBuilder.group({
      // email: ['', [Validators.required, Validators.email]],
      surname: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{3,}/)]],
      telephone: ['', [Validators.required,Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      adresse: ['', [Validators.pattern(/[0-9a-zA-Z]{3,}/)]],
      profession: ['', [this.valid]],
      userType: ['', [Validators.required]],
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
          Validators.minLength(6)
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
    this.submitted = true;
    if (this.signupForm.valid) {
      const password = this.signupForm.get('password').value;
      const phone = this.signupForm.get('telephone').value;
      const telephone = `+${this.dialCode}${phone}`;
      const email = `iyatg${this.dialCode}${phone}@iyatg.com`;
      const formValue = this.signupForm.value;
      const newUser = new Users(
        email,
        formValue['password'],
        email,
        formValue['surname'],
        formValue['surname'],
        telephone,
        formValue['userType'],
        formValue['adresse'],
        ''+this.longitude,
        ''+this.latitude,
        formValue['profession'],
        this.countrCode,
        false,
      );
      this.authService.createNewUser(newUser).then((data)=>{
        this.openSnackBar("Inscription réussie", email)
        this.authService.signInUser(email, formValue['password']).then((data) => {
          this.openSnackBar('Connexion réussie', email);
          this.router.navigateByUrl(this.return);
        }).catch((error) =>{
          this.openSnackBar('erreur lors de la connexion', 'Vérifier vos identifiants');
        });
      }).catch((error) =>{
        this.openSnackBar('Echec lors de l\'inscription', email)
      });
    }

  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.addMarker(this.latitude, this.longitude);
        this.getCoordinate = true;
        // this.getAddress(this.latitude, this.longitude);
      }, (error) => {
        console.log(error);
        this.latitude = 6.133650;
        this.longitude = 1.223110;
        this.zoom = 6;
        this.addMarker(this.latitude, this.longitude);
        // this.getAddress(this.latitude, this.longitude);
      })
    }else{
      this.latitude = 6.133650;
      this.longitude = 1.223110;
      this.zoom = 6;

      this.addMarker(this.latitude, this.longitude);
  }
   
  }

  displayProfession(event){
    console.log(event);
    if (event === 'artisan') {
        this.isProfession = true;
        this.valid = Validators.required;
        this.firstFormGroup.controls['profession'].setValidators([Validators.required]);  
        this.firstFormGroup.controls['profession'].updateValueAndValidity();
        this.signupForm.controls['profession'].setValidators([Validators.required]);  
        this.signupForm.controls['profession'].updateValueAndValidity();

    }else{
      this.isProfession = false;
      this.valid = Validators.nullValidator;
      this.firstFormGroup.controls['profession'].clearValidators(); 
      this.firstFormGroup.controls['profession'].updateValueAndValidity();
      this.signupForm.controls['profession'].clearValidators(); 
      this.signupForm.controls['profession'].updateValueAndValidity();
    }
  }
  getProfession(event){
    console.log(event);
    if (event.value) {
      this.valid = Validators.nullValidator;
      this.firstFormGroup.controls['profession'].clearValidators(); 
      this.firstFormGroup.controls['profession'].updateValueAndValidity();
      this.signupForm.controls['profession'].clearValidators(); 
      this.signupForm.controls['profession'].updateValueAndValidity();

    }else{
      this.isProfession = true;
        this.valid = Validators.required;
        this.firstFormGroup.controls['profession'].setValidators([Validators.required]);  
        this.firstFormGroup.controls['profession'].updateValueAndValidity();
        this.signupForm.controls['profession'].setValidators([Validators.required]);  
        this.signupForm.controls['profession'].updateValueAndValidity();
    }
  }
  hasError(event){
    if(event){
      this.phoneError = false;
    }else{
      this.phoneError = true;
    }

  }
  getNumber(event){
  }
  telInputObject(event){
  }
  onCountryChange(event){
    this.countrCode = event.iso2;
    this.dialCode = event.dialCode;
  }
  addMarker(lat, lng) {
    this.newMarker = L.marker([lat, lng], this.markerIcon);
    this.markers.push(this.newMarker);

    this.newMarker.addTo(this.map);
    this.map.panTo(new L.LatLng(lat, lng));
  }
  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
    this.map.on("click", e => {
      this.map.removeLayer(this.newMarker);
      this.longitude =  e.latlng.lng;
      this.latitude = e.latlng.lat;
      this.newMarker = L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon);
      this.newMarker.addTo(this.map); // add the marker onclick
    })
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
  changeCoordinate(event){
    this.httpClient.get(`https://nominatim.openstreetmap.org/search?format=json&q='${event.target.value} togo`)
    .subscribe(
      (data: any[]) => {
        this.displayAdresse = true;
        this.adresseByLoc = data;
        console.log(data);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );;
  }
  changeCoordinates(lng, lat){
    this.latitude = lat;
    this.longitude = lng;
    this.zoom = 8;
    this.addMarker(this.latitude, this.longitude);
    this.displayAdresse = false;
  }
}
