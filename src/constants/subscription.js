import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useSubscription() {
  const { user } = useContext(AuthContext);

  return {
    user,
    isPlus: user?.subscription === "plus",
    isFree: user?.subscription === "free",
  };
}