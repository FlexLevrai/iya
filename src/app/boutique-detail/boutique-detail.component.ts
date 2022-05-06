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
  selector: 'app-boutique-detail',
  templateUrl: './boutique-detail.component.html',
  styleUrls: ['./boutique-detail.component.css']
})
export class BoutiqueDetailComponent implements OnInit {
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
  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
  }
  id;
  constructor(
    private boutiqueService: BoutiqueService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
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
      // if(img){
      //   const imgs = img.split(',');
      //   console.log(imgs);
      //   for (const imge of imgs) {
      //     this.images.push(`${this.imgUrl}${imge}`);
      //   }
      // }else{
      //   this.images = [
      //     `${this.imgUrl}assets/img/iyalogo1.png`
      //   ];
      // }
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
    // console.log("error",event);
    if(event){
      this.phoneError = false;
    }else{
      this.phoneError = true;
    }

  }
  getNumber(event){
    // console.log(event);
  }
  telInputObject(event){
    // console.log(event);
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
  const newMarker = L.marker([lat, lng], this.markerIcon);
  this.markers.push(newMarker);

  newMarker.addTo(this.map);
  this.map.panTo(new L.LatLng(lat, lng));
}
onCommande(){
  this.router.navigate(['commande', this.id]);
}

}
