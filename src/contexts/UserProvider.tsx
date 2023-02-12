import * as Sentry from "@sentry/react";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthService from "src/api/AuthService";
import { axios } from "src/api/axios";
import UserContext from "src/contexts/UserContext";
const debug = require("debug")("app:UserProvider");

const LOCAL_STORAGE_UID_KEY = "uid";

interface UserProviderProps {
  children: React.ReactNode;
}

export default function UserProvider(props: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  //Priority cookie, storage, random id
  const getCreateUser = useCallback(async () => {
    //1 Client guesses identity
    let clientUserGuess;
    const uid = localStorage.getItem(LOCAL_STORAGE_UID_KEY);
    if (uid) {
      clientUserGuess = { id: uid, type: "anon" };
    } else {
      clientUserGuess = { id: nanoid(), type: "anon" };
    }

    //2 Server assigns identity and sets session
    try {
      const newUser = await AuthService.guessMe(clientUserGuess);
      return newUser;
    } catch (err) {
      return null;
    }
  }, []);

  //only patch when it didnt just come out of the server and an update is likely
  const updateUser = useCallback(
    async (freshUser: User | undefined = undefined, shouldPatch = false) => {
      const newUser = freshUser ? freshUser : await getCreateUser();
      debug("Curuser: ", newUser);

      if (!newUser) {
        return null;
      }

      setUser(newUser);
      setUserLoading(false);
      Sentry.configureScope((scope) => {
        if (newUser.email) {
          scope.setUser({ email: newUser.email, id: newUser.id });
        } else {
          scope.setUser({ id: newUser.id });
        }
      });

      //also must have freshUser because of js defaults, so cant be true without freshUser given
      if (shouldPatch && newUser.id) {
        try {
          await axios.patch(`/api/users/${newUser.id}`, {
            user: newUser,
          });
        } catch (err) {
          toast.error("Updating user failed");
          console.error("Updating user");
        }
      }

      return newUser;
    },
    [getCreateUser]
  );

  const logout = useCallback(
    async (shouldRefresh = true) => {
      try {
        await axios.post("/api/users/logout");
      } catch (err) {
        toast.error("Logging out failed");
        console.error("Logging out user");
      }

      if (shouldRefresh) {
        debug("Navigation Debug - logout");
        window.location.reload();
      } else {
        await updateUser();
      }
      debug("Logout");
    },
    [updateUser]
  );

  useEffect(() => {
    updateUser();
    //on mount only fetch the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //notice localstorage isn't cleared on logout
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(LOCAL_STORAGE_UID_KEY, user.id);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        userLoading,
        setUserLoading,
        logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
