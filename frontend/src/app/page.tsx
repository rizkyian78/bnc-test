"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import dynamic from "next/dynamic";

export default function App() {
  const queryClient = new QueryClient();

  const LoginPage = dynamic(() => import("@/pages/LoginPage"));

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}
