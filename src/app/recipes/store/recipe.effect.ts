import { HttpClient } from "@angular/common/http";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Injectable } from "@angular/core";

import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.actions';
import * as fromApp from 'src/app/store/app.reducer';

const recipesUrl = 'https://ng-course-project-512f2-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(recipesUrl);
    }),
    map(recipes => {
      const fixedRecipes = recipes.map(recipe => {return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};});
      return new RecipeActions.SetRecipes(fixedRecipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      const recipes = recipesState.recipes;
      return this.http.put(recipesUrl, recipes);
      }
    )
  );

  constructor(private actions: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
