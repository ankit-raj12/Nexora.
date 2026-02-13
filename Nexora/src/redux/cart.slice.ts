import { ItemInterface } from "@/models/item.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Types } from "mongoose";

interface CartSliceInterface {
  cartData: ItemInterface[];
  subTotal: number;
  deliveryFee: number;
  totalAmount: number;
}

const initialState: CartSliceInterface = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  totalAmount: 40,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ItemInterface>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<Types.ObjectId | string>,
    ) => {
      const item = state.cartData.find((item) => item._id == action.payload);
      if (item) item.amount = item?.amount + 1;
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<Types.ObjectId | string>,
    ) => {
      const item = state.cartData.find((item) => item._id == action.payload);
      if (item && item.amount > 1) {
        item.amount = item?.amount - 1;
      } else {
        state.cartData = state.cartData.filter(
          (item) => item._id !== action.payload,
        );
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    deleteItem: (state, action: PayloadAction<Types.ObjectId | string>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload,
      );
      cartSlice.caseReducers.calculateTotal(state);
    },
    calculateTotal: (state) => {
      state.subTotal = state.cartData.reduce(
        (acc, curr) => acc + Number(curr.price) * curr.amount,
        0,
      );
      state.deliveryFee = state.subTotal > 100 ? 0 : 40;
      state.totalAmount = state.subTotal + state.deliveryFee;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
