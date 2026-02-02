// ============================================================================
// API SERVICE - SCOUTER ESPORTS ANALYZER
// TanStack Query integration with 1-hour caching and error handling

import type {
    SearchRequest,
    SearchResponse,
    CompareRequest,
    CompareResponse,
    TrendsRequest,
    TrendsResponse,
    ScoutingReportRequest,
    ScoutingReportResponse,
    MetaAnalysisRequest,
    MetaAnalysisResponse,
    APIError,
    APIConfig,
    TeamsListResponse,
} from '../types/api';

// CONFIGURATION

const API_CONFIG: APIConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://valorant-league-of-legends-scouting.onrender.com' || "https://curious-pithivier-f0a2d5.netlify.app/",
    timeout: 30000, // 30 seconds
    retries: 3,
    cacheTime: 3600000, // 1 hour in milliseconds
};

// ERROR HANDLING

export class APIClientError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: string,
        public retryAfter?: string
    ) {
        super(message);
        this.name = 'APIClientError';
    }
}

function handleAPIError(error: any): never {
    // Network errors
    if (!error.response) {
        throw new APIClientError(
            'Network error. Please check your connection.',
            0,
            error.message
        );
    }

    const { status, data } = error.response;
    const apiError = data as APIError;

    // Handle specific status codes
    switch (status) {
        case 404:
            throw new APIClientError(
                apiError.error || 'Team not found',
                404,
                apiError.message || apiError.error
            );
        case 429:
            throw new APIClientError(
                'Rate limit exceeded. Please try again later.',
                429,
                apiError.message,
                apiError.retry_after || '60s'
            );
        case 500:
            throw new APIClientError(
                'Internal server error. Please try again.',
                500,
                apiError.message
            );
        case 504:
            throw new APIClientError(
                'API timeout. The server is taking too long to respond.',
                504,
                'This usually happens during cache misses. Please try again.'
            );
        default:
            throw new APIClientError(
                apiError.error || 'An unexpected error occurred',
                status,
                apiError.message
            );
    }
}

// HTTP CLIENT

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: response.statusText,
            }));
            handleAPIError({
                response: {
                    status: response.status,
                    data: errorData,
                },
            });
        }

        return await response.json();
    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new APIClientError(
                'Request timeout',
                504,
                'The request took too long to complete'
            );
        }

        if (error instanceof APIClientError) {
            throw error;
        }

        throw new APIClientError(
            'Network error',
            0,
            error.message
        );
    }
}

// API ENDPOINTS

export const api = {
    // Get list of teams for a game
    getTeams: async (game: string): Promise<TeamsListResponse> => {
        return apiRequest<TeamsListResponse>(`/api/v1/teams?title=${game}`);
    },

    // Search for teams/players (autocomplete)
    search: async (params: SearchRequest): Promise<SearchResponse> => {
        const queryString = new URLSearchParams({
            query: params.query,
            game: params.game,
        }).toString();

        return apiRequest<SearchResponse>(`/api/v1/teams/search?${queryString}`);
    },

    // Compare two teams
    compare: async (params: CompareRequest): Promise<CompareResponse> => {
        const queryString = new URLSearchParams({
            team1: params.team1,
            team2: params.team2,
            title: params.game,
            ...(params.timeWindow && { timeWindow: params.timeWindow }),
        }).toString();

        return apiRequest<CompareResponse>(`/api/v1/compare?${queryString}`);
    },

    // Get team trends
    trends: async (params: TrendsRequest): Promise<TrendsResponse> => {
        const queryString = new URLSearchParams({
            name: params.teamName,
            title: params.game,
        }).toString();

        return apiRequest<TrendsResponse>(`/api/v1/trends?${queryString}`);
    },

    // Get scouting report
    scoutingReport: async (
        params: ScoutingReportRequest
    ): Promise<ScoutingReportResponse> => {
        const queryString = new URLSearchParams({
            opponent: params.opponent,
            myTeam: params.myTeam,
            title: params.game,
            ...(params.timeWindow && { timeWindow: params.timeWindow }),
        }).toString();

        return apiRequest<ScoutingReportResponse>(
            `/api/v1/scouting-report?${queryString}`
        );
    },

    // Meta analysis
    metaAnalysis: async (
        params: MetaAnalysisRequest
    ): Promise<MetaAnalysisResponse> => {
        const queryString = new URLSearchParams({
            title: params.game,
        }).toString();

        return apiRequest<MetaAnalysisResponse>(`/api/v1/meta?${queryString}`);
    },
};

// TANSTACK QUERY KEYS

export const queryKeys = {
    teams: (game: string) => ['teams', game] as const,
    search: (params: SearchRequest) => ['search', params] as const,
    compare: (params: CompareRequest) => ['compare', params] as const,
    trends: (params: TrendsRequest) => ['trends', params] as const,
    scoutingReport: (params: ScoutingReportRequest) =>
        ['scoutingReport', params] as const,
    metaAnalysis: (params: MetaAnalysisRequest) =>
        ['metaAnalysis', params] as const,
};

// EXPORTS

export { API_CONFIG };
export type { APIConfig };