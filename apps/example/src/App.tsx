import { Schedule } from "gantt-scheduler-timeline";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const scheduleRef = useRef<Schedule | null>(null);
  useEffect(() => {
    if (!scheduleRef.current) {
      const schedule = new Schedule("canvas");
      scheduleRef.current = schedule;
      console.log(schedule);
    }
    return () => {
      scheduleRef.current?.release();
      scheduleRef.current = null;
    };
  }, []);

  return (
    <div className="canvas-wrapper">
      <div id="canvas"></div>
    </div>
  );
};

export default App;
