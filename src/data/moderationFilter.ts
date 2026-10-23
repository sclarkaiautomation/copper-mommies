/**
 * Copper Mommies Community Sanctuary Safety & Moderation Filter Engine
 * 
 * Provides automated backend & client-side trigger-word analysis,
 * anti-scam defense, harmful substance prevention, and respectful maternal
 * community guidelines enforcement for the Village Stream and Commons.
 */

export type ModerationCategory = 
  | 'scam_crypto' 
  | 'harassment_violence' 
  | 'vulgarity_slurs' 
  | 'substance_hazard' 
  | 'commercial_reseller';

export interface ModerationTriggerRule {
  id: string;
  pattern: string; // keyword, phrase, or regex pattern
  isRegex?: boolean;
  category: ModerationCategory;
  categoryLabel: string;
  severity: 'critical' | 'high' | 'medium';
  action: 'block' | 'flag_for_review';
  reason: string;
  isCustom?: boolean;
}

export interface MatchedTrigger {
  word: string;
  matchedSnippet: string;
  category: ModerationCategory;
  categoryLabel: string;
  severity: 'critical' | 'high' | 'medium';
  action: 'block' | 'flag_for_review';
  reason: string;
}

export interface ModerationScanResult {
  isClean: boolean;
  matchedTriggers: MatchedTrigger[];
  highestSeverity: 'none' | 'medium' | 'high' | 'critical';
  recommendedAction: 'allow' | 'flag_for_review' | 'block';
  warningMessage?: string;
  summary: string;
}

