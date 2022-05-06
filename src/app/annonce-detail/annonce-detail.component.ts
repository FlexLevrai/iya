import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Annonce} from './../models/annonce';
import { AnnonceService } from './../services/annonce.service';
import { Commande } from './../models/commande';
import { CommandeService } from './../services/commande.service';
import { environment } from './../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';

@Component({
  selector: 'app-annonce-detail',
  templateUrl: './annonce-detail.component.html',
  styleUrls: ['./annonce-detail.component.css']
})
export class AnnonceDetailComponent implements OnInit {

  latitude;
  longitude;
  zoom:number;
  address: string;
  // isProfession= false;
  phoneError = false;
  countrCode ='tg';
  dialCode = '228';
  imgUrl = environment.imgUrl;
  email = localStorage.getItem('userMail');
  product: Annonce;
  images;
  close;
  closeResult = '';
  commandeForm: FormGroup;
  layersControl;
  options1;
  layers;
  map;
  markers: L.Layer[] = [];
  markers1: L.Layer[] = [];
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
  markerIcon2 = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'assets/img/house1.png',
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
  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
  }
  id;
  constructor(
    private annonceService: AnnonceService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.setCurrentLocation();
    this.id = this.route.snapshot.params['id'];

    this.annonceService.annoncebyId(this.id).then((data:Annonce) => {
      this.product = data;
      this.addMarker2(data);
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
      // console.log(error);
    });
  }
  initForm() {
    this.commandeForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
    },);
  }
  onSubmit(f){

  }
  open(content, id) {
    // this.images = [
    //   new ImageItem({ src: 'IMAGE_SRC_URL', thumb: 'IMAGE_THUMBNAIL_URL' }),
    //   // ... more items
    // ];
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
    //Togo tg 228
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
  const newMarker = L.marker([lat, lng], this.markerIcon);
  this.markers.push(newMarker);

  newMarker.addTo(this.map);
  this.map.panTo(new L.LatLng(lat, lng));
}
addMarker2(marker : any) {
  // const newMarker = L.marker([46.879966, -121.726909], this.markerIcon);
    const newMarker = L.marker([marker.latitude, marker.longitude], this.markerIcon2).bindPopup(`Coordonées du chantier`);
    this.markers1.push(newMarker);

    newMarker.addTo(this.map);
    this.map.panTo(new L.LatLng(marker.latitude, marker.longitude));
  }
onPostule(){
  this.router.navigate(['je-postule', this.id]);
}

}
