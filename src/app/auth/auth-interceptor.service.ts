import { exhaustMap, map, take } from 'rxjs/operators';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(data => {return data.user;}),
      exhaustMap(user => {
        if (!user) return next.handle(req);
        const modReq = req.clone({params: req.params.append('auth', user.token)});
        return next.handle(modReq);
      })
    );
  }
}
