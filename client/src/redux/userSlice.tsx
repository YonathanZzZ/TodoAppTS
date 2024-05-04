import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState{
    email: string;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    email: "",
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        login: (state, action: PayloadAction<{email: string}>) => {
            state.isLoggedIn = true;
            state.email = action.payload.email;
        },

        logout: () => {
            return initialState;
        },
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;