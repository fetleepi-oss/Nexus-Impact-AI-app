import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AsyncStorage } from './storage';

export interface PackageProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
}

export interface PurchasesPackage {
  identifier: string;
  packageType: 'MONTHLY' | 'ANNUAL' | 'CUSTOM';
  product: PackageProduct;
}

export interface PurchasesOffering {
  identifier: string;
  serverDescription: string;
  monthly: PurchasesPackage | null;
  annual: PurchasesPackage | null;
  availablePackages: PurchasesPackage[];
}

export interface PurchasesOfferings {
  all: Record<string, PurchasesOffering>;
  current: PurchasesOffering | null;
}

export interface EntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  latestPurchaseDate: string;
  expirationDate?: string | null;
}

export interface CustomerInfo {
  entitlements: {
    active: Record<string, EntitlementInfo>;
    all: Record<string, EntitlementInfo>;
  };
  activeSubscriptions: string[];
}

// Storage key for emulated / cached entitlement
const PRO_STORAGE_KEY = '@nexus_rc_entitled_pro';

// Simulated default offering for RevenueCat Test Store
export const DEFAULT_TEST_OFFERING: PurchasesOffering = {
  identifier: 'default',
  serverDescription: 'Default Social Impact NGO Packages',
  monthly: {
    identifier: '$rc_monthly',
    packageType: 'MONTHLY',
    product: {
      identifier: 'nexus_pro_monthly',
      title: 'Nexus Pro Monthly',
      description: 'Full access to all 7 specialized impact agents, billed monthly.',
      priceString: '$9.99/mo',
      price: 9.99,
      currencyCode: 'USD'
    }
  },
  annual: {
    identifier: '$rc_annual',
    packageType: 'ANNUAL',
    product: {
      identifier: 'nexus_pro_annual',
      title: 'Nexus Pro Annual (Best Value)',
      description: 'Full access with offline field crisis mode, billed annually ($6.67/mo).',
      priceString: '$79.99/yr',
      price: 79.99,
      currencyCode: 'USD'
    }
  },
  availablePackages: []
};
DEFAULT_TEST_OFFERING.availablePackages = [
  DEFAULT_TEST_OFFERING.monthly!,
  DEFAULT_TEST_OFFERING.annual!
];

// In-memory listeners list for CustomerInfo updates
type CustomerInfoListener = (customerInfo: CustomerInfo) => void;
const listeners: Set<CustomerInfoListener> = new Set();

let isConfigured = false;
let currentCustomerInfo: CustomerInfo = {
  entitlements: { active: {}, all: {} },
  activeSubscriptions: []
};

// Check environment variable
function getRevenueCatApiKey(): string {
  return (
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_REVENUECAT_API_KEY) ||
    (import.meta as any).env?.EXPO_PUBLIC_REVENUECAT_API_KEY ||
    (import.meta as any).env?.VITE_REVENUECAT_API_KEY ||
    (typeof window !== 'undefined' && (window as any).EXPO_PUBLIC_REVENUECAT_API_KEY) ||
    'test_store_nexus_demo_key'
  );
}

/**
 * Configure Purchases on app startup
 */
export async function configurePurchases(): Promise<void> {
  if (isConfigured) return;

  const apiKey = getRevenueCatApiKey();
  console.log(`[RevenueCat] Initializing Purchases with key: ${apiKey.slice(0, 10)}...`);

  // Load persisted entitlement state
  try {
    const isEntitled = await AsyncStorage.getItem(PRO_STORAGE_KEY);
    if (isEntitled === 'true') {
      currentCustomerInfo = {
        entitlements: {
          active: {
            pro: {
              identifier: 'pro',
              isActive: true,
              willRenew: true,
              latestPurchaseDate: new Date().toISOString()
            }
          },
          all: {}
        },
        activeSubscriptions: ['nexus_pro_annual']
      };
    }
  } catch (err) {
    console.warn('[RevenueCat] Failed to load entitlement cache:', err);
  }

  isConfigured = true;
  notifyListeners(currentCustomerInfo);
}

/**
 * Retrieve current offerings
 */
