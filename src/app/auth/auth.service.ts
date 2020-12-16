import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  static errorMessages = {
    'EMAIL_EXISTS': 'This email exists already!',
    'EMAIL_NOT_FOUND': 'Non c\'è sto tizio',
    'INVALID_PASSWORD': 'Password sbagliatissima!'
  }

  constructor(private http: HttpClient) {}
  signUp(email: string, password: string) {
    return this.postRequest('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC2V1OMIXUbpUC8Hu5jbB1E-VTN1P6RQi4', email, password);
  }
  login(email: string, password: string) {
    return this.postRequest('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC2V1OMIXUbpUC8Hu5jbB1E-VTN1P6RQi4', email, password);
  }
  postRequest(reqUrl: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(reqUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(errorResponse => {
      let errorMessage = 'An unknown error occured!';
      if (errorResponse.error && errorResponse.error.error && AuthService.errorMessages[errorResponse.error.error.message]) {
        errorMessage = AuthService.errorMessages[errorResponse.error.error.message];
      }
      return throwError(errorMessage);
    }));
  }
}
