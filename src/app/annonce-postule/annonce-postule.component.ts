import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Annonce } from './../models/annonce';
import { AnnonceService } from './../services/annonce.service';
import { Postulation } from './../models/postulation';
import { PostulationService } from './../services/postulation.service';
import { environment } from './../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';

@Component({
  selector: 'app-annonce-postule',
  templateUrl: './annonce-postule.component.html',
  styleUrls: ['./annonce-postule.component.css']
})
export class AnnoncePostuleComponent implements OnInit {
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
  product: Annonce;
  images;
  close;
  closeResult = '';
  postuleForm: FormGroup;
  id;
  sendStatus = false;

  constructor(
    private annonceService: AnnonceService,
    private postulationService: PostulationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.id = this.route.snapshot.params['id'];

    this.annonceService.annoncebyId(this.id).then((data:Annonce) => {
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
    this.postuleForm = this.formBuilder.group({
      motivation: ['', [Validators.required]],
    },);
  }
  onSubmit(){
    const motiv = this.postuleForm.get('motivation').value;
    const postulation = new Postulation(this.product.promoteur, motiv, this.email , `/api/chantiers/${this.id}`, false);
    this.postulationService.sendPostulation(postulation).then((data) => {
      this.sendStatus = true;
    }).catch((error) =>{
    });

  }
  
  onBack(){
    this.router.navigate(['annonces', this.id]);
  }
  // onMapClick(e) {
  //   alert("You clicked the map at " + e);
  // }
}
