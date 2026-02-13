"use client";
import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/user.slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await fetch("/api/me").then((res) => res.json());
        dispatch(setUserData(result));
      } catch (error) {
        console.log(error);
      }
    };
    getMe();
  }, [dispatch]);
}

export default useGetMe;
