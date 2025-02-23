import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PresentersComponent } from './containers/presenters/presenters.component';
import { PresentersFormComponent } from './containers/presenters-form/presenters-form.component';
import { DataTablesModule } from 'angular-datatables';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UniversitiesComponent } from './containers/universities/universities.component';
import { UniversitiesFormComponent } from './containers/universities-form/universities-form.component';
import { OrganizationalUnitsComponent } from './containers/organizational-units/organizational-units.component';
import { OrganizationalUnitsFormComponent } from './containers/organizational-units-form/organizational-units-form.component';
import { RepresentativesComponent } from './containers/representatives/representatives.component';
import { RepresentativesFormComponent } from './containers/representatives-form/representatives-form.component';
import { ActivityManagersComponent } from './containers/activity-managers/activity-managers.component';
import { ActivityManagersFormComponent } from './containers/activity-managers-form/activity-managers-form.component';
import { ReviewersComponent } from './containers/reviewers/reviewers.component';
import { ReviewersFormComponent } from './containers/reviewers-form/reviewers-form.component';
import { DeadlineComponent } from './containers/deadline/deadline.component';
import { DeadlineFormComponent } from './containers/deadline-form/deadline-form.component';
import { TypeEvidencesComponent } from './containers/type-evidences/type-evidences.component';
import { TypeEvidencesFormComponent } from './containers/type-evidences-form/type-evidences-form.component';
import { TypeActivitiesComponent } from './containers/type-activities/type-activities.component';
import { TypeActivitiesFormComponent } from './containers/type-activities-form/type-activities-form.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { EvidencesComponent } from './containers/evidences/evidences.component';
import { EvidencesFormComponent } from './containers/evidences-form/evidences-form.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { ConstancyComponent } from './containers/constancy/constancy.component';
import { TotalAttendeesFormComponent } from './containers/total-attendees-form/total-attendees-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { TablePaginationComponent } from './containers/table-pagination/table-pagination.component';
import { Http404Component } from '../http404/http404.component';
import { InputSearchComponent } from './containers/input-search/input-search.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ActivitiesFormComponent } from './containers/activities-form/activities-form.component';
import { PresentersModalComponent } from './containers/presenters-modal/presenters-modal.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ChangePasswordDialogComponent } from '../components/change-password-dialog/change-password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    PortalComponent,
    PresentersComponent,
    PresentersFormComponent,
    NavbarComponent,
    SidebarComponent,
    UniversitiesComponent,
    UniversitiesFormComponent,
    OrganizationalUnitsComponent,
    OrganizationalUnitsFormComponent,
    RepresentativesComponent,
    RepresentativesFormComponent,
    ActivityManagersComponent,
    ActivityManagersFormComponent,
    ReviewersComponent,
    ReviewersFormComponent,
    DeadlineComponent,
    DeadlineFormComponent,
    TypeEvidencesComponent,
    TypeEvidencesFormComponent,
    TypeActivitiesComponent,
    TypeActivitiesFormComponent,
    ActivitiesComponent,
    ActivitiesFormComponent,
    EvidencesComponent,
    EvidencesFormComponent,
    DashboardComponent,
    ChangePasswordComponent,
    ConstancyComponent,
    TotalAttendeesFormComponent,
    ProfileComponent,
    TablePaginationComponent,
    Http404Component,
    TablePaginationComponent,
    InputSearchComponent,
    PresentersModalComponent,
    ChangePasswordDialogComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    //NgSwitcheryModule, Falta la libreria
    //NgSelect2Module, Falta la libreria
    HttpClientModule,
    //NgxPrintModule, Falta la libreria
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
})
export class PortalModule {}
