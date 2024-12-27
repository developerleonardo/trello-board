import "./Loading.css";
import { trio } from "ldrs";

trio.register();

// Default values shown

const Loading = () => {
  return (
    <div className="loading">
      <l-trio size="80" speed="1.3" color="white"></l-trio>
      <h1>Preparing your Board</h1>
      <p>Setting up your boards...</p>
    </div>
  );
};

export { Loading };
