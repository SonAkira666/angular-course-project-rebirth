import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
/*   recipes: Recipe[] = [
    new Recipe('Pasta casassa',
      'A vey nice evergreen for topoli-mopoli.',
      'https://www.cucchiaio.it/content/cucchiaio/it/ricette/2019/12/spaghetti-al-pomodoro/jcr:content/header-par/image-single.img10.jpg/1576681061599.jpg',
      [new Ingredient('pasta', 100), new Ingredient('sassa', 1)]),
    new Recipe('Torta alla torta',
      'Una torta al gusto di torta, con un vago aroma di torta.',
      'https://www.handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg',
      [new Ingredient('torta', 1), new Ingredient('tipo torta', 2), new Ingredient('sempre torta', 17)])
  ]; */
  recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  getRecipes(): Recipe[] { return this.recipes.slice(); }
  addRecipe(newR: Recipe) {
    this.recipes.push(newR);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, updatedR: Recipe) {
    this.recipes[index] = updatedR;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
