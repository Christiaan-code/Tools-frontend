import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PowerButtonComponent } from './power-button/power-button.component';
import { LoaderComponent } from './loader/loader.component';
import { CustomCardComponent } from './custom-card/custom-card.component';

@NgModule({
  declarations: [
    AppComponent,
    PowerButtonComponent,
    LoaderComponent,
    CustomCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent,PowerButtonComponent]
})
export class AppModule { }
