import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { PortalLoginComponent } from './containers/portal-login/portal-login.component';
import { PortalRecoveryComponent } from './containers/portal-recovery/portal-recovery.component';
import { PortalTokenComponent } from './containers/portal-token/portal-token.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'portal_login',
        component: PortalLoginComponent,
      },
      {
        path: 'recovery',
        component: PortalRecoveryComponent,
      },
      {
        path: 'portal_recovery/token',
        component: PortalTokenComponent,
      },
      {
        path: '**',
        redirectTo: 'portal_login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
