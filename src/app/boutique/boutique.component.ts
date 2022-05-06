import { Component, OnInit } from '@angular/core';
import { Boutique } from './../models/boutique';
import { BoutiqueService } from './../services/boutique.service';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent implements OnInit {
  p: number = 1;
  imgUrl = environment.imgUrl;
  email = localStorage.getItem('userMail');
  boutiques: Boutique[];
  images;
  close;
  closeResult = '';
  categories: Category[];
  constructor(
    private boutiqueService: BoutiqueService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.boutiqueService.boutiqueList().then((data:Boutique[]) => {
      this.boutiques = data.filter((e) => e.isValid === true);
    }).catch((error) =>{
    });
    this.categoryService.categoryList().then((data: Category[]) => {
      this.categories = data;
    }).catch((error) => {
      console.log(error);
    });
  }

}
