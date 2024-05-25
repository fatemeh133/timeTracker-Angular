import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import { TaskComponent } from './task/task.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MaterialPersianDateAdapter,
  PERSIAN_DATE_FORMATS,
} from './persian-date-adapter';

import { HttpClientModule } from '@angular/common/http';
import { ConnectionService } from './services/connection.service';
import { DurationPipe } from './pipe/duration.pipe';
import { CencelDialogComponent } from './cencel-dialog/cencel-dialog.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    TaskComponent,
    HomeComponent,
    DurationPipe,
    CencelDialogComponent,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MaterialPersianDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
    provideAnimationsAsync(),
    ConnectionService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
