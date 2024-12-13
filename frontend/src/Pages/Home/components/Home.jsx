import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import style from "../css/Home.module.scss";
import { InputState } from "../Context/inputState.js";
import ForecastWeather from "./ForecastWeather.jsx";
import OneDayWeather from "./OneDayWeather.jsx";
import FollowedCitiesOverlayMenu from "./FollowedCitiesOverlayMenu.jsx";

export const InputStateInterface = createContext();
export const OnSubmitContext = createContext();

const defaultState = new InputState("Moscow", "RU", 55.75, 37.62);

export default function Home() {
  const [selectedMode, setSelectedMode] = useState("city"); // "city" | "coordinates"
  const [inputState, setInputState] = useState();
  const [currentWeatherView, setCurrentWeatherView] = useState("today"); // "today" | "forecast"
  const [overLayOpen, setOverLayOpen] = useState(false);
  const inputInterfaceRef = useRef();

  const handleSubmit = useCallback(async ({ inputState, selectedMode }) => {
    console.log(`Submit`);
    console.dir(inputState);
    setInputState(inputState);
    setSelectedMode(selectedMode);
  }, []);

  useEffect(() => {
    // set default input state
    setInputState(defaultState);
    if (inputInterfaceRef.current)
      inputInterfaceRef.current.setInputState(defaultState);
  }, []);

  return (
    <InputStateInterface.Provider
      value={{ inputInterfaceRef, masterState: inputState }}
    >
      <OnSubmitContext.Provider value={handleSubmit}>
        <div className={style["home"]}>
          <label className={style["switch-mode-radio"]}>
            <span>Today</span>
            <input
              type="radio"
              name="View"
              checked={currentWeatherView === "today"}
              value={"today"}
              onChange={({ target }) => setCurrentWeatherView(target.value)}
            />
          </label>
          <label className={style["switch-mode-radio"]}>
            <span>Forecast</span>
            <input
              type="radio"
              name="View"
              checked={currentWeatherView === "forecast"}
              value={"forecast"}
              onChange={({ target }) => setCurrentWeatherView(target.value)}
            />
          </label>

          {currentWeatherView === "today" ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                setOverLayOpen(true);
              }}
            >
              Followed cities
            </button>
          ) : (
            <></>
          )}
          {overLayOpen && currentWeatherView === "today" ? ( // show that overlay menu only in "today" mode
            <FollowedCitiesOverlayMenu onClose={() => setOverLayOpen(false)} />
          ) : (
            <></>
          )}

          {currentWeatherView === "today" ? (
            <OneDayWeather
              inputState={inputState}
              selectedMode={selectedMode}
            />
          ) : currentWeatherView === "forecast" ? (
            <ForecastWeather
              inputState={inputState}
              selectedMode={selectedMode}
              enabled={true}
            />
          ) : (
            <></>
          )}
        </div>
      </OnSubmitContext.Provider>
    </InputStateInterface.Provider>
  );
}
