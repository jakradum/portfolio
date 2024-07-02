import React from 'react';


const TimelineItem = ({ title, children }) => (
  <div className="timeline-item">
    <div className="timeline-item-content">
      <h3>{title}</h3>
      {children}
      <span className="circle" />
    </div>
  </div>
);

const VerticalTimeline = ({ items }) => {
  return (
    <div className="timeline-container">
      {items.map((item, index) => (
        <TimelineItem key={index} title={item.title}>
          {item.content}
        </TimelineItem>
      ))}
    </div>
  );
};

export default VerticalTimeline;