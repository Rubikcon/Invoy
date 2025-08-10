// Session Timer Component - Shows remaining session time and handles expiry
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { secureAuthService } from '../../services/secureAuthService';

interface SessionTimerProps {
  onSessionExpired?: () => void;
  showTimer?: boolean;
  className?: string;
}

export default function SessionTimer({ 
  onSessionExpired, 
  showTimer = false, 
  className = '' 
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    const updateTimer = () => {
      const sessionInfo = secureAuthService.getSessionInfo();
      
      if (sessionInfo.isAuthenticated && sessionInfo.timeUntilExpiry) {
        setTimeLeft(sessionInfo.timeUntilExpiry);
        
        // Warn when less than 5 minutes left
        if (sessionInfo.timeUntilExpiry <= 5 * 60 * 1000 && sessionInfo.timeUntilExpiry > 0) {
          // Show warning notification
        }
        
        // Session expired
        if (sessionInfo.timeUntilExpiry <= 0) {
          onSessionExpired?.();
        }
      } else {
        setTimeLeft(null);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [onSessionExpired]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      await secureAuthService.refreshToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!timeLeft || !showTimer) {
    return null;
  }

  const isWarning = timeLeft <= 5 * 60 * 1000; // Less than 5 minutes
  const isCritical = timeLeft <= 2 * 60 * 1000; // Less than 2 minutes

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        isCritical 
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          : isWarning 
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        <Clock size={12} />
        <span>{formatTime(timeLeft)}</span>
      </div>
      
      {isWarning && (
        <button
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          title="Refresh session"
        >
          <RefreshCw size={12} className={`${isRefreshing ? 'animate-spin' : ''} text-gray-600 dark:text-gray-300`} />
        </button>
      )}
    </div>
  );
}