import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { AuthResponseData } from '../auth.service';

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

  @Effect({dispatch: false})
  authSuccess = this.actions.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/recipes']);
    })
  );

  constructor(private actions: Actions, private http: HttpClient, private router: Router) {}

  handleAuthentication(resData: AuthResponseData) {
    const expirationDate = new Date(new Date().valueOf() + +resData.expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate});
  }
  handleError(errorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (errorResponse.error && errorResponse.error.error && AuthEffects.errorMessages[errorResponse.error.error.message]) {
      errorMessage = AuthEffects.errorMessages[errorResponse.error.error.message];
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
