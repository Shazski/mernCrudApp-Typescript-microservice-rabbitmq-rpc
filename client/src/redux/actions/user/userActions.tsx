import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios'
import { MyApiError, config, handleError } from "../../../config/configuration";
import { IformTypes } from "../../../types/formTypes";


export const userSignUp = createAsyncThunk('user/userSignUp', async (userCredentials: IformTypes, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:3000/api/user/register', userCredentials, config)
    return data
  } catch (error) {
    const axiosError = error as AxiosError<MyApiError>;
    return handleError(axiosError, rejectWithValue);
  }
})

export const getLoggedInUserDetails = createAsyncThunk('user/getLoggedInUserDetails', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/user", config)
    return data
  } catch (error) {
    const axiosError = error as AxiosError<MyApiError>;
    return handleError(axiosError, rejectWithValue);
  }
})

export const userLogin = createAsyncThunk('user/userLogin', async (userCredentials: { email: string, password: string }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:3000/api/user/login', userCredentials, config)
    return data
  } catch (error) {
    const axiosError = error as AxiosError<MyApiError>;
    return handleError(axiosError, rejectWithValue);
  }
})

export const userLogout = createAsyncThunk('user/userLogout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/user/logout', config)
    return data
  } catch (error) {
    const axioError = error as AxiosError<MyApiError>
    return handleError(axioError, rejectWithValue)
  }
})

export const editUser = createAsyncThunk('user/editUser', async (userCredentials:IformTypes, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/api/user/edit-user`,userCredentials,config)
    return data
  } catch (error) {
    const axioError = error as AxiosError<MyApiError>
    return handleError(axioError, rejectWithValue)
  }
}
)