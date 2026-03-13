import { useState } from 'react';
import { CheckCircle, Phone, Headset, Star, ArrowSquareOut, ShoppingCart } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS, PHONES } from '../../data/products';
import styles from './RecommendationCard.module.css';

function findProduct(type, id) {
  if (type === 'plan') return PLANS.find(p => p.id === id);
  if (type === 'phone') return PHONES.find(p => p.id === id);
  return null;
}

function PlanCard({ product, reason, isBest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`${styles.card} ${isBest ? styles.best : styles.alt}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient header */}
      <div className={`${styles.cardTop} ${isBest ? styles.cardTopBest : styles.cardTopAlt}`}>
        <div className={styles.cardTopRow}>
          <h3 className={styles.planName}>{product.name}</h3>
          {product.badge && (
            <span className={styles.badgePill}>
              {product.badge}
            </span>
          )}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceDollar}>$</span>
          <span className={styles.priceAmount}>{product.price}</span>
          <div className={styles.priceMeta}>
            <span>/line</span>
            <span>per month</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Data</span>
          <span className={styles.statValue}>{product.data}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Network</span>
          <span className={styles.statValue}>{product.network}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Talk & Text</span>
          <span className={styles.statValue}>{product.talk}</span>
        </div>
      </div>

      {/* Features */}
      <ul className={styles.features}>
        {product.features.slice(0, isBest ? 6 : 4).map((f, i) => (
          <li key={i}>
            <CheckCircle size={15} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={styles.actions}>
        {!expanded ? (
          <button
            className={isBest ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setExpanded(true)}
          >
            Explore More
          </button>
        ) : (
          <motion.div
            className={styles.expandedActions}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.reasonText}>{reason}</p>
            <a
              href={product.url || "https://www.totalwireless.com/plans"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPurchase}
            >
              <ShoppingCart size={16} weight="bold" />
              Purchase on Website
              <ArrowSquareOut size={14} />
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function PhoneCard({ product, reason, isBest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`${styles.card} ${isBest ? styles.best : styles.alt}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient header */}
      <div className={`${styles.cardTop} ${isBest ? styles.cardTopBest : styles.cardTopAlt}`}>
        <div className={styles.cardTopRow}>
          <h3 className={styles.planName}>{product.name}</h3>
          {product.badge && (
            <span className={styles.badgePill}>
              {product.badge}
            </span>
          )}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceDollar}>$</span>
          <span className={styles.priceAmount}>{product.price}</span>
        </div>
      </div>

      {/* Phone image */}
      {product.image && (
        <div className={styles.phoneImageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.phoneImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Camera</span>
          <span className={styles.statValue}>{product.camera}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Storage</span>
          <span className={styles.statValue}>{product.storage}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Battery</span>
          <span className={styles.statValue}>{product.battery}</span>
        </div>
      </div>

      {/* Features */}
      <ul className={styles.features}>
        {product.features.slice(0, isBest ? 5 : 3).map((f, i) => (
          <li key={i}>
            <CheckCircle size={15} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={styles.actions}>
        {!expanded ? (
          <button
            className={isBest ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setExpanded(true)}
          >
            Explore More
          </button>
        ) : (
          <motion.div
            className={styles.expandedActions}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.reasonText}>{reason}</p>
            <a
              href={product.url || "https://www.totalwireless.com/phones"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPurchase}
            >
              <ShoppingCart size={16} weight="bold" />
              Purchase on Website
              <ArrowSquareOut size={14} />
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function HumanCard({ reason }) {
  return (
    <motion.div
      className={`${styles.card} ${styles.alt}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${styles.cardTop} ${styles.cardTopAlt}`}>
        <h3 className={styles.planName}>Talk to a Specialist</h3>
      </div>
      <div className={styles.humanBody}>
        <Headset size={32} className={styles.headsetIcon} />
        <p className={styles.humanReason}>{reason}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary}>
          <Phone size={16} weight="bold" />
          Call 1-866-663-3633
        </button>
      </div>
    </motion.div>
  );
}

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  // Sort: best first
  const sorted = [...recommendations].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardsRow}>
        {sorted.map((rec, i) => {
          if (rec.type === 'human') {
            return <HumanCard key={i} reason={rec.reason} />;
          }
          const product = findProduct(rec.type, rec.id);
          if (!product) return null;

          if (rec.type === 'plan') {
            return <PlanCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} />;
          }
          return <PhoneCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} />;
        })}
      </div>

      <div className={styles.talkLink}>
        <Headset size={16} />
        <span>Want to talk to a real person instead? Call <strong>1-866-663-3633</strong></span>
      </div>
    </div>
  );
}
