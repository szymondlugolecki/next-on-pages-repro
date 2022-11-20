export interface FooterProps {
  links: { url: string; label: string }[];
}

export interface NicknameChangeForm {
  nickname: string;
  available: boolean;
  availableList: string[];
  unavailableList: string[];
  loading: boolean;
}
