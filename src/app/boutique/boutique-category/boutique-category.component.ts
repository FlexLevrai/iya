import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Boutique } from './../../models/boutique';
import { BoutiqueService } from './../../services/boutique.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-boutique-category',
  templateUrl: './boutique-category.component.html',
  styleUrls: ['./boutique-category.component.css']
})
export class BoutiqueCategoryComponent implements OnInit {

  imgUrl = environment.imgUrl;
  email = localStorage.getItem('userMail');
  boutiques: Boutique[];
  images;
  close;
  closeResult = '';
  category;
  p: number = 1;
  constructor(
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.category = this.route.snapshot.params['category'];
    
    this.boutiqueService.boutiquebyCategory(this.category).then((data:Boutique[]) => {
      this.boutiques = data.filter((e) => e.isValid === true);
      console.log(this.boutiques);
    }).catch((error) =>{
    });
  }

}
