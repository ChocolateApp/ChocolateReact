import loading from "./images/loader.gif";
import "./App.css";

function Loading() {
    return (
        <div className="App">
            <div className="loaderBackground" id="loaderBackground"></div>
            <img className="spinner" id="spinner" src={loading} alt="Loading..." />
        </div>
        );
}

export default Loading;
