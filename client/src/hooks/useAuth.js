import { useSelector } from 'react-redux';
import { ROLES } from '../utils/constants';

const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const isRole = (role) => user?.role === role;

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case ROLES.CANDIDATE:
        return '/dashboard/candidate';
      case ROLES.RECRUITER:
        return '/dashboard/company';
      case ROLES.SUPERADMIN:
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isRole,
    getDashboardPath,
    isCandidate: isRole(ROLES.CANDIDATE),
    isRecruiter: isRole(ROLES.RECRUITER),
    isSuperAdmin: isRole(ROLES.SUPERADMIN),
  };
};

export default useAuth;