export const DEFAULT_TRIGGER_RULES: ModerationTriggerRule[] = [
  // 1. FINANCIAL SCAMS, CRYPTO & PREDATORY SCHEMES
  {
    id: 'trig-scam-1',
    pattern: 'cash\\s*app\\s*flip',
    isRegex: true,
    category: 'scam_crypto',
    categoryLabel: 'Financial Scam / Money Flip',
    severity: 'critical',
    action: 'block',
    reason: 'Prohibited predatory Cash App flipping scheme violating community mutual-aid trust.'
  },
  {
    id: 'trig-scam-2',
    pattern: '(crypto|cryptocurrency|bitcoin|btc\\s*wallet|ethereum|forex\\s*trading|binary\\s*options)',
    isRegex: true,
    category: 'scam_crypto',
    categoryLabel: 'Crypto & Forex Solicitation',
    severity: 'high',
    action: 'flag_for_review',
    reason: 'Unregulated cryptocurrency and speculative trading solicitations are strictly moderated.'
  },
  {
    id: 'trig-scam-3',
    pattern: '(t\\.me\\/|wa\\.me\\/|whatsapp\\s*me\\s*for\\s*profit|telegram\\s*signals)',
    isRegex: true,
    category: 'scam_crypto',
    categoryLabel: 'Off-Platform Solicitations',
    severity: 'high',
    action: 'flag_for_review',
    reason: 'Directing mothers off-platform to unvetted Telegram/WhatsApp investment groups is prohibited.'
  },
  {
    id: 'trig-scam-4',
    pattern: '(guaranteed\\s*(100%|daily)?\\s*returns?|double\\s*your\\s*(money|cash|funds)|pyramid\\s*scheme|ponzi)',
    isRegex: true,
    category: 'scam_crypto',
    categoryLabel: 'Ponzi / High-Yield Scam',
    severity: 'critical',
    action: 'block',
    reason: 'Get-rich-quick guarantees and multi-level scheme promises compromise sovereign sister safety.'
  },
  {
    id: 'trig-scam-5',
    pattern: '(bank\\s*log|wire\\s*transfer\\s*loophole|gift\\s*card\\s*generator|paypal\\s*glitch)',
    isRegex: true,
    category: 'scam_crypto',
    categoryLabel: 'Financial Fraud & Glitches',
    severity: 'critical',
    action: 'block',
    reason: 'Illegal wire and financial exploit schemes are strictly forbidden.'
  },

  // 2. HARASSMENT, THREATS & DOXXING
  {
    id: 'trig-harass-1',
    pattern: '(i\\s*will\\s*(kill|hurt|beat|shoot|stab|harm)|pull\\s*up\\s*on\\s*you|run\\s*up\\s*on)',
    isRegex: true,
    category: 'harassment_violence',
    categoryLabel: 'Threat of Physical Harm',
    severity: 'critical',
    action: 'block',
    reason: 'Violent threats and physical intimidation violate the sacred sanctuary vows.'
  },
  {
    id: 'trig-harass-2',
    pattern: '(doxx|doxxing|leak\\s*(your|her)\\s*address|expose\\s*(your|her)\\s*(ssn|social|phone|id))',
    isRegex: true,
    category: 'harassment_violence',
    categoryLabel: 'Doxxing & Privacy Violation',
    severity: 'critical',
    action: 'block',
    reason: 'Exposing personal addresses or private identifying details is strictly disallowed.'
  },
  {
    id: 'trig-harass-3',
    pattern: '(hate\\s*you\\s*all|bitch\\s*ass|shut\\s*up\\s*hoe|stupid\\s*hoe|ghetto\\s*trash)',
    isRegex: true,
    category: 'harassment_violence',
    categoryLabel: 'Hostile Interpersonal Attack',
    severity: 'high',
    action: 'flag_for_review',
    reason: 'Degrading verbal attacks against sisters are subject to grandmother moderation review.'
  },

  // 3. VULGARITY & SLURS TARGETING MOTHERS & COMMUNITY
  {
    id: 'trig-slur-1',
    pattern: '\\b(nigger|nigga|coon|darkie|wetback|kike|faggot|tranny)\\b',
    isRegex: true,
    category: 'vulgarity_slurs',
    categoryLabel: 'Racial & Derogatory Slurs',
    severity: 'critical',
    action: 'block',
    reason: 'Hate speech and racial slurs undermine sovereign melanated maternal dignity.'
  },
  {
    id: 'trig-slur-2',
    pattern: '\\b(fuck\\s*you|motherfucker|cunt|pussy|whore|slut)\\b',
    isRegex: true,
    category: 'vulgarity_slurs',
    categoryLabel: 'Severe Profanity',
    severity: 'high',
    action: 'flag_for_review',
    reason: 'Profane or sexually degrading language requires moderator oversight.'
  },

  // 4. SUBSTANCE HAZARDS & ILLICIT PHARMACEUTICAL RESALE
  {
    id: 'trig-subst-1',
    pattern: '(percocet\\s*for\\s*sale|buy\\s*xanax|oxycodone\\s*no\\s*script|fentanyl|buy\\s*meth|heroin)',
    isRegex: true,
    category: 'substance_hazard',
    categoryLabel: 'Illicit Narcotics / Prescription Resale',
    severity: 'critical',
    action: 'block',
    reason: 'Unregulated pharmaceutical trade and controlled substances endanger maternal and infant health.'
  },
  {
    id: 'trig-subst-2',
    pattern: '(black\\s*market\\s*abortion\\s*pill|untested\\s*labor\\s*inducer\\s*concoction)',
    isRegex: true,
    category: 'substance_hazard',
    categoryLabel: 'Unsafe Reproductive Substance',
    severity: 'high',
    action: 'flag_for_review',
    reason: 'Medical and botanical safety for expectant mothers requires herbal elder council vetting.'
  },

  // 5. COMMERCIAL RESELLER SPAM & DROPSHIPPING
  {
    id: 'trig-resell-1',
    pattern: '(aliexpress\\s*dropship|temu\\s*bulk\\s*reseller|buy\\s*cheap\\s*replica|knockoff\\s*designer)',
    isRegex: true,
    category: 'commercial_reseller',
    categoryLabel: 'Dropshipping & Wholesale Reseller Spam',
    severity: 'medium',
    action: 'flag_for_review',
    reason: 'Copper Mommies supports sovereign handmade crafts, authentic herbalism, and genuine sister trades.'
  }
];

const LOCAL_STORAGE_RULES_KEY = 'copper_mommies_moderation_rules_v1';
const LOCAL_STORAGE_SENSITIVITY_KEY = 'copper_mommies_moderation_sensitivity';

/**
 * Retrieve all active trigger rules (defaults + custom user-added rules)
 */
export function getStoredModerationRules(): ModerationTriggerRule[] {
  if (typeof window === 'undefined') {
    return DEFAULT_TRIGGER_RULES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(DEFAULT_TRIGGER_RULES));
      return DEFAULT_TRIGGER_RULES;
    }
    const parsed: ModerationTriggerRule[] = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRIGGER_RULES;
  } catch {
    return DEFAULT_TRIGGER_RULES;
  }
}

/**
 * Save a new custom trigger rule in Admin Back Office
 */
export function saveCustomModerationRule(rule: Omit<ModerationTriggerRule, 'id'>): ModerationTriggerRule {
  const current = getStoredModerationRules();
  const newRule: ModerationTriggerRule = {
    ...rule,
    id: `custom-trig-${Date.now()}`,
    isCustom: true
  };
  const updated = [newRule, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('copper_moderation_rules_updated'));
  }
  return newRule;
}

/**
 * Delete a moderation rule (or reset custom)
 */
