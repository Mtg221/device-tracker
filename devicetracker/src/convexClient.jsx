import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createContext, useContext } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexProviderWrapper({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export function useConvexClient() {
  return useContext(ConvexReactClient.Context);
}