import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { Http404Component } from './http404/http404.component';
import { PortalGuard } from './portal/guards/portal.guard';

const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('./portal/portal.module').then(x => x.PortalModule),
    canActivate: [PortalGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Http404Component,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
