import { take } from 'rxjs/operators';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['button {margin: 2px}']
})
export class AuthComponent {
  @ViewChild(PlaceholderDirective, {static: false}) placeholder: PlaceholderDirective;
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authServ: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}
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
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
        this.showAlert(errorMessage);
        console.log(errorMessage);
      }
    );

    form.reset();
  }
  onCloseAlert() {
    this.error = null;
  }
  showAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.placeholder.viewContainerRef;
    hostViewContainerRef.clear(); // Per ripulire qualunque cosa sia già renderizzata lì.
    const alertRef = hostViewContainerRef.createComponent(alertComponentFactory);
    alertRef.instance.message = message;
    alertRef.instance.close.pipe(take(1)).subscribe(() => hostViewContainerRef.clear());
  }
}
