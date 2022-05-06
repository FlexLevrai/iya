import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Boutique } from './../models/boutique';
import { BoutiqueService } from './../services/boutique.service';
import { Commande } from './../models/commande';
import { CommandeService } from './../services/commande.service';
import { environment } from './../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';


@Component({
  selector: 'app-boutique-commande',
  templateUrl: './boutique-commande.component.html',
  styleUrls: ['./boutique-commande.component.css']
})
export class BoutiqueCommandeComponent implements OnInit {
  latitude: number;
  longitude: number;
  zoom:number;
  address: string;
  // isProfession= false;
  phoneError = false;
  countrCode ='tg';
  dialCode = '228';
  imgUrl = environment.imgUrl;
  email = localStorage.getItem('userMail');
  product: Boutique;
  images;
  close;
  closeResult = '';
  commandeForm: FormGroup;
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
  sendStatus = false;
  markersLayer;
  onMapReady(map: L.Map) {
    this.map = map;
    this.map.on("click", e => {
      this.map.removeLayer(this.newMarker);
      this.longitude =  e.latlng.lng;
      this.latitude = e.latlng.lat;
      this.newMarker = L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon);
      this.newMarker.addTo(this.map); // add the marker onclick
    });
    // this.markersLayer = L.featureGroup().addTo(map);
    // Do stuff with map
  }
  id;
  newMarker;

  constructor(
    private boutiqueService: BoutiqueService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setCurrentLocation();
    this.id = this.route.snapshot.params['id'];

    this.boutiqueService.boutiquebyId(this.id).then((data:Boutique) => {
      this.product = data;
      this.images = [];
      const img = this.product.images;
      if(img){
        const imgs = img.split(',');
        for (const imge of imgs) {
          this.images.push(new ImageItem({ src: `${this.imgUrl}${imge}`, thumb: `${this.imgUrl}${imge}` }))
        }
      }else{
        this.images = [
          new ImageItem({ src: 'assets/img/iyalogo1.png', thumb: 'assets/img/iyalogo1.png' })
        ];
      }
    }).catch((error) => {
    });
  }
  initForm() {
    this.commandeForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
    },);
  }
  onSubmit(){
    const phone = this.commandeForm.get('telephone').value;
    const fullname = this.commandeForm.get('fullname').value;
    const nombre = this.commandeForm.get('nombre').value;
    const adresse = this.commandeForm.get('adresse').value;
    const telephone = `+${this.dialCode}${phone}`;
    const commande = new Commande(`${nombre}`, fullname, this.product.productId, `/api/products/${this.id}`, adresse, telephone, `${this.longitude}`, `${this.latitude}`, false);
    this.commandeService.sendCommande(commande).then((data) => {
      this.sendStatus = true;
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
    this.newMarker = L.marker([lat, lng], this.markerIcon);
    this.markers.push(this.newMarker);

    this.newMarker.addTo(this.map);
    this.map.panTo(new L.LatLng(lat, lng));
  }
  onBack(){
    this.router.navigate(['boutique']);
  }
  onAccueil(){
    this.router.navigate(['']);
  }
  // onMapClick(e) {
  //   alert("You clicked the map at " + e);
  // }
}
