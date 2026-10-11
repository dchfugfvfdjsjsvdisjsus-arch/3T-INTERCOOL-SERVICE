# Security Specification: 3T Intercool & Service

## 1. Data Invariants
- `quotations`: Public customers can submit a quotation request with sanitized strings and status defaulting to 'pending'. Only authenticated admins or staff can list/read/update/delete quotation requests.
- `services`: Public visitors can read active services. Only authenticated admins can create, update, or delete service items.
- `company_info`: Public visitors can read company profile and contact details. Only authenticated admins can modify company info.
- `admins`: Contains documents with UID keys. An authenticated user exists in `/admins/{uid}` or matches designated manager email (`3t.intercool@gmail.com` / `methasitbaraphom63@gmail.com`).

## 2. The "Dirty Dozen" Payloads (Denial & Abuse Protection)
1. Injected ghost fields in Quotation (`hackRole: "superadmin"`) - REJECTED by strict key checks.
2. Injected 2MB text in `details` or `customerName` - REJECTED by max size limit.
3. Unauthenticated client reading all customer quotation requests and phone numbers - REJECTED (only admin can list quotations).
4. Unauthenticated client deleting or modifying customer quotation status to 'completed' - REJECTED.
5. Injected invalid ID path variable with malicious symbols - REJECTED by `isValidId`.
6. Self-promotion by setting user role directly on document creation - REJECTED.
7. Modifying `createdAt` timestamp after quotation creation - REJECTED by immutable check.
8. Unauthenticated client creating or altering company service rates or catalog - REJECTED.
9. Modifying company contact information by non-admin - REJECTED.
10. Setting quotation status to an unknown arbitrary enum value - REJECTED.
11. Blank/empty customer name or phone on quotation submission - REJECTED by minLength.
12. Attempting to bypass security by omitting required fields - REJECTED by `hasAll`.

## 3. Test Runner (firestore.rules.test.ts)
A test suite will confirm permissions enforcement.
