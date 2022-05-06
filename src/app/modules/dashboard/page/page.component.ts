import { DialogTextComponent } from './../dialog-text/dialog-text.component';
import { Component, OnInit, enableProdMode } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { Users } from './../../../models/users';
import { Demande } from './../../../models/demande';
import { DemandeService } from './../../../services/demande.service';
import { MatDialog} from '@angular/material/dialog';
import { DevisService } from './../../../services/devis.service';
import { Devis } from './../../../models/devis';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DialogDateComponent } from './../dialog-date/dialog-date.component';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  url = environment.imgUrl;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'myquote',
  };
  isAdmin = false;
  total: number;
  images: GalleryItem[];
  forPrint = true;
  email = localStorage.getItem('userMail');
  profils: Users;
  profession;
  demande: Demande[];
  disp = false;
  contenu: Demande[];
  displ;
  log1 = true;
  devis: Devis[];
  dev = true;
  idSelected: number;
  isPayed = false;
  closeResult = '';
  constructor(private authService: AuthService,
              private demandeService: DemandeService,
              public matDialog: MatDialog,
              private router: Router,
              private exportAsService: ExportAsService,
              private modalService: NgbModal,
              public devisService: DevisService) {
               }

  ngOnInit(): void {
    this.authService.profilUser(this.email).then((data: Users) => {
      this.profils = data[0];
      const admin = this.profils.roles.filter(element => element == 'ROLE_ADMIN');
      let role = 'user';
      if(admin.length > 0){
        role = 'admin';
      };
      if(role == 'admin'){
        this.isAdmin = true;
      }
      localStorage.setItem('profession', this.profils.profession);
      localStorage.setItem('role', role);
      this.profession = this.profils.profession;
      if (this.profession){
        this.demandeService.demandeExecuteur(this.email).then((data: Demande[]) => {
          this.demande = data.reverse();
          if(this.demande.length >  0){
            this.disp = true;
          }
        }).catch((error) =>{
        });
      }else if(role == 'admin'){
        this.demandeService.getAllDemande().then((data :Demande[]) => {
          this.demande = data;
          if(this.demande.length > 0){
            this.disp =true;
          }
        }).catch((error) =>{
        });
      }else {
        this.demandeService.demandeProprietaire(this.email).then((data :Demande[]) => {
          this.demande = data;
          if(this.demande.length > 0){
            this.disp =true;
          }
        }).catch((error) =>{
        });
      }
    }).catch((error) =>{
    });
  }
  handleDetail(id: number){
    const dialogRef = this.matDialog.open(DialogTextComponent, {
      width: '300px',
      data: {name: "Vos questions", contenu: "Une question"}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.contenu = this.demande.filter((e) => e.id === id);
      this.contenu[0].detailQuestions = result;
      this.contenu[0].disponibilite = this.demandeService.demandeDispo;
      this.demandeService.updateDemande(this.contenu[0]).then((data) => {
        this.displ = this.contenu[0];
      }).catch((error) => {
      });
    });
  }
  handleReponse(id: number){
    this.contenu = this.demande.filter((e) => e.id === id);
    const dialogRef = this.matDialog.open(DialogTextComponent, {
      width: '300px',
      data: {name: `Les questions: ${this.contenu[0].detailQuestions}`, contenu: 'Votre réponse', disponibilite:`Disponilité: ${this.contenu[0].disponibilite}`}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.contenu[0].details = result;
      this.demandeService.updateDemande(this.contenu[0]).then((data) => {
        this.dev = false;
      }).catch((error) => {
      });
    });
  }
  showDevis(id: number){
    this.idSelected = id;
    this.devisService.devisById(id).then((data: Devis[]) => {
      this.devis = data;
      this.total = 0;
      this.devis.forEach((e) => {
        this.total += parseInt(e.prixUnitaire) * e.quantite;
      });
      this.dev = false;
    }).catch((error) => {
    });
  }
  export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'Mon Devis').subscribe(() => {
      // save started
      this.forPrint = false;
    });
  }
  pay(content, id: number){
    this.contenu = this.demande.filter((e) => e.id === id);
    this.contenu[0].status = 'Phase Paiement';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-pay'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.demandeService.updateDemande(this.contenu[0]).then((data) => {
      // this.isPayed = true;
      // this.dev = true;
    }).catch((error) =>{
    });
  }
  confirmPay(id: number){
    if(confirm("Confirmer votre action")){
      this.contenu = this.demande.filter((e) => e.id === id);
      this.contenu[0].status = 'Phase Execution';
      this.demandeService.updateDemande(this.contenu[0]).then((data) => {
        this.isPayed = true;
        this.dev = true;
      }).catch((error) =>{
      });
    }
  }
  dateExecution(id: number){
    this.contenu = this.demande.filter((e) => e.id === id);
    const dialogRef = this.matDialog.open(DialogDateComponent, {
      width: '300px',
      data: {name: `Votre disponibilité`, contenu: 'votre date'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.contenu[0].executionDate = result;
      this.contenu[0].status = 'Phase Execution avec Date';
      this.demandeService.updateDemande(this.contenu[0]).then((data) => {
      }).catch((error) => {
      });
    });
  }
  note(id: number){
    const demde = this.demande.filter(e => e.id == id);
    this.router.navigate(['/dashboard/notation', demde[0].executeur, id]);
  }
  open(content, id) {
    this.images = [];
    const demde = this.demande.filter(e => e.id == id);
    const img = demde[0].imagePath;
    if(img){
      const imgs = img.split(',');
      for (const imge of imgs) {
        this.images.push(new ImageItem({ src: `${this.url}${imge}`, thumb: `${this.url}${imge}` }))
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
  openPayInfo(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-pay'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
