export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
}

export type ModalType = "profile" | "menu" | "about" | "score-breakdown";

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}
