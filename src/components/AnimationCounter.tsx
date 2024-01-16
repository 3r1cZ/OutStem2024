import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import "../css/Home.css";

interface Props {
  from: number;
  to: number;
  className: string;
}

const AnimationCounter = ({ from, to, className }: Props) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.5 });
    return controls.stop;
  }, []);

  return <motion.p className={className}>{rounded}</motion.p>;
};

export default AnimationCounter;
