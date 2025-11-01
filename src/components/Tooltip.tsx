import { ReactNode, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  iconClassName?: string;
}

export default function Tooltip({ content, children, iconClassName = "text-gray-400 hover:text-gray-600" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => e.preventDefault()}
        className={`transition-colors ${iconClassName}`}
      >
        {children || <HelpCircle className="h-4 w-4" />}
      </button>

      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[9999] pointer-events-none w-max max-w-sm">
          {/* Arrow pointing up */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-blue-50 border-l border-t border-blue-200 transform rotate-45"></div>

          {/* Tooltip content */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-2xl">
            <div className="text-sm text-gray-700">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
