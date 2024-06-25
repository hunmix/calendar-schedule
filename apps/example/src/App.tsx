import { Schedule } from "gantt-scheduler-timeline";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "./App.css";

const clamp = (value: number, min: number, max: number, ) => {
  return Math.max(min, Math.min(max, value));
};

const App = () => {
  const scheduleRef = useRef<Schedule | null>(null);
  const generateResources = (count: number) => {
    const resources = [];
    for (let i = 0; i < count; i++) {
      resources.push({
        id: `${i}`,
        name: `${i}`,
        tag: `tag${i}`,
      });
    }
    return resources;
  };
  
  const generateRandomTasks = (count: number, start: string, end: string) => {
    const tasks = [];
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const dayDuration = endDate.diff(startDate, "day");
    for (let i = 0; i < count; i++) {
      const randomStartLength = Math.floor(Math.random() * dayDuration);
      const currentStartDate = startDate.add(randomStartLength, "days");
      tasks.push({
        id: `${i}`,
        resourceId: `${Math.floor(Math.random() * count)}`,
        title: `title${i}`,
        start: currentStartDate.format("YYYY-MM-DD"),
        end: currentStartDate
          .add(
            Math.ceil(Math.random() * clamp(dayDuration - randomStartLength, 2, 8)),
            "day"
          )
          .format("YYYY-MM-DD"),
        name: `name${i}`,
        type: `type1${i}`,
      });
    }
    return tasks;
  };
  useEffect(() => {
    if (!scheduleRef.current) {
      const schedule = new Schedule("canvas", {
        autoFit: true,
        startDate: "2024-03-20",
        endDate: "2024-06-10",
        columnWidth: 50,
        unitWidth: 30,
        autoUnitWidth: false,
        scrollbar: [
          {
            direction: "horizontal",
            visible: true,
            barWidth: 10,
          },
          {
            direction: "vertical",
            visible: true,
            barWidth: 10,
          },
        ],
        headers: [
          {
            unit: "month",
          },
          {
            unit: "day",
            format: "dd",
          },
        ],
        columns: [
          {
            title: "Name",
            field: "name",
            width: 100,
          },
          {
            title: "Tag",
            field: "tag",
            width: 120,
          },
        ],
        tasks: generateRandomTasks(200, "2024-03-20", "2024-06-10"),
        // tasks: [
        //   {
        //     id: "1",
        //     resourceId: "1",
        //     title: "title1",
        //     start: "2024-03-23 14:09",
        //     end: "2024-03-25 21:09",
        //     name: "name1",
        //     type: "type1",
        //   },
        //   {
        //     id: "2",
        //     resourceId: "2",
        //     title: "title2",
        //     start: "2024-04-02 16:09",
        //     end: "2024-04-06 21:09",
        //     name: "name2",
        //     type: "type2",
        //   },
        //   {
        //     id: "3",
        //     resourceId: "3",
        //     title: "title1",
        //     start: "2024-05-01",
        //     end: "2024-05-03",
        //     name: "name1",
        //     type: "type1",
        //   },
        //   {
        //     id: "4",
        //     resourceId: "1",
        //     title: "title4",
        //     start: "2024-05-01",
        //     end: "2024-05-03",
        //     name: "name4",
        //     type: "type1",
        //   },
        //   {
        //     id: "5",
        //     resourceId: "10",
        //     title: "title5",
        //     start: "2024-05-01",
        //     end: "2024-05-03",
        //     name: "name5",
        //     type: "type1",
        //   },
        // ],
        resources: generateResources(200),
      });
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
      <div id="canvas2"></div>
    </div>
  );
};

export default App;
