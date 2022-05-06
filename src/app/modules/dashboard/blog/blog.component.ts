import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Blog } from './../../../models/blog';
import { Users } from './../../../models/users';
import { BlogService } from './../../../services/blog.service';
import { DemandeService } from './../../../services/demande.service';
import { SearchService } from './../../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  public Editor = ClassicEditor;
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
              private blogService: BlogService) { }

  ngOnInit(): void {
    this.initForm();
    this.blogService.blogList().then((data:Blog[]) => {
      this.blogs = data;
    }).catch((error) =>{
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
    this.blogForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  onSubmit() {
    const description = this.blogForm.get('description').value;
    const title =  this.blogForm.get('title').value;
    const imagePath =  this.userImage.join();
    const blog = new Blog(title,description,0,imagePath, 'iyatg');
    this.blogService.addBlog(blog).then((data: Blog) => {
      this.sendStatus = true;
      this.blogs.push(data);
    }).catch((error) =>{
      console.log(error);
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
    const bout = this.blogs.filter((e) => e.id === id);
    const blog =bout[0];
    this.blogService.blogs = this.blogs;
    this.router.navigate(['/dashboard', 'blog', 'update',  id ]);
  }
  onDelete(id:number){
    let ok = confirm("Etes-vous sûr de supprimer cet article?");
    if(ok){
      this.blogService.deleteBlog(id).then((data) => {
        let ind = this.blogs.findIndex(i => i.id === id);
        this.blogs.splice(ind, 1);
        this.openSnackBar('Opération effectuée avec succèss', 'Ok');
      }).catch((error) =>{
        this.openSnackBar('erreur lors de l\'enregistrement. Désactiver le simplement', 'Ok');
      });
    }
    
  }
  deleteImgTab(id){
    this.userImage.splice(id, 1);
  }
  open(content, id) {
    this.images = [];
    const demde = this.blogs.filter(e => e.id == id);
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
