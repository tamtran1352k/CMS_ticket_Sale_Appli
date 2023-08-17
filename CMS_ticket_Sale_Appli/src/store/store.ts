import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import themgoiSlice from"../redecers/themgoi";
const store = configureStore({
  reducer: {
  themgoi:themgoiSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
