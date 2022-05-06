import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Category} from './../../../models/category';
import { CategoryService } from './../../../services/category.service';
import { DemandeService } from './../../../services/demande.service';
import { environment } from './../../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
  images: GalleryItem[];
  sendStatus = false;
  blogForm: FormGroup;
  @ViewChild("labelImport", {static: false}) labelImport: ElementRef;
  artisanEmail;
  metier;
  formdata = new FormData();
  fileToUpload: File = null;
  lego;
  fileIsUploading = false;
  fileUrl: string;
  url;
  blogs;
  addagain = false;
  notAdd = false;
  preUrl;
  fileUploaded = false;
  errorFile: boolean;
  categories: Category[];
  categoryForm: FormGroup;
  userImage = [];
  closeResult = '';
  constructor(private categoryService: CategoryService,
              private router: Router,
              private demandeService: DemandeService,
              private modalService: NgbModal,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.categoryService.categoryList().then((data: Category[]) => {
      this.categories = data;
    }).catch((error) => {
      console.log(error);
    });
  }
  initForm() {
    this.categoryForm = this.formBuilder.group({
      libele: ['', [Validators.required]],
      description: [''],
    });
  }
  onSubmit() {
    const libele = this.categoryForm.get('libele').value;
    const description = this.categoryForm.get('description').value;
    const category = new Category(libele, description);
    category.image = this.userImage.join();
    this.categoryService.addCategory(category).then((data: Category) => {
      this.sendStatus = true;
      this.categories.push(data);
      console.log(data);
    }).catch((error) =>{
      console.log(error);
    });
  }
  addAgain() {
    this.sendStatus = false;
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
      if(this.userImage.length < 1){
        this.addagain = true;
        this.url = '';
        this.labelImport.nativeElement.innerText = 'Choisissez un fichier...';
      }else{
        this.addagain = false;
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
  onUpdate(id: string) {
    this.categoryService.categories = this.categories;
    this.router.navigate(['/dashboard', 'category', 'update', id ]);
  }

  // onDelete(id:number){
  //   let ok = confirm("Etes-vous sûr de supprimer cet article?");
  //   if(ok){
  //     this.categoryService.deleteBlog(id).then((data) => {
  //       let ind = this.blogs.findIndex(i => i.id === id);
  //       this.blogs.splice(ind, 1);
  //       this.openSnackBar('Opération effectuée avec succèss', 'Ok');
  //     }).catch((error) =>{
  //       this.openSnackBar('erreur lors de l\'enregistrement. Désactiver le simplement', 'Ok');
  //     });
  //   }
    
  // }
  deleteImgTab(id){
    this.userImage.splice(id, 1);
  }
  open(content, id) {
    this.images = [];
    const demde = this.categories.filter(e => e.id == id);
    const img = demde[0].image;
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

