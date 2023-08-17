import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";
interface DataType {
    stt: string;
    ma_goi: string;
    ten_goi: string;
    ngay_apdung: string;
    ngay_hethan: string;
    gia_ve: string;
    gia_combo: string;
    tinh_trang: string;
  }
  
export const themGoi = createAsyncThunk(
  "themgoi/themgoi",
  async (data: DataType) => {
    try {
      await addDoc(collection(db, "Danhsachgoive"), data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const themgoiSlice = createSlice({
  name: "list",
  initialState: {
    dataList: [] as DataType[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(themGoi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(themGoi.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(themGoi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});

export default themgoiSlice.reducer;
