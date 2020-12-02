import { Ingredient } from '../shared/ingredient.model';

export class Recipe
{
  // public static counter = 0;
  // public id: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[])
  {
    // this.id = Recipe.counter++;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
