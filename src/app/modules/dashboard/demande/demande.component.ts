import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Demande } from './../../../models/demande';
import { DemandeService } from './../../../services/demande.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent implements OnInit {
  imgUrl = environment.imgUrl;
  @ViewChild("labelImport", {static: false}) labelImport: ElementRef;
  sendStatus = false;
  artisanEmail;
  metier;
  formdata = new FormData();
  fileToUpload: File = null;
  lego;
  entreprise;
  entrepriseForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  url;
  addAgain = false;
  notAdd = false;
  preUrl;
  fileUploaded = false;
  errorFile: boolean;
  email = localStorage.getItem('userMail');
  demandForm: FormGroup;
  userImage = [];
  private sub: any;
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private demandeService: DemandeService) { }

  ngOnInit(): void {
    this.initForm();
    this.artisanEmail = this.route.snapshot.params['email'];
    this.metier = this.route.snapshot.params['metier'];
  }
  initForm() {
    this.demandForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
  }
  onSubmit() {
    const description = this.demandForm.get('description').value;
    const imagePath =  this.userImage.join();
    const demande = new Demande(this.metier, description, 'Nouvelle demande', this.email, this.artisanEmail, '', '', imagePath);
    this.demandeService.sendDemande(demande).then((data) => {
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
deleteImgTab(id){
  this.userImage.splice(id, 1);
}

}
