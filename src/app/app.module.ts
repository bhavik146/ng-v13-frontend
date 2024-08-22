import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';

import { AngularMaterialModule } from './angular-material.module'
import { PostModule } from './posts/posts.module';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true }

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
