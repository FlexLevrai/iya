import { Component, OnDestroy, OnInit } from '@angular/core';
import { DevisService } from './../../../services/devis.service';
import { Devis } from './../../../models/devis';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Demande } from './../../../models/demande';
import { DemandeService } from './../../../services/demande.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent implements OnInit, OnDestroy {
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'myquote',
  }

  devis: Devis[];
  devisSubscription: Subscription;
  devisForm: FormGroup;
  endDevis = false;
  apDevis = false;
  endForm = true;
  id: number;
  total: number;
  forPrint = true;

  constructor(private devisService: DevisService,
              private exportAsService: ExportAsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private demandeService: DemandeService ) {}


  ngOnInit() {
    this.initForm();
    const id = this.route.snapshot.params['id'];
    this.id = id;
    this.devisSubscription = this.devisService.devisSubject.subscribe(
      (devis: Devis[]) => {
        this.devis = devis;
        this.total = 0;
        this.devis.forEach((e) => {
          this.total += parseInt(e.prixUnitaire) * e.quantite;
        });
      }
    );
    this.devisService.emitDevis();
  }
  export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'Mon Devis').subscribe(() => {
      // save started
      this.forPrint = false;
    });
    // // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  }
  onNewBook() {
    this.router.navigate(['/devis', 'new']);
  }

  onDeleteBook(devis: Devis) {
    this.devisService.removeBook(devis);
  }

  onViewBook(id: number) {
    this.router.navigate(['/devis', 'view', id]);
  }
  initForm() {
    this.devisForm = this.formBuilder.group({
      designation: ['', Validators.required],
      quantite: ['', Validators.required],
      pu: ['', Validators.required],
    });
  }

  onSaveDevis() {
    const designation = this.devisForm.get('designation').value;
    const quantite = this.devisForm.get('quantite').value;
    const pu = this.devisForm.get('pu').value;
    const newDevis = new Devis(designation, designation, quantite, `${pu}`, pu*quantite, `/api/demandes/${this.id}`);
    this.devisService.createNewDevis(newDevis);
    this.apDevis = true;
    this.endDevis =true;
    this.initForm();

    // this.router.navigate(['/books']);
  }
  onEndForm(){
    this.demandeService.demandebyId(this.id).then((data: Demande) => {
      data.status = 'Phase devis';
      this.demandeService.updateDemande(data).then((data) => {
        this.endForm = false;
      }).catch((error) => {
      });
    }).catch((error) => {
    });

  }
  ngOnDestroy() {
    this.devisSubscription.unsubscribe();
  }
}
