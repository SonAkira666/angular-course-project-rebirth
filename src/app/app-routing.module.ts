import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoDetailComponent } from './recipes/no-detail/no-detail.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: NoDetailComponent, pathMatch: 'full' },
    { path: 'new', component: RecipeEditComponent },
    { path: ':id', component: RecipeDetailComponent , resolve: {RecipesResolverService} },
    { path: ':id/edit', component: RecipeEditComponent , resolve: {RecipesResolverService}}
  ] },
  { path: 'authentication', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
