import React, { useEffect, useState } from "react";

function Timer() {
  let defaultTimer = {
    minutes: 25,
    seconds: 0,
    totalSeconds: 1500,
    currentTimer: null,
    type: "Work",
    isWorkTimerCompleted: false,
    isBreakTimerCompleted: false,
  };
  const [timer, setTimer] = useState(defaultTimer);
  const [userInput, setUserInput] = useState({
    workVal: defaultTimer.minutes,
    breakVal: defaultTimer.seconds,
  });

  const defaultStatus = {
    isStarted: false,
    isStopped: true,
    isReseted: true,
  };
  const [timerStatus, setTimerStatus] = useState(defaultStatus);

  function formatTimer(input, type) {
    return {
      ...timer,
      minutes: Math.floor(input),
      seconds: (input * 60) % 60,
      totalSeconds: input * 60,
      currentTimer: null,
      type: type === "Work" ? "Work" : "Break",
    };
  }

  function timerHandle(totalSeconds) {
    let min = Math.floor(totalSeconds / 60);
    let sec = totalSeconds % 60;

    setTimer({
      ...timer,
      minutes: min,
      seconds: sec,
      totalSeconds: totalSeconds,
    });
  }

  function handleInput(e) {
    const {name, value} = e.target
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTimer(formatTimer(userInput.workVal, timer.type));
  }

  function handleTimerStatus(e) {
    switch (e.target.name) {
      case "isStarted":
        return setTimerStatus({
          isStarted: true,
          isStopped: false,
          isReseted: false,
        });
      case "isStopped":
        return setTimerStatus({
          isStarted: false,
          isStopped: true,
          isReseted: false,
        });
      case "isResetted":
        return setTimerStatus(defaultStatus);
      default:
        return setTimerStatus(defaultStatus);
    }
  }

  useEffect(() => {
    console.log("mounted")
    let totalSeconds = timer.minutes * 60 + timer.seconds;

    if (timerStatus.isStarted) {
      timer.currentTimer = setInterval(() => {
        timerHandle(--totalSeconds);

        if (totalSeconds === 0) {
          clearInterval(timer.currentTimer);
          alert(`${timer.type} Timer Completed`);
          setTimer(formatTimer(userInput.breakVal, "Break"));
          setTimerStatus({
            isStarted: true,
            isStopped: false,
            isReseted: false,
          });

          if (timer.type === "Break") {
            setTimer(defaultTimer);
            setTimerStatus(defaultStatus);
            setUserInput({
              workVal: defaultTimer.minutes,
              breakVal: defaultTimer.seconds,
            });
          }
        }
      }, 1000);
    }

    if (timerStatus.isStopped) {
      clearInterval(timer.currentTimer);
    }

    if (timerStatus.isReseted) {
      setTimer(defaultTimer);
    }
  }, [timerStatus]);


  return (
    <div style={{ justifyItems: "center" }}>
      <div>
        <h1>
          {timer.minutes.toString().length == 1
            ? 0 + timer.minutes.toString()
            : timer.minutes.toString()}
          :
          {timer.seconds.toString().length == 1
            ? 0 + timer.seconds.toString()
            : timer.seconds.toString()}
        </h1>
        <h1>{timer.type} - Time</h1>
        <button
          disabled={timerStatus.isStarted}
          name="isStarted"
          onClick={handleTimerStatus}
        >
          Start
        </button>
        <button
          disabled={timerStatus.isStopped}
          name="isStopped"
          onClick={handleTimerStatus}
        >
          Stop
        </button>
        <button
          disabled={timerStatus.isReseted}
          name="isResetted"
          onClick={handleTimerStatus}
        >
          Reset
        </button>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="workVal"
            value={userInput.workVal}
            onChange={handleInput}
          />
          <input
            type="number"
            name="breakVal"
            value={userInput.breakVal}
            onChange={handleInput}
          />
          <button>Set</button>
        </form>
      </div>
    </div>
  );
}

export default Timer;
