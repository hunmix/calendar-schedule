import { Schedule } from "gantt-scheduler-timeline";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const scheduleRef = useRef<Schedule | null>(null);
  useEffect(() => {
    if (!scheduleRef.current) {
      const schedule = new Schedule("canvas", {
        autoFit: true,
        startDate: "2024-03-20",
        endDate: "2024-06-10",
        columnWidth: 50,
        unitWidth: 20,
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
        tasks: [
          {
            id: "1",
            resourceId: "1",
            title: "title1",
            start: "2024-03-23 14:09",
            end: "2024-03-25 21:09",
            name: "name1",
            type: "type1",
          },
          {
            id: "2",
            resourceId: "2",
            title: "title2",
            start: "2024-04-02 16:09",
            end: "2024-04-06 21:09",
            name: "name2",
            type: "type2",
          },
          {
            id: "3",
            resourceId: "3",
            title: "title1",
            start: "2024-05-01",
            end: "2024-05-03",
            name: "name1",
            type: "type1",
          },
          {
            id: "4",
            resourceId: "1",
            title: "title4",
            start: "2024-05-01",
            end: "2024-05-03",
            name: "name4",
            type: "type1",
          },
          {
            id: "5",
            resourceId: "10",
            title: "title5",
            start: "2024-05-01",
            end: "2024-05-03",
            name: "name5",
            type: "type1",
          },
        ],
        resources: [
          {
            id: "1",
            name: "A",
            tag: "tag1",
          },
          {
            id: "2",
            name: "B",
            tag: "tag2",
          },
          {
            id: "3",
            name: "C",
            tag: "tag3",
          },
          {
            id: "4",
            name: "D",
            tag: "tag4",
          },
          {
            id: "5",
            name: "E",
            tag: "tag5",
          },
          {
            id: "6",
            name: "F",
            tag: "tag6",
          },
          {
            id: "7",
            name: "G",
            tag: "tag7",
          },
          {
            id: "8",
            name: "H",
            tag: "tag8",
          },
          {
            id: "9",
            name: "I",
            tag: "tag9",
          },
          {
            id: "10",
            name: "J",
            tag: "tag10",
          },
          {
            id: "11",
            name: "K",
            tag: "tag11",
          },
        ],
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
    </div>
  );
};

export default App;
