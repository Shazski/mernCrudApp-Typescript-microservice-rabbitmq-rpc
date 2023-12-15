import { createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { MyApiError, config, handleError } from "../../../config/configuration"

export const adminLogin = createAsyncThunk('admin/adminLogin', async (adminCredentials:{email:string,password:string}, { rejectWithValue }) => {
    try {
        const { data } = await axios.post("http://localhost:3001/api/admin/login", adminCredentials, config)
        return data
    } catch (error) {
        const axioError = error as AxiosError<MyApiError>
        return handleError(axioError, rejectWithValue)
    }

})

export const getLoggedInAdmin = createAsyncThunk('user/getLoggedInAdmin', async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/admin", config)
      return data
    } catch (error) {
      const axiosError = error as AxiosError<MyApiError>;
      return handleError(axiosError, rejectWithValue);
    }
  })