import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { Ng2FileInputModule } from "ng2-file-input";

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { FingerprintViewComponent } from './dashboard/fingerprint-view/fingerprint-view.component';
import { FingerprintUploadComponent } from './fingerprint-upload/fingerprint-upload.component';
import { FingerprintService } from "./fingerprint.service";
import { AngularFireLite } from 'angularfire-lite';
import { environment } from '../environments/environment';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'upload', component: FingerprintUploadComponent},
  {path: 'auth', children:
      [
        {path: 'signup', component: SignupComponent}
      ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    FingerprintViewComponent,
    FingerprintUploadComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    Ng2FileInputModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    AngularFireLite.forRoot(environment.firebase)
  ],
  providers: [FingerprintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
