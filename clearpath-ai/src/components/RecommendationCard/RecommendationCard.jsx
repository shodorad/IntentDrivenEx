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

// density: 'single' | 'grid' | 'grid6' | 'grid9'
const DENSITY_CARD_CLASS  = { single: styles.cardSingle,  grid: '', grid6: styles.cardGrid6,  grid9: styles.cardGrid9  };
const DENSITY_TOP_CLASS   = { single: '',                 grid: '', grid6: styles.cardTopGrid6, grid9: styles.cardTopGrid9 };
const DENSITY_FEAT_CLASS  = { single: '',                 grid: '', grid6: styles.featuresGrid6, grid9: styles.featuresGrid9 };

function PlanCard({ product, reason, isBest, onExplore, costDiff, solveHighlight, density }) {
  const showStats     = density === 'single' || density === 'grid';
  const showHighlight = showStats && !!solveHighlight;
  const maxFeatures   = density === 'grid9' ? 1 : density === 'grid6' ? 2 : isBest ? 6 : 4;

  return (
    <motion.div
      className={[styles.card, isBest ? styles.best : styles.alt, DENSITY_CARD_CLASS[density]].join(' ')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient header */}
      <div className={[styles.cardTop, isBest ? styles.cardTopBest : styles.cardTopAlt, DENSITY_TOP_CLASS[density]].join(' ')}>
        <div className={styles.cardTopRow}>
          <h3 className={styles.planName}>{product.name}</h3>
          {product.badge && density !== 'grid9' && (
            <Badge variant="tealDark">{product.badge}</Badge>
          )}
        </div>
        <div className={styles.priceRow}>
          {product.price !== null ? (
            <>
              <span className={styles.priceDollar}>$</span>
              <span className={density === 'grid9' ? styles.priceAmountSmall : styles.priceAmount}>{product.price}</span>
              {density !== 'grid9' && (
                <div className={styles.priceMeta}>
                  <span>/line</span>
                  <span>per month</span>
                </div>
              )}
            </>
          ) : (
            <span className={styles.priceDynamic}>See current price</span>
          )}
        </div>
        {product.priceNote && density === 'single' && (
          <div className={styles.priceNote}>{product.priceNote}</div>
        )}
        {costDiff && density !== 'grid9' && (
          <span className={styles.costDiffBadge}>{costDiff}</span>
        )}
      </div>

      {showHighlight && (
        <div className={styles.solveHighlight}>
          <Lightning size={14} weight="fill" />
          <span>{solveHighlight}</span>
        </div>
      )}

      {showStats && (
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
      )}

      <ul className={[styles.features, DENSITY_FEAT_CLASS[density]].join(' ')}>
        {product.features.slice(0, maxFeatures).map((f, i) => (
          <li key={i}>
            <CheckCircle size={density === 'grid9' ? 12 : 15} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button
          variant={isBest ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onExplore(product, 'plan', reason)}
        >
          {density === 'grid9' ? 'Select' : 'Upgrade Now'}
        </Button>
      </div>
    </motion.div>
  );
}

function PhoneCard({ product, reason, isBest, onExplore, costDiff, solveHighlight, density }) {
  const showStats     = density === 'single' || density === 'grid';
  const showImage     = showStats;
  const showHighlight = showStats && !!solveHighlight;
  const maxFeatures   = density === 'grid9' ? 1 : density === 'grid6' ? 2 : isBest ? 5 : 3;

  return (
    <motion.div
      className={[styles.card, isBest ? styles.best : styles.alt, DENSITY_CARD_CLASS[density]].join(' ')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient header */}
      <div className={[styles.cardTop, isBest ? styles.cardTopBest : styles.cardTopAlt, DENSITY_TOP_CLASS[density]].join(' ')}>
        <div className={styles.cardTopRow}>
          <h3 className={styles.planName}>{product.name}</h3>
          {product.badge && density !== 'grid9' && (
            <Badge variant="tealDark">{product.badge}</Badge>
          )}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceDollar}>$</span>
          <span className={density === 'grid9' ? styles.priceAmountSmall : styles.priceAmount}>{product.price}</span>
        </div>
        {costDiff && density !== 'grid9' && (
          <span className={styles.costDiffBadge}>{costDiff}</span>
        )}
      </div>

      {showHighlight && (
        <div className={styles.solveHighlight}>
          <Lightning size={14} weight="fill" />
          <span>{solveHighlight}</span>
        </div>
      )}

      {showImage && (
        <div className={styles.phoneImageWrap}>
          <PhoneImage src={product.image} alt={product.name} brand={product.brand} className={styles.phoneImage} />
        </div>
      )}

      {showStats && (
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
      )}

      <ul className={[styles.features, DENSITY_FEAT_CLASS[density]].join(' ')}>
        {product.features.slice(0, maxFeatures).map((f, i) => (
          <li key={i}>
            <CheckCircle size={density === 'grid9' ? 12 : 15} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onExplore(product, 'phone', reason)}
        >
          {density === 'grid9' ? 'Select' : 'Upgrade Now'}
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

const ROW_CLASS = {
  single: styles.cardsRowSingle,
  grid:   '',
  grid6:  styles.cardsRowGrid6,
  grid9:  styles.cardsRowGrid9,
  compact: styles.cardsRowGrid6, // legacy alias
};

function deriveDensity(layout, count) {
  // LLM-supplied layout takes precedence; fall back to count-based
  if (layout && ROW_CLASS[layout] !== undefined) return layout;
  if (count === 1)  return 'single';
  if (count <= 3)   return 'grid';
  if (count <= 6)   return 'grid6';
  return 'grid9';
}

export default function RecommendationCard({ recommendations, layout, onExplore }) {
  if (!recommendations || recommendations.length === 0) return null;

  const density = deriveDensity(layout, recommendations.length);

  // Sort: best first
  const sorted = [...recommendations].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));

  return (
    <div className={styles.wrapper}>
      <div className={[styles.cardsRow, ROW_CLASS[density]].join(' ')}>
        {sorted.map((rec, i) => {
          if (rec.type === 'human') {
            return <HumanCard key={i} reason={rec.reason} />;
          }
          const product = findProduct(rec.type, rec.id);
          if (!product) return null;

          if (rec.type === 'plan') {
            return <PlanCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} onExplore={onExplore} costDiff={rec.costDiff} solveHighlight={rec.solveHighlight} density={density} />;
          }
          return <PhoneCard key={i} product={product} reason={rec.reason} isBest={rec.isBest} onExplore={onExplore} costDiff={rec.costDiff} solveHighlight={rec.solveHighlight} density={density} />;
        })}
      </div>
    </div>
  );
}
