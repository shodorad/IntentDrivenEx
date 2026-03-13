import { CheckCircle, Phone, Headset } from '@phosphor-icons/react';
import { PLANS, PHONES } from '../../data/products';
import styles from './RecommendationCard.module.css';

function findProduct(type, id) {
  if (type === 'plan') return PLANS.find(p => p.id === id);
  if (type === 'phone') return PHONES.find(p => p.id === id);
  return null;
}

function PlanCard({ product, reason, isBest }) {
  return (
    <div className={`${styles.card} ${isBest ? styles.best : styles.alt}`}>
      <div className={styles.badge}>
        {isBest ? '★ BEST RECOMMENDATION' : 'ALSO CONSIDER'}
      </div>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.productName}>{product.name}</h3>
          {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
        </div>
        <div className={styles.price}>
          <span className={styles.priceAmount}>${product.price}</span>
          <span className={styles.priceUnit}>/mo</span>
        </div>
      </div>
      <div className={styles.reason}>
        <p>{reason}</p>
      </div>
      <ul className={styles.features}>
        {product.features.slice(0, isBest ? 6 : 3).map((f, i) => (
          <li key={i}>
            <CheckCircle size={16} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button className={isBest ? styles.btnPrimary : styles.btnSecondary}>
          Get This Plan
        </button>
      </div>
    </div>
  );
}

function PhoneCard({ product, reason, isBest }) {
  return (
    <div className={`${styles.card} ${isBest ? styles.best : styles.alt}`}>
      <div className={styles.badge}>
        {isBest ? '★ BEST RECOMMENDATION' : 'ALSO CONSIDER'}
      </div>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.productName}>{product.name}</h3>
          {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
        </div>
        <div className={styles.price}>
          <span className={styles.priceAmount}>${product.price}</span>
        </div>
      </div>
      <div className={styles.specs}>
        <span>{product.camera} Camera</span>
        <span className={styles.specDot}>·</span>
        <span>{product.storage}</span>
        <span className={styles.specDot}>·</span>
        <span>{product.battery}</span>
      </div>
      <div className={styles.reason}>
        <p>{reason}</p>
      </div>
      <ul className={styles.features}>
        {product.features.slice(0, isBest ? 5 : 3).map((f, i) => (
          <li key={i}>
            <CheckCircle size={16} weight="fill" className={styles.checkIcon} />
            {f}
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button className={isBest ? styles.btnPrimary : styles.btnSecondary}>
          Get This Phone
        </button>
      </div>
    </div>
  );
}

function HumanCard({ reason }) {
  return (
    <div className={`${styles.card} ${styles.alt}`}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.productName}>Talk to a Specialist</h3>
        </div>
        <Headset size={28} className={styles.headsetIcon} />
      </div>
      <div className={styles.reason}>
        <p>{reason}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary}>
          <Phone size={16} weight="bold" />
          Call 1-866-663-3633
        </button>
      </div>
    </div>
  );
}

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  // Sort: best first
  const sorted = [...recommendations].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));

  return (
    <div className={styles.wrapper}>
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

      <div className={styles.talkLink}>
        <Headset size={16} />
        <span>Want to talk to a real person instead? Call <strong>1-866-663-3633</strong></span>
      </div>
    </div>
  );
}
