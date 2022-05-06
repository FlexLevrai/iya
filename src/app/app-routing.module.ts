
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthGuardService} from './services/auth-guard.service';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { DefaultComponent } from './default/default.component';
import { SigninComponent } from './auth/signin/signin.component';
import { VerifyNumComponent } from './auth/verify-num/verify-num.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { RouterModule, Routes, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AnnoncesComponent } from './annonces/annonces.component';
import { AnnonceDetailComponent } from './annonce-detail/annonce-detail.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { BoutiqueDetailComponent } from './boutique-detail/boutique-detail.component';
import { BoutiqueCommandeComponent } from './boutique-commande/boutique-commande.component';
import { AnnoncePostuleComponent } from './annonce-postule/annonce-postule.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BoutiqueCategoryComponent } from './boutique/boutique-category/boutique-category.component';

const routes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'auth/recover-password', component: RecoverPasswordComponent },
  { path: 'auth/verify', component: VerifyNumComponent},
  { path: 'auth/verify-code', component: VerifyCodeComponent},
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },
  { path: 'annonces', component: AnnoncesComponent },
  { path: 'annonces/:id', component: AnnonceDetailComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'boutique/:id', component: BoutiqueDetailComponent },
  { path: 'commande/:id', component: BoutiqueCommandeComponent},
  { path: 'je-postule/:id', canActivate: [AuthGuardService], component: AnnoncePostuleComponent},
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id/:slug', component: BlogDetailComponent},
  { path: 'boutique/category/:category', component: BoutiqueCategoryComponent},

  
  {
    path: '', component: DefaultComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module')
      .then(mod => mod.DashboardModule)
  },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
