import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SearchService } from './../services/search.service';
// @ts-ignore
// import {} from 'googlemaps';
import * as L from 'leaflet';
import { Boutique } from './../models/boutique';
import { BoutiqueService } from './../services/boutique.service';
import { environment } from './../../environments/environment';
import { Metier} from './../models/metier';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  imgUrl = environment.imgUrl;
  public model: any;
  search = false;
  search1 = false;
  latitude: number;
  longitude: number;
  zoom: number;
  boutiques: Boutique[];
  myControl = new FormControl();
  options: string[];
  searchValue;
  markers;
  opacity = 1;
  email = localStorage.getItem('userMail');
  latitudePointer = 6.487002064132895;
  longitudePointe = -0.9845065511959392;
  // iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  iconUrl = 'assets/img/icone46.png'
  filteredOptions: Observable<string[]>;
  filteredArtisans: Observable<Metier[]>;
  layersControl;
  options1;
  layers;
  map;
  markers1: L.Layer[] = [];
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
  ];
  isSecteur = false;
  searchArtisanBySecteur = false;

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
  markerIcon2 = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'assets/img/icone41.png',
      shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
    })
  };

  options2 = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      })
    ],
    zoom: 12,
    center: L.latLng(6.133650, 1.223110)
  };
  @ViewChild('search')
  public searchElementRef: ElementRef;


  // @ViewChild('myLoader') divView: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              private snackBar: MatSnackBar,
              private boutiqueService: BoutiqueService,
              private searchService: SearchService) { }


  ngOnInit() {
    this.boutiqueService.boutiqueList().then((data:Boutique[]) => {
      this.boutiques = data.filter((e) => e.isValid === true);
    }).catch((error) =>{
    });
    // this.searchService.getProfession().then((data: string[]) => {
    //   this.options = data;
    //   this.filteredOptions = this.myControl.valueChanges.pipe(
    //     startWith(''),
    //     map(value => this._filter(value.value))
    //   );
    // }).catch((error) => {
    // });
    this.filteredArtisans = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  };
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  private _filter(value: string): Metier[] {
    const filterValue = value.toLowerCase();

    return this.listMetier.filter(option => option.value.toLowerCase().indexOf(filterValue) === 0);
  }
  ngAfterViewInit(){
      this.initMap();
  }

    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 15;
          this.addMarker(this.latitude, this.longitude);
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
        this.zoom = 8;
        this.addMarker(this.latitude, this.longitude);
    }
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
    doSomething(event){
      this.searchValue = event;
      this.searchArtisan();
    }
    searchArtisan(){
      this.search = true;
      this.searchService.getSearch(this.searchValue).then((data : string[]) => {
        this.markers = data;
        this.addMarker2(data);
        this.setCurrentLocation();
      }).catch((error) =>{
      });
      //.router.navigate(['/dashboard/demande'])
    }
    selectMarker(event, emailArt, profession){
      this.router.navigate(['/dashboard/demande', emailArt, profession]);
    }
    getDemande(){
      this.openSnackBar("Connectez-vous ou créer un compte pour qu'on puisse suivre votre", "requête")
      this.router.navigate(['/dashboard/demande'])
    }
    onArtisanSelect(artisan: string){
      this.search1 = true;
      this.isSecteur = true;
      this.searchArtisanBySecteur = true;
      this.searchService.getSearch(artisan).then((data : string[]) => {
        this.markers = data;
        this.addMarker2(data);
        this.setCurrentLocation();
      }).catch((error) =>{
      });
    }
    private initMap(): void {
      this.map = L.map('map', {
        center: [ 39.8282, -98.5795 ],
        zoom: 3
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
      L.marker([51.5, -0.09]).addTo(this.map)
          .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
          .openPopup();
    }
    selectLayer(){
    }
    addMarker(lat, lng) {

      const newMarker = L.marker([lat, lng], this.markerIcon).bindPopup('Moi').on('dblclick', this.selectLayer);
      this.markers1.push(newMarker);

      newMarker.addTo(this.map);
      this.map.panTo(new L.LatLng(lat, lng));
    }
    addMarker2(data : any[]) {

      for (let marker of data){
        let markerIcon2 = {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [10, 41],
            popupAnchor: [2, -40],
            // specify the path here
            iconUrl: 'assets/img/icones/'+marker.profession+'.png',
            shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
          })
        };
        const newMarker = L.marker([marker.latitude, marker.longitude], markerIcon2).bindPopup(`${marker.firstname}<br/>
        ${marker.adresse}<br/>
        Note clients: 7/10<br/>
        
        `);
        newMarker.on('mouseover', function (e) {
          this.openPopup();
        });
        newMarker.on('mouseout', function (e) {
            this.closePopup();
        });
        newMarker.on('click', (e) =>{
          // this.router.navigate(['dashboard', 'demande', marker.email, marker.profession]);
          // this.router.navigateByUrl(`/dashboard/demande/${marker.email}/${marker.profession}`);
          window.location.href = `/dashboard/demande/${marker.email}/${marker.profession}`;
        });
        this.markers1.push(newMarker);

        newMarker.addTo(this.map);
        this.map.panTo(new L.LatLng(marker.latitude, marker.longitude));
      }

    }
    onMapReady(map: L.Map) {
      this.map = map;
      // Do stuff with map
    }
    goExternal(){
      window.location.href = 'https://play.google.com/store/apps/details?id=com.iyatg.pro';
    }
    closeMap(){
      console.log("log");
      this.search = false;
    }
    closeMap1(){
      console.log("log");
      this.search1 = false;
    }
}
