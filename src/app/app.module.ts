import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ShoppingListModule,
    AuthModule,
    SharedModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer})
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
