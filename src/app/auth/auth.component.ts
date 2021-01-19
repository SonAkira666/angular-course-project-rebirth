import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['button {margin: 2px}']
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective, {static: false}) placeholder: PlaceholderDirective;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  storeSub: Subscription = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) this.showAlert(this.error);
    });
  }
  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    if (form.invalid) return;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }
    form.reset();
  }
  onCloseAlert() {
    this.store.dispatch(new AuthActions.ClearError());
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
