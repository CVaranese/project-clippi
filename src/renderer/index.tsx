import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Models, persistor, store } from "@/store";
import { App } from "./containers/App";

// tslint:disable-next-line: no-import-side-effect
import "./styles";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById("app")
);

// Hot reloading
if ((module as any).hot) {
  // Reload rematch models
    (module as any).hot.accept("./store/models", () => {
    Object.keys(Models).forEach(modelKey => {
      console.log(`Reloading model ${modelKey}`);
      store.model({
        name: modelKey,
        ...Models[modelKey]
      });
    });
  });
}
