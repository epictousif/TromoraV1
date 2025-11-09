import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { countryCodes } from '@/data/countryCodes';

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CountryCodeSelect({ value, onChange, className = '' }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCountry = countryCodes.find(country => country.code === value) || countryCodes[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-24 rounded-l-md border border-r-0 border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-11"
          id="country-code-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <span className="mr-1">{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-60 overflow-auto">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {countryCodes.map((country) => (
              <button
                key={`${country.code}-${country.name}`}
                className={`${
                  value === country.code ? 'bg-gray-100' : 'text-gray-700'
                } flex items-center justify-center w-full px-3 py-2 text-sm hover:bg-gray-100`}
                role="menuitem"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
              >
                <span className="mr-1">{country.flag}</span>
                <span>{country.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CountryCodeSelect;
