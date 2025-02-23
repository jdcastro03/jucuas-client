import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Http404Component } from './http404/http404.component';
import { AuthModule } from './auth/auth.module';
import { PortalModule } from './portal/portal.module';
import { DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SidebarComponent } from './portal/shared/sidebar/sidebar.component';
import { NgChartsModule } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    // Http404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    AuthModule,
    PortalModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgChartsModule,
    MatTabsModule
  ],
  providers: [
    DatePipe,
    //MdbModalService,
    SidebarComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
