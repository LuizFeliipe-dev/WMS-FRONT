import { User } from '@/types/auth';
import { matchRoute } from '@/contexts/helpers';

export const canAccessEntry = (user: User | null) => {
  if (!user) return false;
  return user.routes.some(r => matchRoute(r.route, '/supplier') && r.writer)
    && user.routes.some(r => matchRoute(r.route, '/product') && r.writer);
};

export const canAccessTransaction = (user: User | null) => {
  if (!user) return false;
  const required = ['/rack', '/product', '/product/location', '/shelf', '/transaction'];
  return required.every(route =>
    user.routes.some(r => matchRoute(r.route, route) && r.writer)
  );
};

export const canAccessTasks = (user: User | null) => {
  if (!user) return false;
  return user.routes.some(r => matchRoute(r.route, '/load'));
};

export const canAccessTaskHistory = (user: User | null) => {
  if (!user) return false;
  return ['/load', '/load/status'].every(route =>
    user.routes.some(r => matchRoute(r.route, route))
  );
};
