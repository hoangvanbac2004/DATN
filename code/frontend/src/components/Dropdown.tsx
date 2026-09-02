'use client';

import { ReactNode, useState } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-surface-border bg-background shadow-lg p-1 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
