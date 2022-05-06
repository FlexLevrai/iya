import { Component, OnInit } from '@angular/core';
import { Commande } from './../../../../models/commande';
import { CommandeService } from './../../../../services/commande.service';
import { Router, ActivatedRoute  } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Boutique } from './../../../../models/boutique';
import { BoutiqueService } from './../../../../services/boutique.service';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-list-commande',
  templateUrl: './list-commande.component.html',
  styleUrls: ['./list-commande.component.css']
})
export class ListCommandeComponent implements OnInit {
  imgUrl = environment.imgUrl;
  commandes: Commande[];
  commande: Commande;
  images: GalleryItem[];
  boutiques;
  closeResult = '';
  constructor(
    private commandeService: CommandeService,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private boutiqueService: BoutiqueService
    ) {
  
    }
  
  
    ngOnInit() {
      this.commandeService.getAllCommande().then((data: Commande[]) => {
        this.commandes  = data;
        return  this.boutiqueService.boutiqueList();
      }).then((data:Boutique[]) => {
        this.boutiques = data;
      }).catch((error) =>{
      });
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
    onActivate(id: number) {
      const trt = this.commandes.filter((val)=> val.id === id);
      this.commande = trt[0];
      if(this.commande.isTreat){
        this.commande.isTreat = false;
      }else{
        this.commande.isTreat = true;
      }
      this.commandeService.updateCommande(this.commande).then((data: any) => {
        for (const element of this.commandes) {
          if(element.id == id){
            if(element.isTreat){
              element.isTreat= false;
            }else{
              element.isTreat = true;
            }
          }
        }
        this.openSnackBar('Opération effectuée avec succèss', 'Ok');
      }).catch((error) =>{
        this.openSnackBar('erreur lors de l\'enregistrement', 'Essayer ultérieurement');
      });
      // this.router.navigate(['/dashboard', 'patient','rendezvous','update',  id ]);
    }

    open(content, code) {
      this.images = [];
      const demde = this.boutiques.filter(e => e.productId == code);
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
  
  }
  