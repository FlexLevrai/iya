import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AnnonceService } from './../../../../services/annonce.service';
import { Annonce } from './../../../../models/annonce';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from './../../../../services/demande.service';
import { SearchService } from './../../../../services/search.service';
import { environment } from './../../../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';

@Component({
  selector: 'app-annonce-update',
  templateUrl: './annonce-update.component.html',
  styleUrls: ['./annonce-update.component.css']
})
export class AnnonceUpdateComponent implements OnInit {

  latitude: number;
  longitude: number;
  zoom:number;
  address: string;
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
  images: GalleryItem[];
  sendStatus = false;
  annonceForm: FormGroup;
  @ViewChild("labelImport", {static: false}) labelImport: ElementRef;
  artisanEmail;
  metier;
  formdata = new FormData();
  fileToUpload: File = null;
  lego;
  fileIsUploading = false;
  fileUrl: string;
  url;
  annonces;
  addAgain = false;
  notAdd = false;
  preUrl;
  fileUploaded = false;
  errorFile: boolean;
  email = localStorage.getItem('userMail');
  demandForm: FormGroup;
  userImage = [];
  artisans: any[];
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  artisan;
  closeResult = '';
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
  annonce: Annonce;
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private searchService: SearchService,
              private demandeService: DemandeService,
              private modalService: NgbModal,
              private router: Router,
              private annonceService: AnnonceService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.initForm();
    this.setCurrentLocation();
    this.annonces = this.annonceService.annonces;
    if(this.annonces){
      const bout = this.annonces.filter((e) => e.id == id);
      this.annonce = bout[0];
      this.annonceForm.get('title').setValue(this.annonce.title);
      this.annonceForm.get('description').setValue(this.annonce.description);
      this.annonceForm.get('adresse').setValue(this.annonce.adresse);
      this.annonceForm.get('nombre').setValue(this.annonce.nombre);
    }else{
      this.annonceService.annoncebyId(id).then((data:Annonce) => {
        this.annonce = data;
        this.annonceForm.get('title').setValue(this.annonce.title);
        this.annonceForm.get('description').setValue(this.annonce.description);
        this.annonceForm.get('adresse').setValue(this.annonce.adresse);
        this.annonceForm.get('nombre').setValue(this.annonce.nombre);
      }).catch((error) => {
      });
    }
    this.searchService.getProfession().then((data: any[]) => {
      this.artisans = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }).catch((error) => {
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.artisans.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  doSomething(event){
    this.artisan = event;
  }
  initForm() {
    this.annonceForm = this.formBuilder.group({
      title: [''],
      description: ['', [Validators.required]],
      nombre: [''],
      // categorie: ['', [Validators.required]],
      adresse: [''],
    });
  }
  onSubmit() {
    this.annonce.description = this.annonceForm.get('description').value;
    this.annonce.title =  this.annonceForm.get('title').value;
    this.annonce.nombre =  this.annonceForm.get('nombre').value;
    this.annonce.adresse =  this.annonceForm.get('adresse').value;
    // const productId =  this.annonceForm.get('productId').value;
    const imagePath =  this.userImage.join();
    this.annonce.images =  imagePath ? imagePath : this.annonce.images;
    this.annonce.categorie =  this.artisan ? this.artisan : this.annonce.categorie;
    // const annonce = new Annonce(title, description, imagePath, this.artisan, nombre, this.email, adresse, `${this.longitude}`, `${this.latitude}`, false);
    this.annonceService.updateAnnonce(this.annonce).then((data: Annonce) => {
      this.sendStatus = true;
      this.annonces.push(data);
    }).catch((error) =>{
    });
  }
  onUploadFile(file: File) {
    this.fileIsUploading = true;
    const formData = new FormData();
    formData.append('file', file);
    this.demandeService.UploadFile(formData).then((response: any) => {
      this.fileUrl = response.message;
      this.userImage.push(response.contentUrl);
      this.fileIsUploading = false;
      this.fileUploaded = true;
      if(this.userImage.length < 3){
        this.addAgain = true;
        this.url = '';
        this.labelImport.nativeElement.innerText = 'Choisissez un fichier...';
      }else{
        this.addAgain = false;
        this.notAdd = true;
      }
      setTimeout(e =>{ this.fileUploaded = false; }, 2000);
    }).catch((error) => {
    });
  }
  fileValidate(file: File) {
    let back = false;
    let result = false;
    this.lego = file;
    let  allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
    let img = file.type.split('/');
    let imgType = img[1].toLowerCase();
    if(allowedTypes.indexOf(imgType) != -1) {
        back =true;
    }else{
      this.errorFile = true;
      back= false;
      return false;
    }
    if(back){
      const reader = new FileReader();
      const image = new Image();
      const e = () => {
        this.preUrl = reader.result;
        image.src = this.preUrl;
        image.onload = ()=>{
         const imgwidth = image.width;
         const imgheight = image.height;
         if (imgwidth > 100 && imgheight > 100) {
            this.errorFile = false;
            this.url = reader.result;
            this.labelImport.nativeElement.innerText = this.lego.name;
            this.fileToUpload = this.lego;
            this.onUploadFile(this.lego);
            } else {
            this.errorFile = true;
          }
        }
      };
      reader.addEventListener('load', e, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
  detectFiles(event) {
    let files = event.target.files[0];
    this.fileValidate(files);
  }
  addNew() {
    this.initForm();
    this.sendStatus = false;
  }
  onUpdate(id:number){
    const bout = this.annonces.filter((e) => e.id === id);
    const annonce =bout[0];
    this.annonceService.annonces = this.annonces;
    this.router.navigate(['/dashboard', 'annonces', 'update',  id ]);
  }
  onDelete(id:number){
    let ok = confirm("Etes-vous sûr de supprimer ce chantier?");
    if(ok){
      this.annonceService.deleteAnnonce(id).then((data) => {
        let ind = this.annonces.findIndex(i => i.id === id);
        this.annonces.splice(ind, 1);
        alert("Action effectuée");
      }).catch((error) =>{
      });
    }
    
  }
  deleteImgTab(id){
    this.userImage.splice(id, 1);
  }
  open(content, id) {
    this.images = [];
    const demde = this.annonces.filter(e => e.id == id);
    const img = demde[0].images;
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
    this.newMarker = L.marker([lat, lng], this.markerIcon);
    this.markers.push(this.newMarker);

    this.newMarker.addTo(this.map);
    this.map.panTo(new L.LatLng(lat, lng));
  }
  onBack() {
    this.router.navigate(['/dashboard', 'annonces']);
  }

}
