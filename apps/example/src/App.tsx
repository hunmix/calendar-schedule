import { Schedule } from "gantt-scheduler-timeline";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const scheduleRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (scheduleRef.current) {
      const schedule = new Schedule(scheduleRef.current);
      console.log(schedule);
    }
  }, []);

  return <div ref={scheduleRef}>1321</div>;
};

export default App;
