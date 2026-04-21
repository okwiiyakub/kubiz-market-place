import { useEffect, useState } from "react";
import api from "../api/api";

function Home() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("welcome/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to connect to backend.");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Kubiz Market Place Home Page
      </h1>

      {error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : (
        <p className="text-gray-700 text-xl">{message}</p>
      )}
    </div>
  );
}

export default Home;