import { motion } from 'framer-motion';
import styles from './FloatingShapes.module.css';

const shapes = [
  { type: 'circle', size: 260, x: '8%', y: '15%', duration: 22, delay: 0, color: 'rgba(0, 181, 173, 0.12)' },
  { type: 'circle', size: 180, x: '75%', y: '60%', duration: 26, delay: 2, color: 'rgba(0, 48, 135, 0.08)' },
  { type: 'ring', size: 200, x: '85%', y: '10%', duration: 30, delay: 1, color: 'rgba(0, 181, 173, 0.1)' },
  { type: 'ring', size: 140, x: '15%', y: '70%', duration: 24, delay: 3, color: 'rgba(0, 48, 135, 0.06)' },
  { type: 'blob', size: 320, x: '50%', y: '80%', duration: 28, delay: 0.5, color: 'rgba(0, 181, 173, 0.06)' },
  { type: 'dot', size: 8, x: '20%', y: '30%', duration: 16, delay: 0, color: 'rgba(0, 181, 173, 0.3)' },
  { type: 'dot', size: 6, x: '60%', y: '20%', duration: 18, delay: 1, color: 'rgba(0, 48, 135, 0.2)' },
  { type: 'dot', size: 10, x: '80%', y: '45%', duration: 14, delay: 2, color: 'rgba(0, 181, 173, 0.25)' },
  { type: 'dot', size: 5, x: '35%', y: '85%', duration: 20, delay: 3, color: 'rgba(0, 48, 135, 0.15)' },
  { type: 'cross', size: 20, x: '45%', y: '12%', duration: 22, delay: 1.5, color: 'rgba(0, 181, 173, 0.15)' },
  { type: 'cross', size: 16, x: '70%', y: '75%', duration: 25, delay: 0, color: 'rgba(0, 48, 135, 0.1)' },
];

function ShapeSVG({ type, size, color }) {
  if (type === 'circle') {
    return (
      <div
        className={styles.circle}
        style={{ width: size, height: size, background: color }}
      />
    );
  }

  if (type === 'ring') {
    return (
      <div
        className={styles.ring}
        style={{
          width: size,
          height: size,
          border: `2px solid ${color}`,
        }}
      />
    );
  }

  if (type === 'blob') {
    return (
      <div
        className={styles.blob}
        style={{ width: size, height: size, background: color }}
      />
    );
  }

  if (type === 'dot') {
    return (
      <div
        className={styles.dot}
        style={{ width: size, height: size, background: color }}
      />
    );
  }

  if (type === 'cross') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path d="M10 2v16M2 10h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}

export default function FloatingShapes() {
  return (
    <div className={styles.canvas} aria-hidden="true">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={styles.shapeWrap}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        >
          <ShapeSVG type={shape.type} size={shape.size} color={shape.color} />
        </motion.div>
      ))}
    </div>
  );
}
