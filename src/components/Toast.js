import { toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function toast(message) {
  toastify.success(message, {
    position: toastify.POSITION.TOP_CENTER,
    className: "p-5 text-green-500 bg-green-100 rounded w-full font-medium",
    autoClose: 5000
  });
}
