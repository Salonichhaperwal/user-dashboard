import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  address: { city: string; street: string; zipcode: string };
  company: { name: string };
}

interface UserState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserState = {
  users: [],
  status: "idle",
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  console.log('response :>> ', response)
  return response.data;
});

export const reorderUsers = createAction<{ from: number; to: number }>(
  "user/reorderUsers"
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUser: (
      state,
      action: PayloadAction<{ id: number; name: string; email: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.name = action.payload.name;
        user.email = action.payload.email;
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reorderUsers, (state, action) => {
        const { from, to } = action.payload;
        const newUsers = [...state.users];
        const [removed] = newUsers.splice(from, 1);
        newUsers.splice(to, 0, removed);
        state.users = newUsers;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })
      // .addCase(reorderUsers, (state, action) => {
      //   // Reorder users based on the new order of IDs
      //   const newOrder = action.payload;
      //   const updatedUsers = newOrder
      //     .map((id) => state.users.find((user) => user.id === id))
      //     .filter(Boolean) as User[];

      //   state.users = updatedUsers;
      // });
  },
});

export const { updateUser, addUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
