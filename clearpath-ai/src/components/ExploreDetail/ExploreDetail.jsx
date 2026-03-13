import { Star, ShoppingCart, ArrowSquareOut } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import styles from './ExploreDetail.module.css';

const REVIEWS = {
  'moto-g-power': [
    { author: "Sarah M.", rating: 5, text: "Battery lasts 2 full days easily. Best budget phone I've owned." },
    { author: "James R.", rating: 4, text: "Great value for $99. Camera is decent and the phone feels snappy." },
    { author: "Linda K.", rating: 5, text: "Switched from an old iPhone and I'm impressed. Does everything I need." }
  ],
  'samsung-a15': [
    { author: "Mike T.", rating: 5, text: "The AMOLED screen is gorgeous at this price. Colors really pop." },
    { author: "Priya S.", rating: 4, text: "Solid phone for everyday use. 5G speeds are noticeable." },
    { author: "Carlos D.", rating: 4, text: "Camera takes great photos in daylight. Good battery life too." }
  ],
  'samsung-a25': [
    { author: "Alex W.", rating: 5, text: "Best mid-range phone out there. OIS on the camera makes a huge difference." },
    { author: "Jessica L.", rating: 5, text: "Super smooth performance with 6GB RAM. Love the expandable storage." },
    { author: "David H.", rating: 4, text: "Upgraded from the A15 and the difference is noticeable. Great value at $199." }
  ],
  'iphone-se': [
    { author: "Rachel B.", rating: 5, text: "All the power of a flagship in a compact size. Touch ID is still the best." },
    { author: "Tom N.", rating: 4, text: "A15 chip makes this incredibly fast. Perfect for someone who wants a small iPhone." },
    { author: "Maria G.", rating: 5, text: "Best affordable iPhone. Does everything my friend's iPhone 14 does." }
  ],
  'moto-g-stylus': [
    { author: "Kevin P.", rating: 5, text: "256GB storage is a game-changer. The stylus is surprisingly useful." },
    { author: "Amy C.", rating: 4, text: "Beautiful OLED display and tons of storage. Great for the price." },
    { author: "Brian F.", rating: 5, text: "No more running out of space. This phone has room for everything." }
  ]
};

// Fallback reviews for plans
const PLAN_REVIEWS = [
  { author: "Michelle T.", rating: 5, text: "Switched to this plan and my bill dropped by $20/month. Same great coverage." },
  { author: "Robert J.", rating: 5, text: "Verizon's network but at a fraction of the price. No complaints at all." },
  { author: "Sophia L.", rating: 4, text: "Easy to set up and reliable service. Customer support was helpful too." }
];

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          weight={i <= rating ? "fill" : "regular"}
          className={i <= rating ? styles.starFilled : styles.starEmpty}
        />
      ))}
    </div>
  );
}

export default function ExploreDetail({ exploreData }) {
  if (!exploreData) return null;

  const { product, type, reason } = exploreData;
  const reviews = (type === 'phone' ? REVIEWS[product.id] : null) || PLAN_REVIEWS;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Product header */}
      <div className={styles.productHeader}>
        {type === 'phone' && product.image && (
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <span className={styles.productPrice}>
            ${product.price}{type === 'plan' ? '/mo' : ''}
          </span>
        </div>
      </div>

      {/* Why this is recommended */}
      <div className={styles.reasonSection}>
        <h4 className={styles.sectionTitle}>Why we recommend this</h4>
        <p className={styles.reasonText}>{reason}</p>
      </div>

      {/* Reviews */}
      <div className={styles.reviewsSection}>
        <h4 className={styles.sectionTitle}>What customers are saying</h4>
        <div className={styles.reviewsList}>
          {reviews.map((review, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewAuthor}>{review.author}</span>
                <StarRating rating={review.rating} />
              </div>
              <p className={styles.reviewText}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase CTA */}
      <a
        href={product.url || "https://www.totalwireless.com"}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btnPurchase}
      >
        <ShoppingCart size={18} weight="bold" />
        Purchase on Website
        <ArrowSquareOut size={14} />
      </a>
    </motion.div>
  );
}
