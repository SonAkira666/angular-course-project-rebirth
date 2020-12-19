import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authServ: AuthService, private router: Router) {};
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authServ.user.pipe(take(1), map(user => {
      const isAuth = !!user;
      if (isAuth) return true;
      alert('Ti devi autenticare per vedere le ricette segrete!');
      return this.router.createUrlTree(['/authentication']);
    }));
  }
}
