import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AccountListModule } from '@accountList/account-list.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccountListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
