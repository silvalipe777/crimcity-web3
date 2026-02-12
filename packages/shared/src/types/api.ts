export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthNonceResponse {
  nonce: string;
  message: string;
}

export interface AuthVerifyRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthVerifyResponse {
  token: string;
  player: import('./player').Player;
  isNewPlayer: boolean;
}

export interface RobberyAttemptResponse {
  success: boolean;
  moneyEarned: number;
  respectEarned: number;
  tokensEarned: number;
  wasCaught: boolean;
  message: string;
  updatedStats: {
    stamina: number;
    money: number;
    respect: number;
    experience: number;
    isInPrison: boolean;
  };
}
