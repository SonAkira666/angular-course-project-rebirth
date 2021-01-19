import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  static errorMessages = {
    'EMAIL_EXISTS': 'This email exists already!',
    'EMAIL_NOT_FOUND': 'Non c\'è sto tizio',
    'INVALID_PASSWORD': 'Password sbagliatissima!'
  }
  private tokenExpirationTimer;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}
  /**
  * Ti iscrive, pensa che roba...
  * @param email Questa sembrerebbe quasi l'email con cui ti deve iscrivere.
  * @param password Questo argomento è una grande incognita...
  */
  signUp(email: string, password: string) {
    return this.postRequest('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, email, password);
  }
  login(email: string, password: string) {
    return this.postRequest('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, email, password);
  }
  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    const loadedUser: User = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));
      this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
    }
  }
  logout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/authentication']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  // Duration in milliseconds.
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  postRequest(reqUrl: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(reqUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(errorResponse => {
        let errorMessage = 'An unknown error occured!';
        if (errorResponse.error && errorResponse.error.error && AuthService.errorMessages[errorResponse.error.error.message]) {
          errorMessage = AuthService.errorMessages[errorResponse.error.error.message];
        }
        return throwError(errorMessage);
      }),
      tap(response => {
        const expirationDate = new Date(new Date().valueOf() + +response.expiresIn * 1000);
        const user = new User(response.email, response.localId, response.idToken, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
        // this.user.next(user);
        this.store.dispatch(new AuthActions.AuthenticateSuccess({email: user.email, userId: user.id, token: user.token, expirationDate: expirationDate}));
        this.autoLogout(+response.expiresIn *1000);
      })
    );
  }
}
