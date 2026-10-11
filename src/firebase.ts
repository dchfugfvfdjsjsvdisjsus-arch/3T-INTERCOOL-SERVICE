import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { QuotationRequest, ServiceItem, CompanyProfile } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error logging conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline. Please check network/config.');
    }
  }
}

// Submitting a new quotation request
export async function submitQuotationRequest(data: Omit<QuotationRequest, 'id' | 'createdAt' | 'status'> & { status?: string }) {
  const path = 'quotations';
  try {
    const payload: QuotationRequest = {
      customerName: data.customerName.trim().slice(0, 100),
      phone: data.phone.trim().slice(0, 20),
      serviceType: data.serviceType,
      status: 'pending',
      createdAt: new Date().toISOString(),
      urgent: Boolean(data.urgent),
    };

    if (data.email && data.email.trim()) {
      payload.email = data.email.trim().slice(0, 120);
    }
    if (data.lineId && data.lineId.trim()) {
      payload.lineId = data.lineId.trim().slice(0, 50);
    }
    if (data.location && data.location.trim()) {
      payload.location = data.location.trim().slice(0, 250);
    }
    if (data.details && data.details.trim()) {
      payload.details = data.details.trim().slice(0, 1000);
    }

    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Realtime Quotations listener
export function subscribeToQuotations(
  callback: (quotations: QuotationRequest[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'quotations';
  const q = query(collection(db, path));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const items: QuotationRequest[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as QuotationRequest;
        item.id = docSnap.id;
        items.push(item);
      });
      // Sort in memory by createdAt descending
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Update quotation status and admin notes
export async function updateQuotation(id: string, updates: Partial<QuotationRequest>) {
  const path = `quotations/${id}`;
  try {
    const docRef = doc(db, 'quotations', id);
    const sanitizedUpdates: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Delete a quotation
export async function deleteQuotation(id: string) {
  const path = `quotations/${id}`;
  try {
    await deleteDoc(doc(db, 'quotations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to services
export function subscribeToServices(
  callback: (services: ServiceItem[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'services';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ServiceItem[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as ServiceItem;
        item.id = docSnap.id;
        items.push(item);
      });
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Save or update service item
export async function saveServiceItem(service: ServiceItem) {
  const path = service.id ? `services/${service.id}` : 'services';
  try {
    const payload = {
      title: service.title.trim().slice(0, 120),
      category: service.category,
      summary: service.summary.trim().slice(0, 300),
      features: service.features ? service.features.trim().slice(0, 500) : '',
      isActive: Boolean(service.isActive),
      order: Number(service.order ?? 0),
      updatedAt: new Date().toISOString(),
    };

    if (service.id) {
      await updateDoc(doc(db, 'services', service.id), payload);
      return service.id;
    } else {
      const docRef = await addDoc(collection(db, 'services'), payload);
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, service.id ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

// Delete service item
export async function deleteServiceItem(id: string) {
  const path = `services/${id}`;
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to company info
export function subscribeToCompanyInfo(
  callback: (info: CompanyProfile | null) => void,
  onError?: (err: Error) => void
) {
  const path = 'company_info';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
      } else {
        const docSnap = snapshot.docs[0];
        const item = docSnap.data() as CompanyProfile;
        item.id = docSnap.id;
        callback(item);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Save company profile
export async function saveCompanyProfile(info: CompanyProfile) {
  const path = 'company_info/main';
  try {
    const payload: Record<string, unknown> = {
      companyNameTh: info.companyNameTh.trim().slice(0, 150),
      companyNameEn: info.companyNameEn.trim().slice(0, 150),
      phone: info.phone.trim().slice(0, 30),
      email: info.email.trim().slice(0, 100),
      updatedAt: new Date().toISOString(),
    };

    if (info.managingDirectorTh) payload.managingDirectorTh = info.managingDirectorTh.trim().slice(0, 100);
    if (info.managingDirectorEn) payload.managingDirectorEn = info.managingDirectorEn.trim().slice(0, 100);
    if (info.managerTh) payload.managerTh = info.managerTh.trim().slice(0, 100);
    if (info.managerEn) payload.managerEn = info.managerEn.trim().slice(0, 100);
    if (info.managerPhone) payload.managerPhone = info.managerPhone.trim().slice(0, 30);
    if (info.managerLineId) payload.managerLineId = info.managerLineId.trim().slice(0, 50);
    if (info.lineId) payload.lineId = info.lineId.trim().slice(0, 50);
    if (info.address) payload.address = info.address.trim().slice(0, 300);
    if (info.announcement) payload.announcement = info.announcement.trim().slice(0, 500);

    await setDoc(doc(db, 'company_info', 'main'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
