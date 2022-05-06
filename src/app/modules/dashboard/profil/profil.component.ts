import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { Users } from './../../../models/users';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  email = localStorage.getItem('userMail');
  profils: Users;
  msg = false;
  phoneError = false;
  countrCode ='tg';
  dialCode = '228';
  telephone;
  nom;
  prenom;
  showName = true;
  latitude: number;
  longitude: number;
  zoom:number;
  layersControl;
  options1;
  layers;
  map;
  markers: L.Layer[] = [];
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
  option = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      })
    ],
    zoom: 14,
    center: L.latLng(6.133650, 1.223110)
  };
  markersLayer;
  onMapReady(map: L.Map) {
    this.map = map;
    this.map.on("click", e => {
      if(confirm("Voulez-vous vraiment changer votre position?")){
      this.map.removeLayer(this.newMarker);
      this.longitude =  e.latlng.lng;
      this.latitude = e.latlng.lat;
      this.newMarker = L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon);
      this.newMarker.addTo(this.map); // add the marker onclick
      
        this.authService.updateUser(this.profils).then((data: Users) => {
        
        }).catch((error) =>{
        });
      }
    });
  }
  id;
  newMarker;
  
  
  constructor(private authService: AuthService,
              private router : Router) { 
                
              }

  ngOnInit(): void {
    this.authService.profilUser(this.email).then((data: Users) => {
      this.profils = data[0];
      const em = this.profils.email.match(/(\d+)/);
        this.telephone = em[0];
        const fullname = this.profils.firstname.split(" ");;
        if(fullname.length>0){
          this.nom = fullname[0];
          this.prenom = fullname[1];
        }else{
          this.nom = fullname;
          this.showName = false;
        }
      this.msg = true;
      
      this.latitude = Number(this.profils.latitude);
      this.longitude = Number(this.profils.longitude);
      this.zoom = 6;
      this.addMarker(this.latitude, this.longitude);
    }).catch((error) =>{
    });
  }
  onCheckNumber(){
    this.authService.verifyNumber(this.profils.email).then((data: Users) => {
      this.router.navigate(['/auth/verify']);
    }).catch((error) =>{
    });
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
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.addMarker(this.latitude, this.longitude);
        // this.getAddress(this.latitude, this.longitude);
      }, (error) => {
        this.latitude = 6.133650;
        this.longitude = 1.223110;
        this.zoom = 6;
        this.addMarker(this.latitude, this.longitude);
        // this.getAddress(this.latitude, this.longitude);
      });
    }else{
      this.latitude = 6.133650;
      this.longitude = 1.223110;
      this.zoom = 6;
      this.addMarker(this.latitude, this.longitude);
  }
}
  addMarker(lat, lng) {
    // const newMarker = L.marker([46.879966, -121.726909], this.markerIcon);
    this.newMarker = L.marker([lat, lng], this.markerIcon);
    this.markers.push(this.newMarker);

    this.newMarker.addTo(this.map);
    this.map.panTo(new L.LatLng(lat, lng));
  }
}
