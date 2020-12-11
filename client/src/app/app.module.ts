import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main.component';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './components/form.component';
import { SubformComponent } from './components/sub/subform.component';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ApiService } from './api.service';
import { ErrorComponent } from './components/error.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FormComponent,
    SubformComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatMomentDateModule,  
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