export function deleteCustomModerationRule(ruleId: string): void {
  const current = getStoredModerationRules();
  const updated = current.filter(r => r.id !== ruleId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('copper_moderation_rules_updated'));
  }
}

/**
 * Reset rules to default sanctuary settings
 */
export function resetModerationRulesToDefault(): ModerationTriggerRule[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(DEFAULT_TRIGGER_RULES));
    window.dispatchEvent(new CustomEvent('copper_moderation_rules_updated'));
  }
  return DEFAULT_TRIGGER_RULES;
}

/**
 * Retrieve sensitivity level
 */
export function getModerationSensitivity(): 'strict' | 'balanced' | 'relaxed' {
  if (typeof window === 'undefined') return 'balanced';
  return (localStorage.getItem(LOCAL_STORAGE_SENSITIVITY_KEY) as any) || 'balanced';
}

/**
 * Update sensitivity level
 */
export function setModerationSensitivity(level: 'strict' | 'balanced' | 'relaxed'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_SENSITIVITY_KEY, level);
    window.dispatchEvent(new CustomEvent('copper_moderation_rules_updated'));
  }
}

/**
 * Main content scanner: tests text and title against active rules
 */
export function scanContentForTriggers(
  content: string, 
  title: string = '', 
  customRules?: ModerationTriggerRule[]
): ModerationScanResult {
  const fullText = `${title} ${content}`.trim();
  const rules = customRules || (typeof window !== 'undefined' ? getStoredModerationRules() : DEFAULT_TRIGGER_RULES);
  const matchedTriggers: MatchedTrigger[] = [];

  for (const rule of rules) {
    let isMatch = false;
    let snippet = '';

    try {
      if (rule.isRegex) {
        const regex = new RegExp(rule.pattern, 'i');
        const match = fullText.match(regex);
        if (match) {
          isMatch = true;
          snippet = match[0];
        }
      } else {
        const lowerText = fullText.toLowerCase();
        const lowerPattern = rule.pattern.toLowerCase();
        if (lowerText.includes(lowerPattern)) {
          isMatch = true;
          snippet = rule.pattern;
        }
      }
    } catch {
      // Regex parsing fallback
      if (fullText.toLowerCase().includes(rule.pattern.toLowerCase())) {
        isMatch = true;
        snippet = rule.pattern;
      }
    }

    if (isMatch) {
      matchedTriggers.push({
        word: snippet || rule.pattern,
        matchedSnippet: snippet || rule.pattern,
        category: rule.category,
        categoryLabel: rule.categoryLabel,
        severity: rule.severity,
        action: rule.action,
        reason: rule.reason
      });
    }
  }

  if (matchedTriggers.length === 0) {
    return {
      isClean: true,
      matchedTriggers: [],
      highestSeverity: 'none',
      recommendedAction: 'allow',
      summary: 'Clean: Passed Village Safety & Sanctuary filter.'
    };
  }

  // Determine highest severity & recommended action
  let highestSeverity: 'medium' | 'high' | 'critical' = 'medium';
  if (matchedTriggers.some(t => t.severity === 'critical')) {
    highestSeverity = 'critical';
  } else if (matchedTriggers.some(t => t.severity === 'high')) {
    highestSeverity = 'high';
  }

  const sensitivity = typeof window !== 'undefined' ? getModerationSensitivity() : 'balanced';

  let recommendedAction: 'allow' | 'flag_for_review' | 'block' = 'flag_for_review';
  if (highestSeverity === 'critical') {
    recommendedAction = 'block';
  } else if (highestSeverity === 'high') {
    recommendedAction = sensitivity === 'strict' ? 'block' : 'flag_for_review';
  } else {
    // medium
    recommendedAction = sensitivity === 'relaxed' ? 'allow' : 'flag_for_review';
  }

  const triggerNames = Array.from(new Set(matchedTriggers.map(t => `"${t.word}"`))).join(', ');
  const categoryNames = Array.from(new Set(matchedTriggers.map(t => t.categoryLabel))).join(' & ');

  const warningMessage = recommendedAction === 'block'
    ? `⚠️ Sanctuary Safety Notice: Your post contains prohibited language or sensitive triggers (${triggerNames}) under ${categoryNames}. In accordance with village guidelines, this content cannot be posted. Please adjust your words with love and respect.`
    : `🛡️ Community Guardian Note: Your post contains language flagged for moderator review (${triggerNames}). It has been submitted for Grandmother Council review in the Admin Back Office.`;

  return {
    isClean: false,
    matchedTriggers,
    highestSeverity,
    recommendedAction,
    warningMessage,
    summary: `Flagged: ${matchedTriggers.length} trigger(s) found in categories: ${categoryNames}.`
  };
}
