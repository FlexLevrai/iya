import { Component, OnInit } from '@angular/core';
import { Annonce } from './../../../../models/annonce';
import { AnnonceService } from './../../../../services/annonce.service';
import { Commande } from './../../../../models/commande';
import { CommandeService } from './../../../../services/commande.service';
import { Router, ActivatedRoute  } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from './../../../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-annonces',
  templateUrl: './list-annonces.component.html',
  styleUrls: ['./list-annonces.component.css']
})
export class ListAnnoncesComponent implements OnInit {

  annonces: Annonce[];
  annonce: Annonce;
  images: GalleryItem[];
  imgUrl = environment.imgUrl;
  closeResult = '';
  constructor(
        private annonceService: AnnonceService,
        private router: Router,
        private modalService: NgbModal,
        private snackBar: MatSnackBar,
    ) {
  
    }
  
  
    ngOnInit() {
      this.annonceService.getAllAnnonce().then((data: Annonce[]) => {
        this.annonces  = data;
      }).catch((error) => {
      });
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
    onActivate(id: number) {
      const trt = this.annonces.filter((val)=> val.id === id);
      // this.commandeService. = rdv[0];
      this.annonce = trt[0];
      if(this.annonce.isValid){
        this.annonce.isValid = false;
      }else{
        this.annonce.isValid = true;
      }
      this.annonceService.updateAnnonce(this.annonce).then((data: any) => {
        for (const element of this.annonces) {
          if(element.id == id){
            if(element.isValid){
              element.isValid= false;
            }else{
              element.isValid = true;
            }
          }
        }
        this.openSnackBar('Opération effectuée avec succèss', 'Ok');
      }).catch((error) =>{
        this.openSnackBar('erreur lors de l\'enregistrement', 'Essayer ultérieurement');
      });
      // this.router.navigate(['/dashboard', 'patient','rendezvous','update',  id ]);
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
  
  }
  