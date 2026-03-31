import { CheckCircle, Phone, Headset, Star, ArrowSquareOut, ShoppingCart, Lightning } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { PLANS, PHONES } from '../../data/products';
import Button from '../ui/Button/Button';
import Badge from '../ui/Badge/Badge';
import PhoneImage from '../ui/PhoneImage/PhoneImage';
import styles from './RecommendationCard.module.css';

function findProduct(type, id) {
  if (type === 'plan') return PLANS.find(p => p.id === id);
  if (type === 'phone') return PHONES.find(p => p.id === id);
  return null;
}

function PlanCard({ product, reason, isBest, onExplore, costDiff, solveHighlight }) {
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
            <Badge variant="tealDark">{product.badge}</Badge>
          )}
        </div>
        <div className={styles.priceRow}>
          {product.price !== null ? (
            <>
              <span className={styles.priceDollar}>$</span>
              <span className={styles.priceAmount}>{product.price}</span>
              <div className={styles.priceMeta}>
                <span>/line</span>
                <span>per month</span>
              </div>
            </>
          ) : (
            <span className={styles.priceDynamic}>See current price</span>
          )}
        </div>
        {product.priceNote && (
          <div className={styles.priceNote}>{product.priceNote}</div>
        )}
        {/* Cost differential badge */}
        {costDiff && (
          <span className={styles.costDiffBadge}>{costDiff}</span>
        )}
      </div>

      {/* Problem-solved highlight */}
      {solveHighlight && (
        <div className={styles.solveHighlight}>
          <Lightning size={14} weight="fill" />
          <span>{solveHighlight}</span>
        </div>
      )}

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
        <Button
          variant={isBest ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onExplore(product, 'plan', reason)}
        >
          {isBest ? 'Upgrade Now' : 'Learn More'}
        </Button>
      </div>
    </motion.div>
  );
}

function PhoneCard({ product, reason, isBest, onExplore, costDiff, solveHighlight }) {
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
            <Badge variant="tealDark">{product.badge}</Badge>
          )}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceDollar}>$</span>
          <span className={styles.priceAmount}>{product.price}</span>
        </div>
        {/* Cost differential badge */}
        {costDiff && (
          <span className={styles.costDiffBadge}>{costDiff}</span>
        )}
      </div>

      {/* Problem-solved highlight */}
      {solveHighlight && (
        <div className={styles.solveHighlight}>
          <Lightning size={14} weight="fill" />
          <span>{solveHighlight}</span>
        </div>
      )}

      {/* Phone image */}
      <div className={styles.phoneImageWrap}>
        <PhoneImage src={product.image} alt={product.name} brand={product.brand} className={styles.phoneImage} />
      </div>

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
        <Button
          variant={isBest ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onExplore(product, 'phone', reason)}
        >
          {isBest ? 'Upgrade Now' : 'Learn More'}
        </Button>
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
        <Button variant="outline" size="sm">
          <Phone size={16} weight="bold" />
          Call 1-866-663-3633
        </Button>
      </div>
    </motion.div>
  );
}

export default function RecommendationCard({ recommendations, onExplore }) {
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
            return <PlanCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} onExplore={onExplore} costDiff={rec.costDiff} solveHighlight={rec.solveHighlight} />;
          }
          return <PhoneCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} onExplore={onExplore} costDiff={rec.costDiff} solveHighlight={rec.solveHighlight} />;
        })}
      </div>

      <div className={styles.talkLink}>
        <Headset size={16} />
        <span>Want to talk to a real person instead? Call <strong>1-866-663-3633</strong></span>
      </div>
    </div>
  );
}
