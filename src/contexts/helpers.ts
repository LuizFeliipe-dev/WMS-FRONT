import { User } from '@/types/auth';

export const normalizeRoute = (route: string): string =>
  route.replace(/^\/+|\/+$/g, '');

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('malldre_user');
    const token = localStorage.getItem('malldre_token');
    if (!raw || !token) return null;

    const parsed = JSON.parse(raw);
    if (!parsed.userId || !parsed.email || !Array.isArray(parsed.routes)) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const matchRoute = (permissionRoute: string, targetRoute: string): boolean => {
  const normPerm = normalizeRoute(permissionRoute);
  const normTarget = normalizeRoute(targetRoute);

  return (
    normPerm === normTarget || // exato
    normTarget.startsWith(normPerm + '/') || // subrota
    normPerm.endsWith('/') && normTarget === normPerm.slice(0, -1) // "/rota/" e "/rota"
  );
};
