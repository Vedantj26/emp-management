'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => void;
  isLoading?: boolean;
  cancelText?: string;
  submitText?: string;
  isViewMode?: boolean;
}

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  cancelText = 'Cancel',
  submitText = 'Submit',
  isViewMode
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
          {description && <DialogDescription className="text-sm">{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">{children}</div>
        <div className="flex gap-2 md:gap-3 justify-end pt-4 border-t flex-wrap">
          {!isViewMode && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-sm md:text-base"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="text-sm md:text-base"
              >
                {isLoading ? 'Loading...' : submitText}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
