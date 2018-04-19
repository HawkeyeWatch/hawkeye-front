import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule}   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DataService } from "./data.service";
import { GlobalDataService } from "./global.service";
import { LoginGuard } from "./login.guard";

import { AppComponent } from './app.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard]},
  {path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent,
    NavbarComponent,
    DashboardComponent,
    LoginComponent,
    LoginFormComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
    DataService,
    GlobalDataService,
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
