import { Provider } from "react-redux";
import reduxStore from "../lib/store";
import "../styles/globals.css";

//@ts-ignore
function App({ Component, pageProps }) {
  return (
    <Provider store={reduxStore()}>
      <div className="py-6 relative bg-gray-50">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default App;