export async function getOfferings(): Promise<PurchasesOfferings> {
  if (!isConfigured) {
    await configurePurchases();
  }

  // Artificial short delay to emulate network fetch
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    all: { default: DEFAULT_TEST_OFFERING },
    current: DEFAULT_TEST_OFFERING
  };
}

/**
 * Purchase a selected package (monthly or annual)
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; productIdentifier: string }> {
  if (!isConfigured) {
    await configurePurchases();
  }

  // Simulate purchasing workflow
  await new Promise((resolve) => setTimeout(resolve, 800));

  const entitlement: EntitlementInfo = {
    identifier: 'pro',
    isActive: true,
    willRenew: true,
    latestPurchaseDate: new Date().toISOString()
  };

  currentCustomerInfo = {
    entitlements: {
      active: { pro: entitlement },
      all: { pro: entitlement }
    },
    activeSubscriptions: [pkg.product.identifier]
  };

  await AsyncStorage.setItem(PRO_STORAGE_KEY, 'true');
  notifyListeners(currentCustomerInfo);

  return {
    customerInfo: currentCustomerInfo,
    productIdentifier: pkg.product.identifier
  };
}

/**
 * Restore past purchases
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  if (!isConfigured) {
    await configurePurchases();
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  // Check if user was previously entitled in storage
  const isEntitled = await AsyncStorage.getItem(PRO_STORAGE_KEY);
  if (isEntitled === 'true') {
    const entitlement: EntitlementInfo = {
      identifier: 'pro',
      isActive: true,
      willRenew: true,
      latestPurchaseDate: new Date().toISOString()
    };
    currentCustomerInfo = {
      entitlements: {
        active: { pro: entitlement },
        all: { pro: entitlement }
      },
      activeSubscriptions: ['nexus_pro_restored']
    };
  } else {
    currentCustomerInfo = {
      entitlements: { active: {}, all: {} },
      activeSubscriptions: []
    };
  }

  notifyListeners(currentCustomerInfo);
  return currentCustomerInfo;
}

/**
 * Reset entitlement (testing convenience)
 */
export async function resetProEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(PRO_STORAGE_KEY);
  currentCustomerInfo = {
    entitlements: { active: {}, all: {} },
    activeSubscriptions: []
  };
  notifyListeners(currentCustomerInfo);
}

/**
 * Subscribe to CustomerInfo updates
 */
export function addCustomerInfoUpdateListener(
  listener: CustomerInfoListener
): () => void {
  listeners.add(listener);
  // Fire immediately with current state
  listener(currentCustomerInfo);

  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(info: CustomerInfo) {
  listeners.forEach((listener) => {
    try {
      listener(info);
    } catch (e) {
      console.error('[RevenueCat] Error in listener callback:', e);
    }
  });
}

/**
 * Hook: useIsPro() checks if the entitlement "pro" is active
 * and updates dynamically via addCustomerInfoUpdateListener
 */
export function useIsPro(): {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
} {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(
    isConfigured ? currentCustomerInfo : null
  );
  const [loading, setLoading] = useState<boolean>(!isConfigured);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      if (!isConfigured) {
        await configurePurchases();
      }
      setLoading(false);
      unsubscribe = addCustomerInfoUpdateListener((info) => {
        setCustomerInfo(info);
      });
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isPro = Boolean(customerInfo?.entitlements?.active?.['pro']?.isActive);

  return { isPro, loading, customerInfo };
}

// Global Context & Provider
interface PurchasesContextType {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  resetProEntitlement: () => Promise<void>;
  refreshOfferings: () => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPro, loading, customerInfo } = useIsPro();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);

  const refreshOfferings = async () => {
    try {
      const data = await getOfferings();
      setOfferings(data);
    } catch (e) {
      console.error('[RevenueCat] Failed to fetch offerings:', e);
    }
  };

  useEffect(() => {
    refreshOfferings();
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage): Promise<CustomerInfo> => {
    const result = await purchasePackage(pkg);
    return result.customerInfo;
  };

  const handleRestore = async (): Promise<CustomerInfo> => {
    return await restorePurchases();
  };

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        loading,
        customerInfo,
        offerings,
        purchasePackage: handlePurchase,
        restorePurchases: handleRestore,
        resetProEntitlement,
        refreshOfferings
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export function usePurchases(): PurchasesContextType {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchasesProvider');
  }
  return context;
};
