import { createSlice } from "@reduxjs/toolkit"
import { adminLogin, adminLogout, getLoggedInAdmin } from "../../actions/admin/adminAction"

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        error: null as string | null,
        admin: null as {email:string} | null
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true
            })
            .addCase(adminLogin.fulfilled, (state, {payload}) => {
                state.loading = false
                state.admin = payload as {email:string}
            })
            .addCase(adminLogin.rejected, (state, {payload}) => {
                state.loading = false,
                state.admin = null,
                state.error = payload as string
            })
            .addCase(getLoggedInAdmin.pending, (state) => {
                state.loading = true
            })
            .addCase(getLoggedInAdmin.fulfilled, (state, {payload}) => {
                state.loading = false
                state.error = null
                state.admin = payload as {email:string}
            })
            .addCase(getLoggedInAdmin.rejected, (state, {payload}) => {
                state.loading = false,
                state.admin = null
            })
            .addCase(adminLogout.pending, (state) => {
                state.loading = true
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.loading = false
                state.error = null
                state.admin = null
            })
            .addCase(adminLogout.rejected, (state, {payload}) => {
                state.loading = false,
                state.admin = null,
                state.error = payload as string
            })
    },

})

export default adminSlice.reducer