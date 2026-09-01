import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AudioButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  label,
  size = 'md',
  className,
}) => {
  const { speak, isSpeaking, stopSpeaking, t } = useI18n();
  const displayLabel = label ?? t('common.listen');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1 min-h-[36px]',
    md: 'text-sm px-3.5 py-2 gap-2 min-h-[42px]',
    lg: 'text-base px-4 py-2.5 gap-2.5 min-h-[48px]',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Listen to details: ${text}`}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 active:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all touch-manipulation shadow-xs',
          isSpeaking && 'ring-2 ring-amber-500 bg-amber-100 animate-pulse',
          sizeStyles[size],
          className,
        ),
      )}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4 text-amber-700 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4 text-amber-700" />
      )}
      <span>{displayLabel}</span>
    </button>
  );
};
