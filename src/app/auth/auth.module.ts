import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { PortalLoginComponent } from './containers/portal-login/portal-login.component';
import { AuthComponent } from './auth.component';
import { PortalRecoveryComponent } from './containers/portal-recovery/portal-recovery.component';
import { PortalTokenComponent } from './containers/portal-token/portal-token.component';

@NgModule({
  declarations: [
    AuthComponent,
    PortalLoginComponent,
    PortalRecoveryComponent,
    PortalTokenComponent
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule { }
