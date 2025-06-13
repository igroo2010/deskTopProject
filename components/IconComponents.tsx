
import React from 'react';

interface IconProps {
  className?: string;
}

export const CameraIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L24 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L17.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L24 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75L12 6.75l-.75-3a4.505 4.505 0 0 0-3.022-3.022L5.25 3l3-.75a4.505 4.505 0 0 0 3.022-3.022L12 .25l.75 3a4.505 4.505 0 0 0 3.022 3.022L18.75 6l-3 .75a4.505 4.505 0 0 0-3.022 3.022L12 12.75l-.75-3a4.505 4.505 0 0 0-3.022-3.022L5.25 9l3-.75a4.505 4.505 0 0 0 3.022-3.022L12 2.25l.75 3.75Z" />
  </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-3.181-4.991v4.99" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A18.733 18.733 0 0 1 12 22.5c-2.786 0-5.433-.608-7.499-1.632Z" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-.962a8.25 8.25 0 0 1 .972.972c.04.552.52.922 1.072.832.552-.09 1.156-.390 1.768-.76a8.312 8.312 0 0 1 3.824 3.824c-.37.612-.67 1.216-.76 1.768-.09.552.28 1.032.832 1.072.416.035.828.017 1.22-.04a8.25 8.25 0 0 1-.962 1.11c-.444.608-1.074 1.01-1.748 1.192a8.375 8.375 0 0 1-5.466 0c-.674-.182-1.304-.584-1.748-1.192a8.25 8.25 0 0 1-.962-1.11c.058-.392.076-.804.04-1.22-.09-.552-.47-.922-1.022-.832-.552.09-1.156.39-1.768.76A8.312 8.312 0 0 1 3.94 9.594c.37-.612.67-1.216.76-1.768.09-.552-.28-1.032-.832-1.072a8.25 8.25 0 0 1 .962-1.11c.444-.608 1.074-1.01 1.748-1.192A8.375 8.375 0 0 1 12 3c.498 0 .988.032 1.47.094.482.062.948.17 1.396.318.04.552.52.922 1.072.832.552-.09 1.156-.390 1.768-.76a8.312 8.312 0 0 1 3.824 3.824c-.37.612-.67 1.216-.76 1.768-.09.552.28 1.032.832 1.072.035.416.017.828-.04 1.22a8.25 8.25 0 0 1-1.11.962c-.608.444-1.01 1.074-1.192 1.748a8.375 8.375 0 0 1-0 5.466c.182.674.584 1.304 1.192 1.748a8.25 8.25 0 0 1 1.11.962c.392-.058.804-.076 1.22-.04.552.09.922.47.832 1.022-.09.552-.39 1.156-.76 1.768a8.312 8.312 0 0 1-3.824 3.824c-.612-.37-1.216-.67-1.768-.76-.552-.09-1.032.28-1.072.832a8.25 8.25 0 0 1-1.11.962c-.608.444-1.01 1.074-1.192 1.748a8.375 8.375 0 0 1-5.466 0c-.182-.674-.584-1.304-1.192-1.748a8.25 8.25 0 0 1-1.11-.962c-.058.392-.076.804-.04 1.22.09.552.47.922.832 1.022.552.09 1.156.39 1.768.76A8.312 8.312 0 0 1 20.06 9.594c-.37.612-.67 1.216-.76 1.768-.09.552.28 1.032.832 1.072.416.035.828.017 1.22-.04a8.25 8.25 0 0 1-.962 1.11c-.444.608-1.074 1.01-1.748 1.192a8.375 8.375 0 0 1-5.466 0c-.674-.182-1.304-.584-1.748-1.192a8.25 8.25 0 0 1-.962-1.11c.058-.392.076-.804.04-1.22-.09-.552-.47-.922-1.022-.832-.552.09-1.156.39-1.768.76A8.312 8.312 0 0 1 3.94 14.406c.37-.612.67-1.216.76-1.768.09-.552-.28-1.032-.832-1.072a8.25 8.25 0 0 1 .962-1.11c.444-.608 1.074-1.01 1.748-1.192A8.375 8.375 0 0 1 12 21c.498 0 .988-.032 1.47-.094.482-.062.948.17 1.396-.318M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
 </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 6.471 3H4.5A2.25 2.25 0 0 0 2.25 5.25v13.5A2.25 2.25 0 0 0 4.5 21h6.75a2.25 2.25 0 0 0 2.25-2.25V6.108c0-.111-.014-.221-.04-.332Z" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096m-3.22-.096A48.37 48.37 0 0 1 6.5 6.5m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);