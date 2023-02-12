import { axios } from "src/api/axios";
import { logAxiosError } from "src/redux/notification";
import { store } from "src/redux/store";

const AuthService = {
  onAuth,
  guessMe,
};

export default AuthService;

interface GuessMeResponse {
  data: User;
}

async function guessMe(user: Pick<User, "id" | "type">) {
  try {
    const resp = await axios.post<GuessMeResponse>("/api/users/me", { user });
    return resp.data.data;
  } catch (err) {
    store.dispatch(logAxiosError(err, "Fetching user session"));
    throw err;
  }
}

interface OnAuthRequest {
  id: string;
  invite_token?: string;
  default_event?: string;
  route?: string;
  email?: string;
}

// Empty response body expected
interface OnAuthResponse {}

async function onAuth(authParams: OnAuthRequest): Promise<OnAuthResponse> {
  try {
    const resp = await axios.post<OnAuthResponse>("/api/on_auth", {
      ...authParams,
    });

    return resp.data;
  } catch (err) {
    store.dispatch(logAxiosError(err, "Preparing to authenticate"));
    throw err;
  }
}
