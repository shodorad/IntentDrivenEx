import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Crown, ShieldCheck, FilmStrip, Minus, Plus } from '@phosphor-icons/react';
import { useChat } from '../../context/ChatContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './UpgradeFlow.module.css';

const STEPS = ['compare', 'confirm', 'processing', 'success'];

export default function UpgradeFlow() {
  const { state, dispatch } = useChat();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  const persona = state.persona;
  const account = persona?.account || {};
  const planComparison = account.planComparison;
  const isFamily = !!planComparison;

  // For family (Robert us-008): init line count from account
  useEffect(() => {
    if (planComparison?.lines) setLineCount(planComparison.lines);
  }, [planComparison]);

  useEffect(() => {
    if (STEPS[step] === 'processing') {
      const timer = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Success → trigger SMS modal after short delay
  useEffect(() => {
    if (STEPS[step] === 'success') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'upgrade' } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, dispatch]);

  // Persona-specific plan data
  const currentPlanName = account.plan || 'Current Plan';
  const currentPlanPrice = account.planPrice || '$40/mo';
  // Derive recommended upgrade name and price
  const upgradePlan = planComparison
    ? planComparison.plans.find((p) => p.recommended) || planComparison.plans[1]
    : { name: 'Total 5G Unlimited', pricePerLine: 55, totalFor4Lines: 110, data: 'Unlimited', hotspot: '15 GB', disney: true };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  // ─── Family pricing helper ───
  function priceForLines(plan, lines) {
    // Pricing table per PRD (from planComparison data or fallback tiers)
    const tiers = {
      1: plan.pricePerLine,
      2: plan.pricePerLine * 2,
      3: plan.pricePerLine <= 40
        ? plan.pricePerLine * 3
        : Math.round(plan.pricePerLine * 1.8), // bulk discount on unlimited
      4: plan.totalFor4Lines ?? plan.pricePerLine * 4,
    };
    return tiers[lines] ?? plan.pricePerLine * lines;
  }

  return (
    <div className={styles.flowCard}>
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Plan Comparison ─── */}
        {STEPS[step] === 'compare' && (
          <motion.div
            key="compare"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <Crown size={20} weight="fill" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('upgrade.compareTitle')}</h3>
            </div>

            {/* ─── Family line-count stepper (Robert only) ─── */}
            {isFamily && (
              <div className={styles.lineStepper}>
                <span className={styles.lineStepperLabel}>Lines</span>
                <button
                  className={styles.lineBtn}
                  onClick={() => setLineCount((c) => Math.max(1, c - 1))}
                  disabled={lineCount <= 1}
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className={styles.lineCount}>{lineCount}</span>
                <button
                  className={styles.lineBtn}
                  onClick={() => setLineCount((c) => Math.min(4, c + 1))}
                  disabled={lineCount >= 4}
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            )}

            {isFamily ? (
              /* ─── 3-plan comparison for Robert ─── */
              <div className={styles.familyPlansGrid}>
                {planComparison.plans.map((plan) => {
                  const price = priceForLines(plan, lineCount);
                  const savingsVsCurrent = plan.isCurrent ? null
                    : priceForLines(planComparison.plans[0], lineCount) - price;
                  return (
                    <div
                      key={plan.name}
                      className={`${styles.familyPlanCol} ${plan.recommended ? styles.recommended : ''} ${plan.isCurrent ? styles.currentCol : ''}`}
                    >
                      {plan.badge && (
                        <div className={`${styles.planTag} ${plan.recommended ? styles.recTag : ''}`}>
                          {plan.badge}
                        </div>
                      )}
                      <div className={styles.planName}>{plan.name}</div>
                      <div className={styles.familyPrice}>
                        <span className={styles.priceAmt}>${price}</span>
                        <span className={styles.priceUnit}>/mo</span>
                      </div>
                      {!plan.isCurrent && savingsVsCurrent > 0 && (
                        <div className={styles.savingsBadge}>Save ${savingsVsCurrent}/mo</div>
                      )}
                      <ul className={styles.planFeatures}>
                        <li>{plan.data} data</li>
                        <li>{plan.hotspot === 'None' ? 'No hotspot' : `${plan.hotspot} hotspot`}</li>
                        {plan.disney && <li className={styles.highlight}>Disney+ included</li>}
                        {plan.priceGuarantee && <li>5-yr price lock</li>}
                      </ul>
                      {!plan.isCurrent && (
                        <button className={styles.primaryBtn} onClick={() => setStep(1)}>
                          Switch to {plan.name.replace('Total ', '')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ─── Standard 2-plan comparison ─── */
              <div className={styles.plansGrid}>
                {/* Current Plan */}
                <div className={styles.planCard}>
                  <div className={styles.planTag}>{t('upgrade.currentTag')}</div>
                  <div className={styles.planName}>{currentPlanName}</div>
                  <div className={styles.planPrice}>{currentPlanPrice}</div>
                  <ul className={styles.planFeatures}>
                    <li>5 GB high-speed data</li>
                    <li>Unlimited talk & text</li>
                    <li>No hotspot</li>
                  </ul>
                </div>

                {/* Recommended Plan */}
                <div className={`${styles.planCard} ${styles.recommended}`}>
                  <div className={`${styles.planTag} ${styles.recTag}`}>{t('upgrade.recommendedTag')}</div>
                  <div className={styles.planName}>{t('upgrade.unlimitedPlan')}</div>
                  <div className={styles.planPrice}>$55<span>/mo</span></div>
                  <ul className={styles.planFeatures}>
                    <li className={styles.highlight}>Unlimited high-speed data</li>
                    <li>15 GB hotspot</li>
                    <li className={styles.highlight}>Disney+ included</li>
                  </ul>
                  <div className={styles.guarantee}>
                    <ShieldCheck size={14} weight="fill" />
                    <span>{t('upgrade.priceGuarantee')}</span>
                  </div>
                </div>
              </div>
            )}

            {!isFamily && (
              <button className={styles.primaryBtn} onClick={() => setStep(1)}>
                {t('upgrade.switchCta')}
              </button>
            )}
          </motion.div>
        )}

        {/* ─── Step 2: Confirm ─── */}
        {STEPS[step] === 'confirm' && (
          <motion.div
            key="confirm"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <ArrowRight size={20} weight="bold" className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{t('upgrade.confirmTitle')}</h3>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.changeTo')}</span>
                <span className={styles.confirmValue}>
                  {isFamily ? upgradePlan.name : t('upgrade.unlimitedPlan')}
                </span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.newPrice')}</span>
                <span className={styles.confirmTotal}>
                  ${isFamily ? priceForLines(upgradePlan, lineCount) : 55}/mo
                </span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>{t('upgrade.effective')}</span>
                <span className={styles.confirmValue}>{t('upgrade.effectiveDate')}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Charged to</span>
                <span className={styles.confirmValue}>{account.savedCard || 'Card on file'}</span>
              </div>
            </div>

            <div className={styles.bonusNote}>
              <FilmStrip size={16} weight="fill" />
              <span>{t('upgrade.disneyNote')}</span>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>
                {t('upgrade.back')}
              </button>
              <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                {t('upgrade.confirmCta')}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: Processing ─── */}
        {STEPS[step] === 'processing' && (
          <motion.div
            key="processing"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={`${styles.stepContent} ${styles.centered}`}
          >
            <div className={styles.spinner} />
            <h3 className={styles.processingTitle}>{t('upgrade.processingTitle')}</h3>
            <p className={styles.processingSubtext}>{t('upgrade.processingSubtext')}</p>
          </motion.div>
        )}

        {/* ─── Step 4: Success ─── */}
        {STEPS[step] === 'success' && (
          <motion.div
            key="success"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={`${styles.stepContent} ${styles.centered}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle size={48} weight="fill" className={styles.successIcon} />
            </motion.div>
            <h3 className={styles.successTitle}>{t('upgrade.successTitle')}</h3>

            <div className={styles.successDetails}>
              <div className={styles.successRow}>{t('upgrade.successPlan')}</div>
              <div className={styles.successRow}>{t('upgrade.successData')}</div>
              <div className={styles.successRow}>{t('upgrade.successHotspot')}</div>
              <div className={styles.disneyActivation}>
                <FilmStrip size={18} weight="fill" />
                <span>{t('upgrade.disneyActivation')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
