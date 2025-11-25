"use client";

import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<any>(null);

export function LoaderProvider({ children }: any) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
