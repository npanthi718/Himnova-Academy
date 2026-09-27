'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  HelpCircle,
  X,
  Sparkles,
  ShieldAlert,
  Trash2,
  Check
} from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onClose?: () => void;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showAlert: (options: AlertOptions | string, title?: string, type?: AlertType) => Promise<void>;
  showConfirm: (options: ConfirmOptions | string, title?: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Global references for imperative calls
let globalShowAlert: ((options: AlertOptions | string, title?: string, type?: AlertType) => Promise<void>) | null = null;
let globalShowConfirm: ((options: ConfirmOptions | string, title?: string) => Promise<boolean>) | null = null;

export const appAlert = (options: AlertOptions | string, title = 'Notification', type: AlertType = 'info'): Promise<void> => {
  if (globalShowAlert) {
    return globalShowAlert(options, title, type);
  }
  return Promise.resolve();
};

export const appConfirm = (options: ConfirmOptions | string, title = 'Please Confirm'): Promise<boolean> => {
  if (globalShowConfirm) {
    return globalShowConfirm(options, title);
  }
  return Promise.resolve(true);
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Alert State
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    confirmText: string;
    resolve?: () => void;
  } | null>(null);

  // Confirm State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
    cancelText: string;
    resolve?: (val: boolean) => void;
  } | null>(null);

  const showAlert = useCallback(
    (options: AlertOptions | string, defaultTitle?: string, defaultType: AlertType = 'info'): Promise<void> => {
      return new Promise<void>((resolve) => {
        let opts: AlertOptions;
        if (typeof options === 'string') {
          opts = {
            message: options,
            title: defaultTitle || (defaultType === 'success' ? 'Success' : defaultType === 'error' ? 'Notice' : 'Notification'),
            type: defaultType,
          };
        } else {
          opts = options;
        }

        setAlertState({
          isOpen: true,
          title: opts.title || (opts.type === 'success' ? 'Success' : opts.type === 'error' ? 'Notice' : 'Notification'),
          message: opts.message,
          type: opts.type || 'info',
          confirmText: opts.confirmText || 'OK, Got It',
          resolve: () => {
            if (opts.onClose) opts.onClose();
            resolve();
          },
        });
      });
    },
    []
  );

  const showConfirm = useCallback(
    (options: ConfirmOptions | string, defaultTitle = 'Confirmation Required'): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        let opts: ConfirmOptions;
        if (typeof options === 'string') {
          opts = {
            message: options,
            title: defaultTitle,
            type: 'danger',
          };
        } else {
          opts = options;
        }

        setConfirmState({
          isOpen: true,
          title: opts.title || 'Confirmation Required',
          message: opts.message,
          type: opts.type || 'danger',
          confirmText: opts.confirmText || 'Confirm & Proceed',
          cancelText: opts.cancelText || 'Cancel',
          resolve,
        });
      });
    },
    []
  );

  // Set global singleton handlers & intercept window.alert
  useEffect(() => {
    globalShowAlert = showAlert;
    globalShowConfirm = showConfirm;

    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      
      window.alert = (msg?: any) => {
        const strMsg = String(msg || '');
        const isSuccess = strMsg.toLowerCase().includes('success') || strMsg.includes('🎉') || strMsg.includes('✅') || strMsg.includes('🚀');
        const isError = strMsg.toLowerCase().includes('fail') || strMsg.toLowerCase().includes('error') || strMsg.includes('unable');
        const isWarning = strMsg.toLowerCase().includes('warn') || strMsg.toLowerCase().includes('invalid');
        
        showAlert({
          title: isSuccess ? 'Success' : isError ? 'Error Notification' : isWarning ? 'Notice' : 'Himnova Academy Alert',
          message: strMsg,
          type: isSuccess ? 'success' : isError ? 'error' : isWarning ? 'warning' : 'info',
        });
      };

      return () => {
        globalShowAlert = null;
        globalShowConfirm = null;
        window.alert = originalAlert;
      };
    }
  }, [showAlert, showConfirm]);

  const handleCloseAlert = useCallback(() => {
    if (alertState?.resolve) {
      alertState.resolve();
    }
    setAlertState(null);
  }, [alertState]);

  const handleConfirmAction = useCallback((result: boolean) => {
    if (confirmState?.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState(null);
  }, [confirmState]);

  // Handle ESC and ENTER keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (alertState?.isOpen) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCloseAlert();
        }
      } else if (confirmState?.isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleConfirmAction(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirmAction(true);
        }
      }
    };

    if (alertState?.isOpen || confirmState?.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [alertState, confirmState, handleCloseAlert, handleConfirmAction]);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* ========================================================================= */}
      {/* BEAUTIFUL CENTERED ALERT MODAL WITH MULTIPLE CLEAR EXIT OPTIONS            */}
      {/* ========================================================================= */}
      {alertState && alertState.isOpen && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn no-print cursor-pointer"
          onClick={handleCloseAlert}
          role="dialog"
          aria-modal="true"
          aria-label={alertState.title}
        >
          <div 
            className="relative w-full max-w-md rounded-3xl bg-[#0B132B] border border-white/20 p-6 sm:p-7 shadow-2xl text-center space-y-5 animate-scaleUp cursor-default overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Decorative Aura */}
            <div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-50 ${
                alertState.type === 'success'
                  ? 'bg-emerald-500'
                  : alertState.type === 'error'
                  ? 'bg-red-500'
                  : alertState.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
            />

            {/* Top Right Close 'X' Button */}
            <button
              type="button"
              onClick={handleCloseAlert}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer hover:rotate-90"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon Header */}
            <div className="relative flex justify-center pt-2">
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center border shadow-xl ${
                  alertState.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : alertState.type === 'error'
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : alertState.type === 'warning'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                }`}
              >
                {alertState.type === 'success' && <CheckCircle2 className="h-9 w-9" />}
                {alertState.type === 'error' && <XCircle className="h-9 w-9" />}
                {alertState.type === 'warning' && <AlertTriangle className="h-9 w-9" />}
                {alertState.type === 'info' && <Info className="h-9 w-9" />}
              </div>
            </div>

            {/* Title & Message Body */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black font-display text-white tracking-tight">
                {alertState.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed px-2">
                {alertState.message}
              </p>
            </div>

            {/* High-Contrast Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCloseAlert}
                autoFocus
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                  alertState.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-emerald-500/30'
                    : alertState.type === 'error'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:brightness-110 shadow-red-500/30'
                    : alertState.type === 'warning'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-cyan-500/30'
                }`}
              >
                <Check className="h-4 w-4 stroke-[3]" />
                <span>{alertState.confirmText}</span>
              </button>
            </div>

            {/* Micro Helper Note */}
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              Click anywhere outside or press <span className="text-slate-300 font-mono bg-white/10 px-1 py-0.5 rounded">ESC</span> to dismiss
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BEAUTIFUL CENTERED CONFIRMATION MODAL                                     */}
      {/* ========================================================================= */}
      {confirmState && confirmState.isOpen && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn no-print cursor-pointer"
          onClick={() => handleConfirmAction(false)}
          role="dialog"
          aria-modal="true"
          aria-label={confirmState.title}
        >
          <div 
            className="relative w-full max-w-md rounded-3xl bg-[#0B132B] border border-white/20 p-6 sm:p-7 shadow-2xl text-center space-y-5 animate-scaleUp cursor-default overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Right Close 'X' Button */}
            <button
              type="button"
              onClick={() => handleConfirmAction(false)}
              aria-label="Cancel"
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer hover:rotate-90"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Icon */}
            <div className="relative flex justify-center pt-2">
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center border shadow-xl ${
                  confirmState.type === 'danger'
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : confirmState.type === 'warning'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                }`}
              >
                {confirmState.type === 'danger' ? (
                  <Trash2 className="h-8 w-8" />
                ) : confirmState.type === 'warning' ? (
                  <AlertTriangle className="h-8 w-8" />
                ) : (
                  <HelpCircle className="h-8 w-8" />
                )}
              </div>
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black font-display text-white tracking-tight">
                {confirmState.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed px-2">
                {confirmState.message}
              </p>
            </div>

            {/* Two Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmAction(false)}
                className="py-3 px-4 rounded-2xl bg-white/10 border border-white/15 text-slate-200 hover:text-white hover:bg-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAction(true)}
                autoFocus
                className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmState.type === 'danger'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30 hover:brightness-110'
                    : confirmState.type === 'warning'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-amber-500/30 hover:brightness-110'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-cyan-500/30 hover:brightness-110'
                }`}
              >
                <span>{confirmState.confirmText}</span>
              </button>
            </div>

            {/* Micro Helper Note */}
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              Press <span className="text-slate-300 font-mono bg-white/10 px-1 py-0.5 rounded">ESC</span> to cancel or <span className="text-slate-300 font-mono bg-white/10 px-1 py-0.5 rounded">ENTER</span> to confirm
            </p>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useAppModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    return {
      showAlert: appAlert,
      showConfirm: appConfirm,
    };
  }
  return context;
};
