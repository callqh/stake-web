import { darkTheme } from '@rainbow-me/rainbowkit';

export const myCustomTheme = darkTheme({
  accentColor: '#06b6d4', // cyan-500
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// 自定义主题样式
myCustomTheme.colors.modalBackground = '#0f172a'; // slate-900
myCustomTheme.colors.modalBorder = '#334155'; // slate-700
myCustomTheme.colors.modalText = '#e2e8f0'; // slate-200
myCustomTheme.colors.modalTextDim = '#94a3b8'; // slate-400
myCustomTheme.colors.modalTextSecondary = '#cbd5e1'; // slate-300
myCustomTheme.colors.profileAction = '#1e293b'; // slate-800
myCustomTheme.colors.profileActionHover = '#334155'; // slate-700
myCustomTheme.colors.profileForeground = '#0f172a'; // slate-900
myCustomTheme.colors.selectedOptionBorder = '#06b6d4'; // cyan-500
myCustomTheme.colors.standby = '#475569'; // slate-600
myCustomTheme.colors.connectButtonBackground = '#1e293b'; // slate-800
myCustomTheme.colors.connectButtonBackgroundError = '#dc2626'; // red-600
myCustomTheme.colors.connectButtonInnerBackground =
  'linear-gradient(0deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)';
myCustomTheme.colors.connectButtonText = '#e2e8f0'; // slate-200
myCustomTheme.colors.connectButtonTextError = '#fecaca'; // red-200
myCustomTheme.colors.connectionIndicator = '#10b981'; // emerald-500
myCustomTheme.colors.downloadBottomCardBackground =
  'linear-gradient(126deg, rgba(6, 182, 212, 0.1) 9.49%, rgba(59, 130, 246, 0.1) 71.04%)';
myCustomTheme.colors.downloadTopCardBackground =
  'linear-gradient(126deg, rgba(6, 182, 212, 0.2) 9.49%, rgba(59, 130, 246, 0.2) 71.04%)';
myCustomTheme.colors.error = '#ef4444'; // red-500
myCustomTheme.colors.generalBorder = '#334155'; // slate-700
myCustomTheme.colors.generalBorderDim = '#475569'; // slate-600
myCustomTheme.colors.menuItemBackground = '#1e293b'; // slate-800
myCustomTheme.colors.closeButton = '#64748b'; // slate-500
myCustomTheme.colors.closeButtonBackground = '#334155'; // slate-700

// 添加更多科技感的颜色配置
myCustomTheme.shadows = {
  connectButton: '0 4px 12px rgba(6, 182, 212, 0.15)',
  dialog:
    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.1)',
  profileDetailsAction: '0 2px 6px rgba(6, 182, 212, 0.1)',
  selectedOption: '0 2px 6px rgba(6, 182, 212, 0.2)',
  selectedWallet: '0 2px 6px rgba(6, 182, 212, 0.2)',
  walletLogo: '0 2px 16px rgba(6, 182, 212, 0.16)',
};
