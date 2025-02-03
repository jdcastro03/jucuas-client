import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentersComponent } from './containers/presenters/presenters.component';
import { PresentersFormComponent } from './containers/presenters-form/presenters-form.component';
import { PortalComponent } from './portal.component';
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
import { ActivitiesFormComponent } from './containers/activities-form/activities-form.component';
import { EvidencesComponent } from './containers/evidences/evidences.component';
import { EvidencesFormComponent } from './containers/evidences-form/evidences-form.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { ConstancyComponent } from './containers/constancy/constancy.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { Http404Component } from '../http404/http404.component';

const routes: Routes = [
    {
        path: '',
        component: PortalComponent,
        children: [
            //Dashboard

            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent},
            // {path: '', redirectTo:'dashboard'},
            //Profile
            {path: 'change_password', component: ChangePasswordComponent},
            //ActivityManagers
            {path: 'activity-managers', component: ActivityManagersComponent},
            {path: 'activity-managers/:id', component: ActivityManagersFormComponent},
            //Presenters
            {path: 'presenters', component: PresentersComponent},
            {path: 'presenters/:id', component: PresentersFormComponent},
            //Universities
            {path: 'universities', component: UniversitiesComponent},
            {path: 'universities/:id', component: UniversitiesFormComponent},
            //OrganizationalUnits
            {path: 'organizational-units', component: OrganizationalUnitsComponent},
            {path: 'organizational-units/:id', component: OrganizationalUnitsFormComponent},
            //Representatives
            {path: 'representatives', component: RepresentativesComponent},
            {path: 'representatives/:id', component: RepresentativesFormComponent},
            //Constancy
            {path: 'constancy', component: ConstancyComponent},
            {path: 'constancy/:code', component: ConstancyComponent},
            //Reviewers
            {path: 'reviewers', component: ReviewersComponent},
            {path: 'reviewers/:id', component: ReviewersFormComponent},
            //Deadline
            {path: 'deadlines', component: DeadlineComponent},
            {path: 'deadlines/:id', component: DeadlineFormComponent},
            //TypeEvidences
            {path: 'type-evidences', component: TypeEvidencesComponent},
            {path: 'type-evidences/:id', component: TypeEvidencesFormComponent},
            //TypeActivities
            {path: 'type-activities', component: TypeActivitiesComponent},
            {path: 'type-activities/:id', component: TypeActivitiesFormComponent},
            //Activities
            {path: 'activities', component: ActivitiesComponent},
            {path: 'activities/:id', component: ActivitiesFormComponent},
            //Evidences
            {path: 'evidences', component: EvidencesComponent},
            {path: 'evidences/:id', component: EvidencesFormComponent},
            // Perfil
            {path: 'profile', component: ProfileComponent},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PortalRoutingModule {}
