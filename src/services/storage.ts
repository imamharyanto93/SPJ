import { DEFAULT_SCHOOL_PROFILE, INITIAL_TRANSACTIONS } from '../data/defaultData';
import { SchoolProfile, TransactionDocument } from '../types/procurement';

const TX_KEY = 'sp_app_transactions_v2';
const PROFILE_KEY = 'sp_app_school_profile_v2';
const SEARCH_HISTORY_KEY = 'sp_app_search_history_v2';

export const storageService = {
  getTransactions(): TransactionDocument[] {
    try {
      const data = localStorage.getItem(TX_KEY);
      if (!data) {
        localStorage.setItem(TX_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading transactions from storage', e);
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: TransactionDocument[]): void {
    try {
      localStorage.setItem(TX_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed saving transactions to storage', e);
    }
  },

  getTransactionById(id: string): TransactionDocument | undefined {
    const list = this.getTransactions();
    return list.find((t) => t.id === id);
  },

  upsertTransaction(tx: TransactionDocument): void {
    const list = this.getTransactions();
    const idx = list.findIndex((t) => t.id === tx.id);
    if (idx >= 0) {
      list[idx] = { ...tx, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...tx, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveTransactions(list);
  },

  deleteTransaction(id: string): void {
    const list = this.getTransactions().filter((t) => t.id !== id);
    this.saveTransactions(list);
  },

  getSchoolProfile(): SchoolProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_SCHOOL_PROFILE));
        return DEFAULT_SCHOOL_PROFILE;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SCHOOL_PROFILE;
    }
  },

  saveSchoolProfile(profile: SchoolProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving school profile', e);
    }
  },

  getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(SEARCH_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSearchHistory(query: string): void {
    if (!query || query.trim().length === 0) return;
    const clean = query.trim();
    let history = this.getSearchHistory().filter((item) => item.toLowerCase() !== clean.toLowerCase());
    history.unshift(clean);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  },

  clearSearchHistory(): void {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  },

  resetToDefault(): void {
    localStorage.setItem(TX_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_SCHOOL_PROFILE));
  },

  exportBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolProfile: this.getSchoolProfile(),
      transactions: this.getTransactions(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        this.saveTransactions(parsed.transactions);
      }
      if (parsed.schoolProfile) {
        this.saveSchoolProfile(parsed.schoolProfile);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};
