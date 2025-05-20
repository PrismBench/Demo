/**
 * Renders an animated background graphic featuring blurred, colored balls
 * that move and bounce within the SVG area. The colors of the balls cycle
 * over time, creating a dynamic rainbow effect. This component is intended
 * to be used as the underlying graphic within the `LogoShell`.
 */
import React, { useEffect, useState } from "react";
import { useMantineColorScheme } from "@mantine/core";

/**
 * Represents the state of a single animated ball.
 */
interface Ball {
  /** Unique identifier for the ball. */
  id: number;
  /** Current horizontal position (x-coordinate). */
  x: number;
  /** Current vertical position (y-coordinate). */
  y: number;
  /** Radius of the ball. */
  size: number;
  /** Horizontal velocity component. */
  dx: number;
  /** Vertical velocity component. */
  dy: number;
  /** Base speed multiplier. */
  speed: number;
  /** Magnitude of speed variation over time. */
  speedVariation: number;
  /** Phase offset for the sinusoidal speed variation. */
  speedPhase: number;
  /** Current color in HSL format. */
  color: string;
  /** Rate at which the hue of the color changes over time. */
  colorSpeed: number;
  /** Initial hue offset for the color cycle. */
  colorOffset: number;
}

/**
 * Props for the Rainbow component.
 */
interface RainbowProps {
  /** @deprecated Background color is now determined by Mantine's color scheme. */
  background?: "black" | "white";
}

/**
 * An SVG graphic component displaying animated, color-shifting, blurred balls.
 *
 * This component manages the state and animation logic for multiple `Ball` objects.
 * It uses `useEffect` hooks to initialize the balls and run the animation loop,
 * updating positions and colors over time based on state variables and trigonometric functions.
 * The background color adapts to the current Mantine color scheme.
 *
 * @param {RainbowProps} props - The component props (currently unused or deprecated).
 * @returns {React.ReactElement} An SVG group element (`<g>`) containing the animated balls and blur filter definition.
 */
const Rainbow: React.FC<RainbowProps> = ({}) => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [time, setTime] = useState(0);
  const { colorScheme } = useMantineColorScheme();
  const background = colorScheme === "dark" ? "white" : "black";

  useEffect(() => {
    // Initialize balls with different sizes, positions, speeds, and colors
    const initialBalls: Ball[] = Array.from({ length: 6 }).map((_, index) => ({
      id: index,
      x: Math.random() * 400,
      y: Math.random() * 150,
      size: 85 + Math.random() * 25,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      speed: 1.5 + Math.random() * 0.5,
      speedVariation: 0.1 + Math.random() * 0.3,
      speedPhase: Math.random() * Math.PI * 2,
      color: `hsl(${index * 60}, 100%, 60%)`,
      colorSpeed: 0.5 + Math.random() * 1.5,
      colorOffset: index * 60,
    }));

    setBalls(initialBalls);

    // Animation loop
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) => {
        // Calculate current speed based on time
        const speedFactor =
          1 + ball.speedVariation * Math.sin(time * 0.01 + ball.speedPhase);

        // Update position with variable speed
        let newX = ball.x + ball.dx * ball.speed * speedFactor;
        let newY = ball.y + ball.dy * ball.speed * speedFactor;

        // Bounce off walls
        let newDx = ball.dx;
        let newDy = ball.dy;

        if (newX <= 0 || newX >= 400) {
          newDx = -newDx;
          newX = newX <= 0 ? 0 : 400;
        }

        if (newY <= 0 || newY >= 150) {
          newDy = -newDy;
          newY = newY <= 0 ? 0 : 150;
        }

        // Update color
        const newColorHue = (ball.colorOffset + time * ball.colorSpeed) % 360;

        return {
          ...ball,
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
          color: `hsl(${newColorHue}, 100%, 60%)`,
        };
      })
    );
  }, [time]);

  return (
    <g>
      <defs>
        <filter id="ballBlur">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      <rect width="400" height="150" fill={background} />
      {balls.map((ball) => (
        <circle
          key={ball.id}
          cx={ball.x}
          cy={ball.y}
          r={ball.size}
          fill={ball.color}
          filter="url(#ballBlur)"
        />
      ))}
    </g>
  );
};

export default Rainbow;
