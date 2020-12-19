import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipesService } from "../recipes/recipes.service";
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesUrl = 'https://ng-course-project-512f2-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient, private recServ: RecipesService, private authServ: AuthService) {}
  storeRecipes() {
    const recipes = this.recServ.getRecipes();
    this.http.put(this.recipesUrl, recipes).subscribe(response => {
      console.log(response);
    });
  }
  fetchRecipes() {
    return this.http.get<Recipe[]>(this.recipesUrl).pipe(
      map(recipes => {
        return recipes.map(recipe => {return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};});
      }),
      tap(recipes => {
        this.recServ.setRecipes(recipes);
      })
    );
  }
}
