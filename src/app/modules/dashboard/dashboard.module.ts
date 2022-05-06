import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './../../services/toast.service';
// import { ToastsContainerComponent } from './../../toasts-container/toasts-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ExportAsModule } from 'ngx-export-as';
import { GalleryModule } from  'ng-gallery';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AngularOpenlayersModule } from "ngx-openlayers";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { PageComponent } from './page/page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService} from '../../services/auth-guard.service';
import { DemandeComponent } from './demande/demande.component';
import { ProfilComponent } from './profil/profil.component';
import {MatTableModule} from '@angular/material/table';
import { DataTableModule } from 'ng-angular8-datatable';
import { DevisComponent } from './devis/devis.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogTextComponent } from './dialog-text/dialog-text.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {TextFieldModule} from '@angular/cdk/text-field';
import { DialogDateComponent } from './dialog-date/dialog-date.component';
import { NotationComponent } from './notation/notation.component';
import { AnnoncesComponent } from './annonces/annonces.component';
import { AnnonceUpdateComponent } from './annonces/annonce-update/annonce-update.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { BoutiqueUpdateComponent } from './boutique/boutique-update/boutique-update.component';
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


@NgModule({
  declarations: [PageComponent,
    FooterComponent,
    HeaderComponent, NavComponent, DashboardComponent, DemandeComponent, ProfilComponent, DevisComponent, DialogTextComponent, DialogDateComponent, NotationComponent, AnnoncesComponent, AnnonceUpdateComponent, BoutiqueComponent, BoutiqueUpdateComponent, ListCommandeComponent, MesCommandesComponent, ListAnnoncesComponent, CandidatsComponent, CandidatureComponent, BlogComponent, BlogListComponent, BlogUpdateComponent, CategoryComponent, CategoryUpdateComponent, NotificationComponent],
  imports: [
    CommonModule,
    NgbModule,
    Ng2TelInputModule,
    DashboardRoutingModule,
    FormsModule,
    MatTableModule,
    DataTableModule,
    ReactiveFormsModule,
    LeafletModule,
    AngularOpenlayersModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatSlideToggleModule,
    ExportAsModule,
    GalleryModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    CKEditorModule
  ],
  entryComponents: [DialogTextComponent, PageComponent, DialogDateComponent],
  providers: [AuthGuardService, ToastService],
})
export class DashboardModule { }
