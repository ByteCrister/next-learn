// Animation variants for consistent motion throughout the app
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const slideIn = {
  left: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
