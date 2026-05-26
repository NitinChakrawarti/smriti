// Persistent offline queue for shared content that failed to upload.
// Uses IndexedDB so data survives page reloads and PWA restarts.

export interface ShareQueueItem {
  id?: number;
  url?: string;
  text?: string;
  title?: string;
  status: 'pending' | 'processing' | 'done';
  addedAt: number;
  retries: number;
}

const DB_NAME = 'smriti-share-queue';
const DB_VERSION = 1;
const STORE = 'queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueShare(item: Omit<ShareQueueItem, 'id' | 'status' | 'addedAt' | 'retries'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add({
      ...item,
      status: 'pending',
      addedAt: Date.now(),
      retries: 0,
    } satisfies Omit<ShareQueueItem, 'id'>);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingShares(): Promise<ShareQueueItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).index('status').getAll('pending');
    req.onsuccess = () => resolve(req.result as ShareQueueItem[]);
    req.onerror = () => reject(req.error);
  });
}

export async function markShareDone(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result as ShareQueueItem;
      if (!item) return resolve();
      const putReq = store.put({ ...item, status: 'done' });
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function incrementRetry(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result as ShareQueueItem;
      if (!item) return resolve();
      const putReq = store.put({ ...item, retries: item.retries + 1 });
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function clearDoneShares(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.index('status').openCursor(IDBKeyRange.only('done'));
    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// Register Background Sync if available so the SW can retry
export function requestBackgroundSync(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then((reg) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reg as any).sync?.register('smriti-share-sync').catch(() => {});
  }).catch(() => {});
}

// Ask the SW to show a native notification (works in standalone PWA)
export function notifySW(title: string, body: string): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SHOW_NOTIFICATION', title, body });
  }
}
