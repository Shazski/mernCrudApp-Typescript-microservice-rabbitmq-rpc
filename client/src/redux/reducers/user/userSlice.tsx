import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editUser, getLoggedInUserDetails, userLogin, userLogout, userSignUp } from "../../actions/user/userActions";
import { IformTypes } from "../../../types/formTypes"; // Replace with your actual type
import {toast} from "react-toastify"
export const userSlice = createSlice({
    name: "user",
    initialState: {
        error: null as string | null,
        user: null as IformTypes | null, 
        loading: false,
    },
    reducers: {
        
    },
    extraReducers(builder) {
        builder
            .addCase(userSignUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(userSignUp.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload as IformTypes;
            })
            .addCase(userSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
                console.log(action.payload, "signup error")
                state.user = null;
            })
            .addCase(getLoggedInUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLoggedInUserDetails.fulfilled, (state, action: PayloadAction<IformTypes>) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getLoggedInUserDetails.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(userLogin.pending, (state) => {
                state.loading = true
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload
                state.error = null
            })
            .addCase(userLogin.rejected, (state, {payload}) => {
                state.loading = false
                state.user = null
                state.error = payload as string
            }).addCase(userLogout.pending, (state) => {
                state.loading = true
            })
            .addCase(userLogout.fulfilled, (state) => {
                state.user = null
                state.loading = false
                state.error = null
            })
            .addCase(userLogout.rejected, (state, {payload}) => {
                state.error = payload as string
                state.user = null
                state.loading = false
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
              })
              .addCase(editUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
                state.user = payload;
                toast.success("Profile Updated");
              })
              .addCase(editUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.user = null;
                state.error = payload as string
              });
    },
});

export default userSlice.reducer;
