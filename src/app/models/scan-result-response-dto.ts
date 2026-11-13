import { AiSuggestionDto } from './ai-suggestion-dto';
import { ErrorLevel } from './error-level';

/*
 * A WCAG-vizsgálat során feltárt hibák adatainak struktúráját meghatározó interfész.
 *
 * Tartalmazza a hiba azonosításához, megjelenítéséhez
 * és az esetleges AI alapú javítási javaslatok kezeléséhez szükséges adatokat.
 */
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
