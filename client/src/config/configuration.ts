import { AxiosError } from 'axios';
export interface MyApiError {
    errorMessage: string;
  }
export const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  
  export const handleError = (error:AxiosError<MyApiError> , rejectWithValue:any) => {
    if (error.response && error.response.data.errorMessage) {
      console.log(error.response.data.errorMessage);
  
      return rejectWithValue(error.response.data.errorMessage);
    } else {
      return rejectWithValue(error.message);
    }
  }