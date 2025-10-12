import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface InfoTooltipProps {
  message: string;
  className?: string;
}

export function InfoTooltip({ message, className = '' }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info 
            className={`h-4 w-4 text-[#0C53ED] hover:text-[#0C53ED]/80 cursor-help flex-shrink-0 ${className}`}
          />
        </TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent 
            side="top" 
            align="start"
            sideOffset={8}
            className="max-w-xs p-3 bg-white border border-gray-200 shadow-lg z-[9999] !z-[9999]"
            style={{ zIndex: 9999 }}
          >
            <p className="text-sm text-[#475569] leading-relaxed">{message}</p>
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  );
}
