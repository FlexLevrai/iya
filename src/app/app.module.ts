import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { AgmCoreModule } from '@agm/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { Ng2TelInputModule } from 'ng2-tel-input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { IntlTelInputNgModule} from 'intl-tel-input-ng';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { DataTableModule } from 'ng-angular8-datatable';
import { AngularOpenlayersModule } from "ngx-openlayers";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ExportAsModule } from 'ngx-export-as';
import { GalleryModule } from  'ng-gallery';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxWhastappButtonModule } from "ngx-whatsapp-button";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DefaultComponent } from './default/default.component';
import { OtherPageComponent } from './other-page/other-page.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyNumComponent } from './auth/verify-num/verify-num.component';
import { HereMapComponent } from './default/here-map/here-map.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AnnoncesComponent } from './annonces/annonces.component';
import { AnnonceDetailComponent } from './annonce-detail/annonce-detail.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { BoutiqueDetailComponent } from './boutique-detail/boutique-detail.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SplitPipe } from './pipes/split.pipe';
import { BoutiqueCommandeComponent } from './boutique-commande/boutique-commande.component';
import { AnnoncePostuleComponent } from './annonce-postule/annonce-postule.component';
import { AuthModule } from './auth/auth.module';
import { FeaturesModule } from './features/features.module';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BoutiqueCategoryComponent } from './boutique/boutique-category/boutique-category.component';
// import {MatSnackBar} from '@angular/material/snack-bar';
// import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './services/messaging.service';
import { AsyncPipe } from '../../node_modules/@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    OtherPageComponent,
    SignupComponent,
    SigninComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    VerifyNumComponent,
    HereMapComponent,
    VerifyCodeComponent,
    AnnoncesComponent,
    AnnonceDetailComponent,
    BoutiqueComponent,
    BoutiqueDetailComponent,
    FooterComponent,
    HeaderComponent,
    SplitPipe,
    BoutiqueCommandeComponent,
    AnnoncePostuleComponent,
    BlogComponent,
    BlogDetailComponent,
    BoutiqueCategoryComponent,
    // ToastsContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    AppRoutingModule,
    DashboardModule,
    ExportAsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    Ng2TelInputModule,
    NgbModule,
    NgxWhastappButtonModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatStepperModule,
    MatButtonModule,
    DataTableModule,
    AngularOpenlayersModule,
    LeafletModule,
    GalleryModule,
    NgxPaginationModule,
    IntlTelInputNgModule.forRoot(),
    // AgmCoreModule.forRoot({
    //   // AIzaSyCke55sKTAOhTUHGkvlVv563k1R-Yd3D7I
    //   // apiKey: 'AIzaSyCke55sKTAOhTUHGkvlVv563k1R-Yd3D7I',
    //   libraries: ['places']
    // }),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AuthModule,
    FeaturesModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [MessagingService,AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
