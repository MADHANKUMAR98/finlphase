import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // For reactive forms
import { HttpClientModule } from '@angular/common/http';  // For HTTP requests

import { AppComponent } from './app.component';
// import { RegisterComponent } from './register/register.component';  // Register component
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './services/user.service';  // User service

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent  // Register component added
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [UserService],  // User service added to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
