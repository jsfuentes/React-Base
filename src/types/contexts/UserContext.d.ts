interface UserContextType {
  user: User | null;
  updateUser:
    | null
    | ((freshUser?: User, shouldPatch?: boolean) => Promise<User | null>);
  userLoading: boolean;
  setUserLoading: null | React.Dispatch<React.SetStateAction<boolean>>;
  logout: null | ((shouldRefresh: boolean) => Promise<void>);
}
