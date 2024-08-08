import React from "react";
export async function loader({ params }: { params: any }) {
  console.log("params", params);
  return null;
}

const route = () => {
  return <div>route</div>;
};

export default route;
