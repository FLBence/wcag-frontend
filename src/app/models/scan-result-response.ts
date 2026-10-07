import { ErrorLevel } from "./error-level";

export interface ScanResultResponse {
    id: number;
    targetSelector: string;
    htmlElement: string;
    errorLevel: ErrorLevel;
    aiSuggestion?: string;
    ruleId: string;
    errorName: string;
    description: string;
    wcagTags: string;
}