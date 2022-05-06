import { Component, OnInit } from '@angular/core';
import { Boutique } from './../models/boutique';
import { BoutiqueService } from './../services/boutique.service';
import { Annonce } from './../models/annonce';
import { AnnonceService} from './../services/annonce.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css']
})
export class AnnoncesComponent implements OnInit {
  email = localStorage.getItem('userMail');
  p: number = 1;
  imgUrl = environment.imgUrl;
  annonces: Annonce[];
  images;
  close;
  closeResult = '';
  constructor(
    private annonceService: AnnonceService,
  ) { }

  ngOnInit(): void {
    this.annonceService.getAllAnnonce().then((data:Annonce[]) => {
      this.annonces  = data.filter((e) => e.isValid == true);
    }).catch((error) =>{
    });
  }

}


