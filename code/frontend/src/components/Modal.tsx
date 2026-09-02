'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

interface ModalProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function Modal({ id, title, children }: ModalProps) {
  const { activeModal, closeModal } = useUiStore();

  if (activeModal !== id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-surface-border bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
