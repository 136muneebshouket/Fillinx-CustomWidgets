import React from "react";
import { FC } from "react";

interface mainProps {
  className?: string;
}

const TapDayLogo: FC<mainProps> = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      data-name="Layer 2"
      viewBox="0 0 124.42 123.49"
      className={className}
    >
      <g id="Layer_1-2" fill="currentColor" data-name="Layer 1">
        <path
          d="M66.48 45.8h-8.54L55.1 0h14.22zM78.62 66.48v-8.54l45.8-2.84v14.22zM45.8 57.94v8.54L0 69.32V55.1zM76.83 53.63l-6.04-6.04 30.38-34.4 10.06 10.06zM53.63 47.59l-6.04 6.04-34.4-30.38 10.06-10.06zM62.3 123.49c-22.87 0-44.24-12.08-56.62-32.33l12.34-7.54c10.4 17.02 28.81 26.71 48.05 25.27 25.51-1.9 38.84-22.85 40.28-25.23l12.38 7.47c-1.83 3.04-18.84 29.74-51.59 32.18-1.62.12-3.23.18-4.84.18"
          className="cls-1"
        ></path>
      </g>
    </svg>
  );
};

export default TapDayLogo;
