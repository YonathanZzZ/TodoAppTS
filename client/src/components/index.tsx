import ReactDOM from 'react-dom/client';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {StrictMode} from "react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "../redux/store.tsx";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>

    </StrictMode>

);
