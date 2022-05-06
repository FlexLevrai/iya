import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import {Category} from './../../../../models/category';
import { CategoryService } from './../../../../services/category.service';
import { DemandeService } from './../../../../services/demande.service';
import { environment } from './../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {

  sendStatus = false;
  categories: Category[];
  categoryForm: FormGroup;
  category: Category;
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
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
  userImage = [];
  closeResult = '';
  id;
  constructor(private categoryService: CategoryService,
              private router: Router,
              private route: ActivatedRoute,
              private demandeService: DemandeService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.id = this.route.snapshot.params['id'];
    this.categories = this.categoryService.categories;
    if(!this.categories){
      this.categoryService.categorybyId(this.id).then((data: Category) => {
        this.category = data;
        this.categoryForm.controls['libele'].setValue(this.category.title);
        this.categoryForm.controls['description'].setValue(this.category.description);

      }).catch((error) => {
        console.log(error);
      });
    } else {
      const titre = this.categories.filter((e) => e.id == this.id);
      this.category = titre[0];
      this.categoryForm.controls['libele'].setValue(this.category.title);
      this.categoryForm.controls['description'].setValue(this.category.description);
    }
  }
  initForm() {
    this.categoryForm = this.formBuilder.group({
      libele: [''],
      description: [''],
    });
  }
  onSubmit() {
    this.category.title = this.categoryForm.get('libele').value ? this.categoryForm.get('libele').value :this.category.title;
    this.category.description = this.categoryForm.get('description') ? this.categoryForm.get('description').value :this.category.description;
    this.category.image = this.userImage.length > 0 ? this.userImage.join() : this.category.image;
    this.categoryService.updateCategory(this.category).then((data: any) => {
      this.sendStatus = true;
    }).catch((error) =>{
      console.log(error);
    });
  }
  addAgain() {
    this.sendStatus = false;
  }

  goBack() {
    this.router.navigate(['/dashboard', 'category']);
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
  deleteImgTab(id){
    this.userImage.splice(id, 1);
  }
}


