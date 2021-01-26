import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { AuthResponseData, AuthService } from '../auth.service';
import { User } from '../user.model';

@Injectable()
export class AuthEffects {
  static errorMessages = {
    'EMAIL_EXISTS': 'This email exists already!',
    'EMAIL_NOT_FOUND': 'Non c\'è sto tizio',
    'INVALID_PASSWORD': 'Password sbagliatissima!'
  }

  @Effect()
  authSignup = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        map(resData => {
          return this.handleAuthentication(resData);
        }),
        catchError(errorResponse => {
          return this.handleError(errorResponse);
        })
      );
    })
  );

  @Effect()
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((data: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: data.payload.email,
          password: data.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return this.handleAuthentication(resData);
        }),
        catchError(errorResponse => {
          return this.handleError(errorResponse);
        })
      );
    })
  );

  @Effect()
  autoLogin = this.actions.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) return {type: 'DUMMY'};
      const loadedUser: User = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      if (loadedUser.token) {
        this.authServ.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      }
      return {type: 'DUMMY'};
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((actionData: AuthActions.AuthenticateSuccess) => {
      if (actionData.payload.redirect) this.router.navigate(['/recipes']);
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
      this.authServ.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  constructor(private actions: Actions, private http: HttpClient, private router: Router, private authServ: AuthService) {}

  handleAuthentication(resData: AuthResponseData) {
    const expirationDate = new Date(new Date().valueOf() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authServ.setLogoutTimer(+resData.expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate: expirationDate,
      redirect: true
    });
  }
  handleError(errorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (errorResponse.error && errorResponse.error.error && AuthEffects.errorMessages[errorResponse.error.error.message]) {
      errorMessage = AuthEffects.errorMessages[errorResponse.error.error.message];
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
