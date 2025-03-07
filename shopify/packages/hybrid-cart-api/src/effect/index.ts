import * as CartAdd from "./api/CartAdd.js";
import * as CartChange from "./api/CartChange.js";
import * as CartClear from "./api/CartClear.js";
import * as CartGet from "./api/CartGet.js";
import * as CartUpdate from "./api/CartUpdate.js";
import * as CartDiscountsUpdate from "./api/CartDiscountsUpdate.js";

export namespace add {
  export type Input = CartAdd.AddInput;
}
export const add = CartAdd.make;

export namespace change {
  export type Input = CartChange.ChangeInput;
}
export const change = CartChange.make;

export namespace clear {
  export type Input = CartClear.ClearInput;
}
export const clear = CartClear.make;

export namespace get {
  export type Input = CartGet.GetInput;
}
export const get = CartGet.make;

export namespace update {
  export type Input = CartUpdate.UpdateInput;
}
export const update = CartUpdate.make;

export namespace discounts {
  export type update = {
    Input: CartDiscountsUpdate.UpdateDiscountsInput;
  };
}

export const discounts = {
  update: CartDiscountsUpdate.make,
};
