// ============================================================================
// API TYPE DEFINITIONS - SCOUTER ESPORTS ANALYZER
// Maps to Go backend REST API endpoints
// ============================================================================

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum Game {
  VALORANT = 'valorant',
  LOL = 'lol',
}

export enum ConfidenceLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum InsightPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TimeWindow {
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  LAST_YEAR = 'LAST_YEAR',
}

// ============================================================================
// TEAMS LIST - /api/v1/teams
// ============================================================================

export interface TeamsListResponse {
  title: string;
  teams: string[];
  count: number;
  cached?: boolean;
  note?: string;
}

// ============================================================================
// SEARCH ENDPOINT - /api/v1/teams/search
// ============================================================================

export interface SearchRequest {
  query: string;
  game: Game | string;
  limit?: number;
}

export interface SearchResult {
  name: string;
  displayName: string;
  title: string;
  relevance: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  count: number;
}

// ============================================================================
// TEAM COMPARISON - /api/v1/compare
// ============================================================================

export interface CompareRequest {
  team1: string;
  team2: string;
  game: Game | string;
  timeWindow?: TimeWindow | string;
}

export interface Confidence {
  level: ConfidenceLevel;
  sampleSize: number;
  reasoning: string;
  reliabilityScore: number;
}

export interface Streak {
  type: 'win' | 'loss';
  count: number;
}

export interface StatVal {
  avg: number;
  total: number;
}

export interface ComparisonStats {
  winRate: number;
  kdRatio: number;
  kills: StatVal;
  deaths: StatVal;
  currentStreak: Streak;
  confidence: Confidence;
}

export interface ComparisonTeamData {
  name: string;
  stats: ComparisonStats;
}

export interface Advantages {
  team1: string[];
  team2: string[];
}

export interface DataQuality {
  team1Matches: number;
  team2Matches: number;
  timeRange: string;
}

export interface CompareResponse {
  team1: ComparisonTeamData;
  team2: ComparisonTeamData;
  advantages: Advantages;
  dataQuality: DataQuality;
  warnings?: string[];
  recentTrends?: {
    team1HasAlerts: boolean;
    team2HasAlerts: boolean;
    team1Alerts?: TrendAlert[];
    team2Alerts?: TrendAlert[];
  };
}

// ============================================================================
// TRENDS DASHBOARD - /api/v1/trends
// ============================================================================

export interface TrendsRequest {
  teamName: string;
  game: Game | string;
}

export interface PeriodStats {
  timeWindow: string;
  winRate: number;
  kdRatio: number;
  matches: number;
}

export interface TrendAlert {
  type: 'POSITIVE_SHIFT' | 'NEGATIVE_SHIFT' | 'PLAYSTYLE_CHANGE' | 'CONSISTENCY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  context: string;
}

export interface TrendsResponse {
  team: string;
  title: string;
  overall: PeriodStats;
  recent: PeriodStats;
  alerts: TrendAlert[];
  confidence: Confidence;
}

// ============================================================================
// SCOUTING REPORT - /api/v1/scouting-report
// ============================================================================

export interface ScoutingReportRequest {
  opponent: string;
  myTeam: string;
  game: Game | string;
  timeWindow?: TimeWindow | string;
}

export interface KeyInsight {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  icon: string;
  message: string;
}

export interface CacheStatus {
  fromCache: boolean;
  age: string;
}

export interface MatchupInfo {
  opponent: string;
  yourTeam: string;
  title: string;
}

export interface TrendsInfo {
  opponent: TrendsResponse;
  yourTeam: TrendsResponse;
}

export interface MetaContext {
  opponentVsMeta: string[];
  yourTeamVsMeta: string[];
  recommendations: string[];
}

export interface ScoutingReportResponse {
  reportId: string;
  generatedAt: string;
  matchup: MatchupInfo;
  comparison: CompareResponse;
  trends: TrendsInfo;
  metaContext?: MetaContext;
  keyInsights: KeyInsight[];
  confidence: Confidence;
  cacheStatus: CacheStatus;
}

// ============================================================================
// META ANALYSIS - /api/v1/meta
// ============================================================================

export interface MetaAnalysisRequest {
  game: Game | string;
  region?: string;
}

export interface MetaAnalysisResponse {
  error: string;
  message: string;
  note: string;
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export interface APIError {
  error: string;
  message?: string;
  details?: string;
  code?: number;
  retry_after?: string;
  team?: string;
  title?: string;
  availableTeams?: string[];
  reason?: string;
}

// ============================================================================
// API CLIENT CONFIG
// ============================================================================

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  cacheTime: number;
}