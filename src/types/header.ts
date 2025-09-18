export interface HeaderTab {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface HeaderConfig {
  title?: string;
  tabs: HeaderTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  showMobileMenu?: boolean;
}
