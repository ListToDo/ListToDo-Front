import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import store from "store/store";
import App from "./App";

const reactQueryClient = new QueryClient();

ReactDOM.render(
    <BrowserRouter>
        <QueryClientProvider client={reactQueryClient}>
            <React.StrictMode>
                <Provider store={store}>
                    <App/>
                </Provider>
            </React.StrictMode>
        </QueryClientProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
