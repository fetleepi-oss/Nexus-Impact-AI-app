import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';

const DEFAULT_TEST_KEY = 'test_bxrpYHfEUPnjAzjXewMlpxhMkZv';
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;

let isConfigured = false;

/**
 * Configure Purchases on app startup.
 * Skips Purchases on web platforms where native billing is not supported.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function configurePurchases(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  if (isConfigured) return;

  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;
    const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || DEFAULT_TEST_KEY;

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: iosApiKey });
      isConfigured = true;
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: androidApiKey });
      isConfigured = true;
    }
  } catch (error) {
    console.error('[RevenueCat] configure error:', error);
  }
}

/**
 * Fetch current offerings configured in RevenueCat.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const offerings = await Purchases.getOfferings();
      return offerings;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] Failed to fetch offerings:', error);
    return null;
  }
}

/**
 * Purchase a package (monthly or annual).
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') {
    console.warn('[RevenueCat] In-app purchases are only supported on Android and iOS devices.');
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] purchasePackage failed:', error);
    throw error;
  }
}

/**
 * Restore user purchases.
 * Guarded by Platform.OS !== 'web' and wrapped in try/catch.
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') {
    console.warn('[RevenueCat] Purchase restore is only supported on mobile devices.');
    return null;
  }
  try {
    if (!isConfigured) await configurePurchases();
    if (Platform.OS !== 'web') {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    }
    return null;
  } catch (error) {
    console.error('[RevenueCat] restorePurchases failed:', error);
    throw error;
  }
}

/**
 * Hook: useIsPro()
 * Checks if the entitlement "pro" is active and stays synced
 * via Purchases.addCustomerInfoUpdateListener
 */
export function useIsPro(): {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
} {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function init() {
      try {
        await configurePurchases();
        if (Platform.OS !== 'web') {
          const info = await Purchases.getCustomerInfo();
          if (isMounted) {
            setCustomerInfo(info);
            setLoading(false);
          }
        }
      } catch (e) {
        console.warn('[RevenueCat] getCustomerInfo failed:', e);
        if (isMounted) setLoading(false);
      }
    }

    init();

    try {
      if (Platform.OS !== 'web') {
        const listener = (info: CustomerInfo) => {
          if (isMounted) {
            setCustomerInfo(info);
          }
        };
        Purchases.addCustomerInfoUpdateListener(listener);
      }
    } catch (e) {
      console.warn('[RevenueCat] addCustomerInfoUpdateListener failed:', e);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const isPro = Boolean(customerInfo?.entitlements?.active?.['pro']?.isActive);

  return { isPro, loading, customerInfo };
}

// Global Provider & Context
interface PurchasesContextType {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  refreshOfferings: () => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPro, loading, customerInfo } = useIsPro();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);

  const refreshOfferings = async () => {
    if (Platform.OS === 'web') return;
    try {
      const data = await getOfferings();
      setOfferings(data);
    } catch (err) {
      console.warn('[RevenueCat] refreshOfferings failed:', err);
    }
  };

  useEffect(() => {
    refreshOfferings();
  }, []);

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        loading,
        customerInfo,
        offerings,
        purchasePackage,
        restorePurchases,
        refreshOfferings,
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
}
