import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PageComponent } from './page/page.component';
import { ProfilComponent } from './profil/profil.component';
import { DemandeComponent } from './demande/demande.component';
import { DevisComponent } from './devis/devis.component';
import { NotationComponent } from './notation/notation.component';
import { AuthGuardService} from '../../services/auth-guard.service';
import { BoutiqueComponent } from './boutique/boutique.component';
import { BoutiqueUpdateComponent } from './boutique/boutique-update/boutique-update.component';
import { AnnoncesComponent } from './annonces/annonces.component';
import { AnnonceUpdateComponent } from './annonces/annonce-update/annonce-update.component';
import { ListCommandeComponent } from './commande/list-commande/list-commande.component';
import { MesCommandesComponent } from './commande/mes-commandes/mes-commandes.component';
import { ListAnnoncesComponent } from './annonces/list-annonces/list-annonces.component';
import { CandidatsComponent } from './postulation/candidats/candidats.component';
import { CandidatureComponent } from './postulation/candidature/candidature.component';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogUpdateComponent } from './blog/blog-update/blog-update.component';
import { CategoryComponent } from './category/category.component';
import { CategoryUpdateComponent } from './category/category-update/category-update.component';
import { NotificationComponent } from './notification/notification.component';



const routes: Routes = [
  { path: '',    canActivate: [AuthGuardService],  component: DashboardComponent, children: [
    { path: '', component: PageComponent},
    { path: 'demande/:email/:metier', component: DemandeComponent},
    { path: 'profil', component: ProfilComponent},
    { path: 'devis/:id', component: DevisComponent},
    { path: 'notation/:email/:id', component: NotationComponent},
    { path: 'product', component: BoutiqueComponent},
    { path: 'product/update/:id', component: BoutiqueUpdateComponent},
    { path: 'annonces', component: AnnoncesComponent},
    { path: 'annonces/update/:id', component: AnnonceUpdateComponent},
    { path: 'commandes', component: ListCommandeComponent},
    { path: 'mes-commandes', component: MesCommandesComponent},
    { path: 'list-annonces', component: ListAnnoncesComponent},
    { path: 'candidats/:id', component: CandidatsComponent},
    { path: 'candidature', component: CandidatureComponent},
    { path: 'blog', component: BlogComponent},
    { path: 'blog/update/:id', component: BlogUpdateComponent},
    { path: 'category', component: CategoryComponent},
    { path: 'category/update/:id', component: CategoryUpdateComponent},
    { path: 'notification', component: NotificationComponent},
      ]},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
