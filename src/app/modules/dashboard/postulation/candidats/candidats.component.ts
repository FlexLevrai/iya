import { Component, OnInit } from '@angular/core';
import { Postulation } from './../../../../models/postulation';
import { PostulationService } from './../../../../services/postulation.service';
import { Annonce } from './../../../../models/annonce';
import { AnnonceService } from './../../../../services/annonce.service';
import { Router, ActivatedRoute  } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})
export class CandidatsComponent implements OnInit {

  postulations: Postulation[];
  postulation: Postulation;
  annonce: Annonce;
  email = localStorage.getItem('userMail');
  id;
  constructor(
      private postulationService: PostulationService,
      private annonceService: AnnonceService,
      private router: Router,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar,
    ) {
  
    }
  
  
    ngOnInit() {
      this.id = this.route.snapshot.params['id'];

    this.annonceService.annoncebyId(this.id).then((data:Annonce) => {
      this.annonce  = data;
    }).catch((error) => {
    });
      this.postulationService.postulationPromoteurById(this.id).then((data: Postulation[]) => {
        const trt = data.filter((val)=> val.promoteur === this.email);
        this.postulations  = trt;
      }).catch((error) => {
      });
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
    onActivate(id: number) {
      const trt = this.postulations.filter((val)=> val.id === id);
      // this.commandeService. = rdv[0];
      this.postulation = trt[0];
      if(this.postulation.isOk){
        this.postulation.isOk = false;
      }else{
        this.postulation.isOk = true;
      }
      this.postulationService.updatePostulation(this.postulation).then((data: any) => {
        for (const element of this.postulations) {
          if(element.id == id){
            if(element.isOk){
              element.isOk= false;
            }else{
              element.isOk = true;
            }
          }
        }
        this.openSnackBar('Opération effectuée avec succèss', 'Ok');
      }).catch((error) =>{
        this.openSnackBar('erreur lors de l\'enregistrement', 'Essayer ultérieurement');
      });
    }
  
  }
  
