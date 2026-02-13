import { createSlice } from "@reduxjs/toolkit";

interface UserInterface {
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

interface UserSliceInterface {
  userData: UserInterface | null;
}

const initialState: UserSliceInterface = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
