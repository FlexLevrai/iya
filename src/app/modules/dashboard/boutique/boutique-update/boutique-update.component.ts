import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Boutique } from './../../../../models/boutique';
import { Users } from './../../../../models/users';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { BoutiqueService } from './../../../../services/boutique.service';
import { DemandeService } from './../../../../services/demande.service';
import { SearchService } from './../../../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-boutique-update',
  templateUrl: './boutique-update.component.html',
  styleUrls: ['./boutique-update.component.css']
})
export class BoutiqueUpdateComponent implements OnInit {
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
  sendStatus = false;
  boutiqueForm: FormGroup;
  categories: Category[];
  @ViewChild("labelImport", {static: false}) labelImport: ElementRef;
  artisanEmail;
  metier;
  formdata = new FormData();
  fileToUpload: File = null;
  lego;
  fileIsUploading = false;
  fileUrl: string;
  url;
  boutiques;
  product: Boutique;
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
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private searchService: SearchService,
              private demandeService: DemandeService,
              private router: Router,
              private categoryService: CategoryService,
              private boutiqueService: BoutiqueService) { }

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.params['id'];
    this.boutiques = this.boutiqueService.boutiques;
    if(this.boutiques){
      const bout = this.boutiques.filter((e) => e.id == id);
      this.product = bout[0];
      this.boutiqueForm.get('title').setValue(this.product.title);
      this.boutiqueForm.get('description').setValue(this.product.description);
      this.boutiqueForm.get('prix').setValue(this.product.prix);
      this.boutiqueForm.get('productId').setValue(this.product.productId);
    }else{
      this.boutiqueService.boutiquebyId(id).then((data:Boutique) => {
        this.product = data;
        this.boutiqueForm.get('title').setValue(this.product.title);
        this.boutiqueForm.get('description').setValue(this.product.description);
        this.boutiqueForm.get('prix').setValue(this.product.prix);
        this.boutiqueForm.get('productId').setValue(this.product.productId);
      }).catch((error) => {
      });
    }
    this.categoryService.categoryList().then((data: Category[]) => {
      this.categories = data;
    }).catch((error) => {
      console.log(error);
    });
    this.searchService.getArtisans().then((data: any[]) => {
      this.artisans = data;
      // this.options = data;
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
    this.boutiqueForm = this.formBuilder.group({
      title: [''],
      description: [''],
      prix: [''],
      livraison: [''],
      productId: [''],
      activation: [''],
      category: [''],
    });
  }
  onSubmit() {
    this.product.description = this.boutiqueForm.get('description').value;
    this.product.title =  this.boutiqueForm.get('title').value;
    this.product.prix  =  this.boutiqueForm.get('prix').value;
    this.product.livraison =  this.boutiqueForm.get('livraison').value ? this.boutiqueForm.get('livraison').value : this.product.livraison;
    this.product.category =  this.boutiqueForm.get('category').value ? this.boutiqueForm.get('category').value : this.product.category;
    this.product.productId =  this.boutiqueForm.get('productId').value;
    if(this.boutiqueForm.get('activation').value){
      if(this.boutiqueForm.get('activation').value == 0){
        this.product.isValid = false;
      }else{
        this.product.isValid = true;
      }
    }
    if(this.userImage.length>0){
      this.product.images =  this.userImage.join();
    }
    if(this.artisan){
      let num;
      if(this.artisan.substring(0, 1)=="+"){
        num = this.artisan.substring(1, this.artisan.length);
      }else if(this.artisan.substring(0, 2)=="00"){
        num = this.artisan.substring(2, this.artisan.length);
      }else{
        num =this.artisan;
      }
      this.product.artisan = `iyatg${num}@iyatg.com`;
    }
    this.boutiqueService.updateBoutique(this.product).then((data: Boutique) => {
      this.sendStatus = true;
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

}
deleteImgTab(id){
  this.userImage.splice(id, 1);
}
onBack() {
  this.router.navigate(['/dashboard', 'product']);
}

}

