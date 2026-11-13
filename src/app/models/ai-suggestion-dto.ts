/*
 * Az AI alapú akadálymentességi javítási javaslat adatainak struktúráját meghatározó interfész.
 */
export interface AiSuggestionDto {
  summary: string;
  stepsToFix: string[];
  codeExample: string;
}
