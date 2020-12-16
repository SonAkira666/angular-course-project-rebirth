import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['button {margin: 2px}']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authServ: AuthService) {}
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    let authObs: Observable<AuthResponseData>;

    console.log(form.value);
    if (form.invalid) return;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
      authObs = this.authServ.login(email, password);
    } else {
      authObs = this.authServ.signUp(email, password);
    }

    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.error = null;
        console.log(response);
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
        console.log(errorMessage);
      }
    );

    form.reset();
  }
}
