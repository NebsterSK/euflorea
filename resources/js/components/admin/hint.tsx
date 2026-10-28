import type { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Hover and focus tooltip for icon-only controls. The wrapper is the trigger
 * because a disabled button gets no pointer events; focus inside it still
 * opens the tooltip for keyboard users.
 */
export function Hint({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex">{children}</span>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
