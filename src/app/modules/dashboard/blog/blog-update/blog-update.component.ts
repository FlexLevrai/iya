import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Blog } from './../../../../models/blog';
import { Users } from './../../../../models/users';
import { BlogService } from './../../../../services/blog.service';
import { DemandeService } from './../../../../services/demande.service';
import { SearchService } from './../../../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../../../environments/environment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-blog-update',
  templateUrl: './blog-update.component.html',
  styleUrls: ['./blog-update.component.css']
})
export class BlogUpdateComponent implements OnInit {
  public Editor = ClassicEditor;
  imgUrl = environment.imgUrl;
  // typeSalle: TypeSalle[];
  // typeSal: TypeSalle;
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
  blog: Blog;
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
              private blogService: BlogService) { }

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.params['id'];
    this.blogs = this.blogService.blogs;
    if(this.blogs){
      const bout = this.blogs.filter((e) => e.id == id);
      this.blog = bout[0];
      this.blogForm.get('title').setValue(this.blog.title);
      this.blogForm.get('description').setValue(this.blog.article);
    }else{
      this.blogService.blogbyId(id).then((data:Blog) => {
        this.blog= data;
        this.blogForm.get('title').setValue(this.blog.title);
        this.blogForm.get('description').setValue(this.blog.article);
      }).catch((error) => {
      });
    }
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
    this.blogForm = this.formBuilder.group({
      title: [''],
      description: [''],
      prix: [''],
      livraison: [''],
      productId: [''],
      activation: [''],
    });
  }
  onSubmit() {
    this.blog.article = this.blogForm.get('description').value;
    this.blog.title =  this.blogForm.get('title').value;
    
    if(this.userImage.length>0){
      this.blog.images =  this.userImage.join();
    }
    this.blogService.updateBlog(this.blog).then((data: Blog) => {
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
    this.router.navigate(['/dashboard', 'blog']);
  }

}