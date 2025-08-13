'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';
import { ModalHeader } from './ModalHeader';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';

// TypeScript interfaces for Dialog props
export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  type?: 'alert' | 'confirm' | 'custom';
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  
  // Action buttons
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  
  // Custom footer
  footer?: React.ReactNode;
  
  // Loading state
  loading?: boolean;
  loadingText?: string;
}

// Dialog component for confirmation and alert dialogs
const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({
    open,
    onOpenChange,
    title,
    description,
    children,
    type = 'custom',
    variant = 'default',
    size = 'sm',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    footer,
    loading = false,
    loadingText = 'Loading...',
  }, ref) => {
    
    // Handle confirm action
    const handleConfirm = async () => {
      if (loading) return;
      
      try {
        await onConfirm?.();
        if (type !== 'custom') {
          onOpenChange?.(false);
        }
      } catch (error) {
        console.error('Dialog confirm action failed:', error);
      }
    };

    // Handle cancel action
    const handleCancel = () => {
      if (loading) return;
      
      onCancel?.();
      onOpenChange?.(false);
    };

    // Handle close
    const handleClose = () => {
      if (loading) return;
      onOpenChange?.(false);
    };

    // Variant icon mapping
    const variantIcons = {
      default: null,
      destructive: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
      warning: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-6 w-6 text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
      success: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ),
      info: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </div>
      ),
    };

    // Button variant mapping
    // Button variant mapping (reserved for future use)

    // Default footer for confirm and alert dialogs
    const defaultFooter = type !== 'custom' && (
      <ModalFooter>
        {type === 'confirm' && (
          <button
            type="button"
            className={cn(
              'inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
              'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="button"
          className={cn(
            'inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
            variant === 'destructive' && 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            variant === 'success' && 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
            variant === 'info' && 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            variant === 'default' && 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
          )}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {loadingText}
            </div>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    );

    return (
      <Modal
        ref={ref}
        open={open}
        {...(onOpenChange ? { onOpenChange } : {})}
        size={size}
        closeOnBackdropClick={closeOnBackdropClick && !loading}
        closeOnEscape={closeOnEscape && !loading}
      >
        {/* Header */}
        {(title || description) && (
          <ModalHeader
            title={title}
            subtitle={description}
            showCloseButton={showCloseButton && !loading}
            onClose={handleClose}
            bordered={false}
          />
        )}
        
        {/* Content */}
        <ModalContent padding="none" scrollable={false}>
          {/* Icon and content for predefined dialog types */}
          {type !== 'custom' && (
            <div className="flex items-start space-x-4">
              {/* Variant icon */}
              {variantIcons[variant] && (
                <div className="flex-shrink-0">
                  {variantIcons[variant]}
                </div>
              )}
              
              {/* Content area */}
              <div className="flex-1 min-w-0">
                {children && (
                  <div className="text-sm text-gray-600">
                    {children}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Custom content for custom type */}
          {type === 'custom' && children}
        </ModalContent>
        
        {/* Footer */}
        {footer || defaultFooter}
      </Modal>
    );
  }
);

Dialog.displayName = 'Dialog';

export { Dialog };