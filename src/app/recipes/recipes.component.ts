import { Component, OnInit } from '@angular/core';

import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipesService]
})
export class RecipesComponent implements OnInit {
  recipeInDetail: Recipe;

  constructor(private recipesService: RecipesService) {
    this.recipesService.selectedRecipe.subscribe((r: Recipe) => { this.recipeInDetail = r; });
  }
  ngOnInit(): void {
  }

}
