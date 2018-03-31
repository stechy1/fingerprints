import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2FileInputModule } from "ng2-file-input";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { FingerprintService } from "./fingerprint.service";

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FingerprintViewComponent } from './fingerprint-view/fingerprint-view.component';
import { FingerprintUploadComponent } from './fingerprint-upload/fingerprint-upload.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './auth/auth.service';
import { SignupGuard } from './auth/signup/signup.guard';
import { LogoutComponent } from './auth/logout/logout.component';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { SigninGuard } from './auth/signin/signin.guard';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'upload', component: FingerprintUploadComponent, canActivate: [SigninGuard]},
  {path: 'auth', children:
      [
        {path: 'signup', component: SignupComponent, canActivate: [SignupGuard]},
        {path: 'signin', component: SigninComponent, canActivate: [SignupGuard]},
        {path: 'logout', component: LogoutComponent, canActivate: [SigninGuard]}
      ]
  },
  {path: '*', redirectTo: 'dashboard'}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    FingerprintViewComponent,
    FingerprintUploadComponent,
    SigninComponent,
    SignupComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    Ng2FileInputModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule
  ],
  providers: [
    FingerprintService,
    AuthService,
    SignupGuard,
    SigninGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
