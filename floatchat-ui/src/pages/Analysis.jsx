import React from "react";

function Analysis() {
  return (
    <iframe
      src="http://127.0.0.1:5500/index.html"
      title="Disaster Management Map"
      width="100%"
      height="100%"
      className="rounded-2xl shadow-lg"
      style={{ border: "none", minHeight: "600px" }}
    />
  );
}

export default Analysis;
