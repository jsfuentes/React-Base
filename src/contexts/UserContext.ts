import React from "react";

const UserContext = React.createContext<UserContextType>({
  user: null,
  updateUser: null,
  userLoading: true,
  setUserLoading: null,
  logout: null,
});

export default UserContext;
