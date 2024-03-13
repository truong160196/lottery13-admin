import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MediaQueryProvider from "_common/component/MediaQueryProvider";
import NotifyProvider from "_common/component/NotifyProvider";

import "antd/dist/antd.css";
import "draft-js/dist/Draft.css";
import "remix-dls/lib/css/main.css";
import "_common/styles/styles.scss";
import "react-perfect-scrollbar/dist/css/styles.css";

import Root from "./Root";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <MediaQueryProvider>
        <NotifyProvider>
          <Root />
        </NotifyProvider>
      </MediaQueryProvider>
    </QueryClientProvider>
  );
}

export default App;
