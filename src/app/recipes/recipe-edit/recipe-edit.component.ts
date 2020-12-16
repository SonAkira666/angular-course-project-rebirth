import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recServ: RecipesService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recServ.getRecipes()[this.id];
      recipeName = recipe.name;
      recipeImgPath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(this.createIngredientForm(ingredient.name, ingredient.amount));
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(this.createIngredientForm());
  }
  onSubmit() {
    const recipe = new Recipe(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imgPath,
      this.recipeForm.value.ingredients);
    if (this.editMode) {
      this.recServ.updateRecipe(this.id, recipe);
    } else {
      this.recServ.addRecipe(recipe);
    }

    this.onCancel();
  }
  createIngredientForm(name: string = null, amount: number = null): FormGroup {
    return new FormGroup({
        'name': new FormControl(name, Validators.required),
        'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
  }
  onCancel() {
    this.router.navigate(['/recipes']);
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

}
