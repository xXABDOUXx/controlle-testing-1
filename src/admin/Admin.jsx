import Button from "./Button";
import startButton from "../assets/start-button.png";
import stopButton from "../assets/stop-button.png";
import top from "../assets/arrowhead-up.png";
import bottom from "../assets/down-arrow.png";
import left from "../assets/left-arrow.png";
import right from "../assets/right-arrow.png";
import Control from "./Control";
import { useState } from "react";
import logOut from "../assets/logout.png"


const Admin = () => {
  const [word, setWord] = useState("Hello in our project");
  return (
    <div className="flex">
      <div className="h-svh w-[300px] bg-cyan-500 p-5 drop-shadow-xl">
        <div className=" bg-white w-full p-3 flex justify-between rounded-lg mb-20">
          <div className="w-8 h-8 bg-black rounded-full"></div>
          kebdani issam
        </div>
        <ul className="mb-5">
          <div onClick={() => setWord("start car")}>
            <Button body="Start car" img={startButton}></Button>
          </div>
          <div onClick={() => setWord("Stop car")}>
            <Button body="Stop car" img={stopButton}></Button>
          </div>
        </ul>
        <div className="grid grid-rows-3 grid-cols-3 mb-20">
          <Control />
          <div onClick={() => setWord("go ahead")}>
            <Control img={top} />
          </div>

          <Control />
          <div onClick={() => setWord("turn left")}>
            <Control img={left} />
          </div>
          <Control />
          <div onClick={() => setWord("turn right")}>
            <Control img={right} />
          </div>
          <Control />
          <div onClick={() => setWord("go back")}>
            <Control img={bottom} />
          </div>
        </div>
        <div className="flex bg-red-500 p-2 rounded-md cursor-pointer">
          <img src={logOut} alt="icon" className="w-8 mr-3"/>
          Log out
        </div>
      </div>
      <div className="flex justify-center items-center w-full text-7xl">
        {word}
      </div>
    </div>
  );
};

export default Admin;