import { redirect } from 'next/navigation';

/**
 * Canonical farmer workspace is /app-v2.
 * Keep this legacy route as a compatibility redirect so old links do not
 * create a second, competing farmer dashboard implementation.
 */
export default function DashboardRedirect() {
  redirect('/app-v2');
}
