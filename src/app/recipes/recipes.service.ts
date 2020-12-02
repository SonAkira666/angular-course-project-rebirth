import { EventEmitter, Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipesService {
  recipes: Recipe[] = [
    new Recipe('Pasta casassa',
      'A vey nice evergreen for topoli-mopoli.',
      'https://www.cucchiaio.it/content/cucchiaio/it/ricette/2019/12/spaghetti-al-pomodoro/jcr:content/header-par/image-single.img10.jpg/1576681061599.jpg',
      [new Ingredient('pasta', 100), new Ingredient('sassa', 1)]),
    new Recipe('Torta alla torta',
      'Una torta al gusto di torta, con un vago aroma di torta.',
      'https://www.handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg',
      [new Ingredient('torta', 1), new Ingredient('tipo torta', 2), new Ingredient('sempre torta', 17)])
  ];
  selectedRecipe = new EventEmitter<Recipe>();

  getRecipes(): Recipe[] { return this.recipes.slice(); }
}
