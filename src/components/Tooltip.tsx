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
        <div className="fixed z-[9999] pointer-events-none" style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-2xl max-w-md">
            <div className="text-sm text-gray-700">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
