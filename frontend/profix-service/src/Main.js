import MainRoutes from "./MainRoutes";
import { useState, useEffect } from "react";
function Main() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/ping`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);
  return (
    <MainRoutes />
    //   <TestAPI/>
    // <h1>welcome to my web AAA</h1>
    //     <h1>{message}</h1>
  );
}

export default Main;
