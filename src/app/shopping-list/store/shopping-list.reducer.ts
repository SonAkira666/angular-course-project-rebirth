import { Ingredient } from "../../shared/ingredient.model";
import * as SLActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

export interface AppState {
  shoppingList: State
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
}

export function shoppingListReducer(state = initialState, action: SLActions.ShoppingListAction) {
  switch (action.type) {
    case SLActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    case SLActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      }
    case SLActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {...ingredient, ...action.payload};
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    case SLActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, index) => {
          return (index !== state.editedIngredientIndex)
        }),
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    case SLActions.START_EDIT:
      return {
        ...state,
        editedIngredient: {...state.ingredients[action.payload]},
        editedIngredientIndex: action.payload
      }
    case SLActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    default:
      return state;
  }
}
