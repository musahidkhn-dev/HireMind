import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser, setInitialized } from '../../store/authSlice';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const SocialCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isProfileComplete = searchParams.get('isProfileComplete') === 'true';

    if (accessToken && refreshToken) {
      // Save tokens to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user data
      dispatch(fetchCurrentUser()).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          if (!isProfileComplete) {
            navigate('/complete-profile', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          toast.error('Failed to login via social account');
          navigate('/login', { replace: true });
        }
      });
    } else {
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return <Loader fullScreen text="Finalizing authentication..." />;
};

export default SocialCallback;
