import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

// Hook to check for reduced motion
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}

// 1. Scroll-Linked Parallax Container
interface ScrollParallaxProps {
  children: React.ReactNode;
  offsetY?: [number, number]; // e.g. [-20, 20]
  scale?: [number, number];   // e.g. [1.05, 1.0]
  opacity?: [number, number]; // e.g. [0.95, 1.0]
  className?: string;
}

export const ScrollParallax: React.FC<ScrollParallaxProps> = ({
  children,
  offsetY = [-20, 20],
  scale = [1.04, 1.0],
  opacity = [0.95, 1],
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.8,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], offsetY);
  const s = useTransform(smoothProgress, [0, 1], scale);
  const o = useTransform(smoothProgress, [0, 0.4, 1], [opacity[0], 1, opacity[1]]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: s, opacity: o }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

// 2. Cinematic Section Reveal (Fluid scroll progress interpolation)
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  yOffset = 24
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.65"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], [yOffset, 0]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ opacity, y }}
        transition={{ delay }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

// 3. Apple-Style 3D Tilt Card (Pointer responsive with spring easing)
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  scaleOnHover?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  maxTilt = 3,
  scaleOnHover = 1.015
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);

  // useMotionValue avoids React component re-renders on mousemove
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for silky physics
  const rotateX = useSpring(x, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const degX = ((clientY - centerY) / centerY) * -maxTilt;
    const degY = ((clientX - centerX) / centerX) * maxTilt;

    x.set(degX);
    y.set(degY);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
        y: isHovered ? -3 : 0
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`transition-shadow duration-300 will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

