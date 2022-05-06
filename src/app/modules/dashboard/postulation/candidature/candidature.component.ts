import { Component, OnInit } from '@angular/core';
import { Postulation } from './../../../../models/postulation';
import { PostulationService } from './../../../../services/postulation.service';
import { Annonce } from './../../../../models/annonce';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidature',
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.css']
})
export class CandidatureComponent implements OnInit {

  postulations: Postulation[];
  postulation: Postulation;
  annonce: Annonce;
  email = localStorage.getItem('userMail');
  id;
  constructor(
      private postulationService: PostulationService,
      private snackBar: MatSnackBar,
    ) {
  
    }
  
  
    ngOnInit() {
      
    this.postulationService.postulationPostulant(this.email).then((data: Postulation[]) => {
        // const trt = data.filter((val)=> val.promoteur === this.email);
        this.postulations  = data;
      }).catch((error) => {
      });
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
  
  }
  
