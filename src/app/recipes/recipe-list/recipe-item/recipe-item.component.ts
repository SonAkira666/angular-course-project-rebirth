import { RecipesService } from './../../recipes.service';
import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from './../../recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() id = 0;

  constructor(private recipesService: RecipesService, private router: Router) { }

  ngOnInit(): void {
  }

  // onClick(): void {
  //   // this.recipesService.selectedRecipe.emit(this.recipe);
  //   this.router.navigate(['/recipes', this.id]);
  // }

}
