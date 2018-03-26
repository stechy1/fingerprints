import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2FileInputModule } from "ng2-file-input";
import { AngularFireLite } from 'angularfire-lite';

import { FingerprintService } from "./fingerprint.service";
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FingerprintViewComponent } from './dashboard/fingerprint-view/fingerprint-view.component';
import { FingerprintUploadComponent } from './fingerprint-upload/fingerprint-upload.component';
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
    AngularFireLite.forRoot(environment.firebase),
    Ng2FileInputModule.forRoot(),
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [FingerprintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
