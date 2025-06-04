import React from "react";
import "../styles/PageTop.css";

const PageTop = ({ content, height }) => {
  return (
    <div className="pageTop-container" style={{ height: height }}>
      <h1>{content}</h1>
    </div>
  );
};

export default PageTop;