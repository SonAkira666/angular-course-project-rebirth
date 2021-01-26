import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';
import * as RecipeActions from 'src/app/recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.userSub = this.store.select('auth').subscribe(response => {
      this.isAuthenticated = !!response.user;
    });
  }
  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }
  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
