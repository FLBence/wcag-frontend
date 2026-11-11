import { AiSuggestionDto } from './ai-suggestion-dto';
import { ErrorLevel } from './error-level';

export interface ScanResultResponseDto {
  id: number;
  targetSelector: string;
  htmlElement: string;
  errorLevel: ErrorLevel;
  aiSuggestion?: AiSuggestionDto | null;
  ruleId: string;
  errorName: string;
  description: string;
  wcagTags: string;
}
