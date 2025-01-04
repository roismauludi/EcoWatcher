import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import React, { FC } from "react";
import { Windmill } from "@roketid/windmill-react-ui";
import type { AppProps } from "next/app";
import { AuthProvider, useAuth } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  const { user } = useAuth();

  return (
    <AuthProvider>
      <Windmill usePreferences={true}>
        <Component {...pageProps} />
      </Windmill>
      <div>{user ? `Logged in as ${user.email}` : "Not logged in"}</div>
    </AuthProvider>
  );
}
export default MyApp;
