import UsageChart     from './UsageChart';
import PlanComparison from './PlanComparison';
import StepTimeline   from './StepTimeline';
import AccountSnapshot from './AccountSnapshot';
import InsightPanel   from './InsightPanel';

// Legacy flow components
import RefillFlow         from '../RefillFlow/RefillFlow';
import RedeemFlow         from '../RedeemFlow/RedeemFlow';
import UpgradeFlow        from '../UpgradeFlow/UpgradeFlow';
import LiveChatFlow       from '../LiveChatFlow/LiveChatFlow';
import PhoneOrderFlow     from '../PhoneOrderFlow/PhoneOrderFlow';
import RecommendationCard from '../RecommendationCard/RecommendationCard';

// Registry — add new card types here only, nothing else changes
export const CARD_REGISTRY = {
  // ── MUI data cards ─────────────────────────────────────────────
  usage_chart:      UsageChart,
  plan_comparison:  PlanComparison,
  step_timeline:    StepTimeline,
  account_snapshot: AccountSnapshot,
  insight:          InsightPanel,
  insight_panel:    InsightPanel,

  // ── Legacy transaction flows ────────────────────────────────────
  refill:           RefillFlow,
  redeem:           RedeemFlow,
  upgrade:          UpgradeFlow,
  live_chat:        LiveChatFlow,
  phone_order:      PhoneOrderFlow,

  // ── Plan / phone recommendation cards ──────────────────────────
  plan:             RecommendationCard,
  phone:            RecommendationCard,
};

// Cards that need the full recommendations[] array (grouped rendering)
export const GROUPED_CARD_TYPES = new Set(['plan', 'phone']);

// Cards that pass orderData prop (PhoneOrderFlow)
export const ORDER_CARD_TYPES = new Set(['phone_order']);
