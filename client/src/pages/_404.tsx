import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="h-[calc(100dvh)] flex flex-col items-center justify-center p-4">
      <div className="text-6xl sm:text-8xl dark:text-white font-extrabold mb-4 animate-bounce">
        404
      </div>
      <p className="text-lg sm:text-xl dark:text-gray-300 text-gray-700 text-center mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="flex items-center text-red-500 font-semibold underline hover:text-red-700 transition-colors text-sm sm:text-base"
      >
        <FaHome className="mr-2" />
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
