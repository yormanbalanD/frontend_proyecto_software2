import React, { useEffect } from "react";
import Local from "../view/Local";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function local() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log(params);
  }, []);


  return <Local />;
}
