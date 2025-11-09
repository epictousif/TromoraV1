import { useEffect, useRef } from 'react';
import { initGoogleAuth } from '@/services/authService';

interface GoogleSignInProps {
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
  className?: string;
}

export function GoogleSignIn({ onSuccess, onFailure, className = '' }: GoogleSignInProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        initGoogleAuth(onSuccess, onFailure);
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [onSuccess, onFailure]);

  return (
    <div className={`w-full ${className}`}>
      <div 
        id="googleSignInButton"
        ref={googleButtonRef}
        className="w-full flex justify-center"
      />
    </div>
  );
}

export default GoogleSignIn;
