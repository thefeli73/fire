'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

type TooltipProps = Readonly<
  React.ComponentProps<typeof TooltipPrimitive.Root> & React.ComponentProps<typeof PopoverPrimitive.Root>
>;

type TooltipTriggerProps = Readonly<
  React.ComponentProps<typeof TooltipPrimitive.Trigger> &
    React.ComponentProps<typeof PopoverPrimitive.Trigger>
>;

type TooltipContentProps = Readonly<
  React.ComponentProps<typeof TooltipPrimitive.Content> &
    React.ComponentProps<typeof PopoverPrimitive.Content>
>;

const TooltipTouchContext = React.createContext<boolean>(false);

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(pointer: coarse)').matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsTouch(event.matches);
    };

    setIsTouch(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isTouch;
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: Readonly<React.ComponentProps<typeof TooltipPrimitive.Provider>>) {
  return (
    <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
  );
}

function Tooltip({ children, ...props }: TooltipProps) {
  const isTouch = useIsTouchDevice();

  return (
    <TooltipProvider>
      <TooltipTouchContext.Provider value={isTouch}>
        {isTouch ? (
          <PopoverPrimitive.Root data-slot="tooltip" data-touch="true" {...props}>
            {children}
          </PopoverPrimitive.Root>
        ) : (
          <TooltipPrimitive.Root data-slot="tooltip" data-touch="false" {...props}>
            {children}
          </TooltipPrimitive.Root>
        )}
      </TooltipTouchContext.Provider>
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  const isTouch = React.useContext(TooltipTouchContext);

  return isTouch ? (
    <PopoverPrimitive.Trigger data-slot="tooltip-trigger" data-touch="true" {...props} />
  ) : (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" data-touch="false" {...props} />
  );
}

function TooltipContent({ className, sideOffset = 0, children, ...props }: TooltipContentProps) {
  const isTouch = React.useContext(TooltipTouchContext);

  if (isTouch) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="tooltip-content"
          data-touch="true"
          sideOffset={sideOffset}
          className={cn(
            'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-popover-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance shadow-md outline-hidden',
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-touch="false"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
