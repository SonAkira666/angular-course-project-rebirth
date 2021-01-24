import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  private userSub: Subscription;

  constructor(private dataServ: DataStorageService, private authServ: AuthService, private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.userSub = this.store.select('auth').subscribe(response => {
      this.isAuthenticated = !!response.user;
    });
  }
  onLogout() {
    // this.authServ.logout();
    this.store.dispatch(new AuthActions.Logout());
  }
  onSaveData() {
    this.dataServ.storeRecipes();
  }
  onFetchData() {
    this.dataServ.fetchRecipes().subscribe();
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
