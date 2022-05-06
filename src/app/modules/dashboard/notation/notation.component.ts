import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotationService } from './../../../services/notation.service';
import { Notation } from './../../../models/notation';
import { ActivatedRoute, Router } from '@angular/router';
import { Demande } from './../../../models/demande';
import { DemandeService } from './../../../services/demande.service';

@Component({
  selector: 'app-notation',
  templateUrl: './notation.component.html',
  styleUrls: ['./notation.component.css']
})
export class NotationComponent implements OnInit {
  endForm = true;
  noteForm: FormGroup;
  auteur;
  id;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notationService: NotationService,
    private demandeService: DemandeService ) { }

  ngOnInit(): void {
    this.initForm();
    const email = this.route.snapshot.params['email'];
    const id = this.route.snapshot.params['id'];
    this.auteur = email;
    this.id = id;
    console.log(this.id)
  }
  initForm() {
    this.noteForm = this.formBuilder.group({
      note: ['', [Validators.required]],
      note_entreprise: [''],
      suggestion_entreprise: [''],
    });
  }
  onSave(){
    this.endForm = false;
  }
  onSubmit() {
    const note = this.noteForm.get('note').value;
    const noteEntreprise = this.noteForm.get('note_entreprise').value;
    const suggestion_entreprise = this.noteForm.get('suggestion_entreprise').value;
    const noteSend = new Notation(note, this.auteur, note, noteEntreprise, suggestion_entreprise);
    this.notationService.sendNotation(noteSend).then((data) => {
      this.endForm = false;
      this.onEndForm();
      console.log(data);
    }).catch((error) =>{
      console.log(error);
    });
  }
  onEndForm(){
    this.demandeService.demandebyId(this.id).then((data: Demande) => {
      data.status = 'Fin process';
      this.demandeService.updateDemande(data).then((data) => {
        this.endForm = false;
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });

  }
  onBack(){
    this.router.navigate(['/dashboard']);
  }

}
