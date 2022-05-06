import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Boutique } from './../../../models/boutique';
import { Users } from './../../../models/users';
import { BoutiqueService } from './../../../services/boutique.service';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { DemandeService } from './../../../services/demande.service';
import { SearchService } from './../../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent implements OnInit {
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
  images: GalleryItem[];
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
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private searchService: SearchService,
              private demandeService: DemandeService,
              private modalService: NgbModal,
              private router: Router,
              private snackBar: MatSnackBar,
              private categoryService: CategoryService,
              private boutiqueService: BoutiqueService) { }

  ngOnInit(): void {
    this.initForm();
    this.boutiqueService.boutiqueList().then((data:Boutique[]) => {
      this.boutiques = data;
      console.log(data);
    }).catch((error) =>{
    });
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
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
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
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      prix: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      livraison: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }
  onSubmit() {
    const description = this.boutiqueForm.get('description').value;
    const title =  this.boutiqueForm.get('title').value;
    const prix =  this.boutiqueForm.get('prix').value;
    const livraison =  this.boutiqueForm.get('livraison').value;
    const productId =  this.boutiqueForm.get('productId').value;
    const category =  this.boutiqueForm.get('category').value;
    const imagePath =  this.userImage.join();
    let num;
    if(this.artisan.substring(0, 1)=="+"){
      num = this.artisan.substring(1, this.artisan.length);
    }else if(this.artisan.substring(0, 2)=="00"){
      num = this.artisan.substring(2, this.artisan.length);
    }else{
      num =this.artisan;
    }
    const email = `iyatg${num}@iyatg.com`;
    const boutique = new Boutique(title, description, `${prix}`, livraison, imagePath, email, productId, true, category);
    this.boutiqueService.sendBoutique(boutique).then((data: Boutique) => {
      this.sendStatus = true;
      this.boutiques.push(data);
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
    const bout = this.boutiques.filter((e) => e.id === id);
    const boutique =bout[0];
    this.boutiqueService.boutiques = this.boutiques;
    this.router.navigate(['/dashboard', 'product', 'update',  id ]);
  }
  onDelete(id:number){
    let ok = confirm("Etes-vous sûr de supprimer ce produit?");
    if(ok){
      this.boutiqueService.deleteProduct(id).then((data) => {
        let ind = this.boutiques.findIndex(i => i.id === id);
        this.boutiques.splice(ind, 1);
        this.openSnackBar('Opération effectuée avec succèss', 'Ok');
      }).catch((error) =>{
        this.openSnackBar('erreur lors de l\'enregistrement. Des commandes associées à ce produit. Désactiver le simplement', 'Ok');
      });
    }
    
  }
  deleteImgTab(id){
    this.userImage.splice(id, 1);
  }
  open(content, id) {
    this.images = [];
    const demde = this.boutiques.filter(e => e.id == id);
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
