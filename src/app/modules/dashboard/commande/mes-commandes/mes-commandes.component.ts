import { Component, OnInit } from '@angular/core';
import { Commande } from './../../../../models/commande';
import { CommandeService } from './../../../../services/commande.service';
import { Router, ActivatedRoute  } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-mes-commandes',
  templateUrl: './mes-commandes.component.html',
  styleUrls: ['./mes-commandes.component.css']
})
export class MesCommandesComponent implements OnInit {

  commandes: Commande[];
  commande: Commande;
  em = localStorage.getItem('userMail').match(/(\d+)/);
  email = this.em[0];

  constructor(
    private commandeService: CommandeService,
    private router: Router,
    private snackBar: MatSnackBar,
    ) {
  
    }
  
  
    ngOnInit() {
      console.log(this.email);
      const tel = `%2B${this.email}`;
      console.log('test',tel);
      this.commandeService.mesCommandes(tel).then((data: Commande[]) => {
        // const medecin = localStorage.getItem("userId");
        // console.log(medecin);

        // const rendezvous = data.rdvs;
        this.commandes  = data;
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
  
  }
  
