import { motion } from "framer-motion";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

/**
 * This function returns a fade-in animation component for the website.
 * @param children the element to be faded in
 * @returns a fade-in animation
 */
const AnimationFadeIn = ({ children }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationFadeIn;
