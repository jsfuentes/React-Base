import { combineReducers, configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./notification";

const rootReducer = combineReducers({
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
