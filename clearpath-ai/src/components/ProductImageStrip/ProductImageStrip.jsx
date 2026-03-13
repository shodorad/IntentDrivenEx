import { motion } from 'framer-motion';
import styles from './ProductImageStrip.module.css';

export default function ProductImageStrip({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <motion.div
      className={styles.strip}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {images.map((img, i) => (
        <div key={i} className={styles.productCard}>
          <div className={styles.imageWrap}>
            <img
              src={img.image}
              alt={img.name}
              className={styles.productImg}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span className={styles.productName}>{img.name}</span>
          <span className={styles.productPrice}>${img.price}</span>
        </div>
      ))}
    </motion.div>
  );
}
