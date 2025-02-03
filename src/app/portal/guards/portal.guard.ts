import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Location } from '@angular/common';
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";

@Injectable({
    providedIn: 'root',
})
export class PortalGuard implements CanActivate {
    
    constructor(private auth: AuthService, private router: Router, private location: Location) {}

    canActivate(): boolean {
        if (this.auth.isAuth()){
            return true;
        }
        else if (this.location.path().match('/portal/constancy/')){
            return true;
        }
        this.router.navigateByUrl('/auth/portal_login');
        return false;
    }
}