import { RaceTable, Result } from "../../types/F1Data";

export function getResultFromObjectBasedOnEventType(
  raceData: RaceTable,
  eventValue: string
): Result[] {
  let results: Result[] = [];
  switch (eventValue) {
    case "qualifying": {
      results = raceData?.Races[0]?.QualifyingResults ?? [];
      break;
    }
    case "sprint": {
      results = raceData?.Races[0]?.SprintResults ?? [];
      break;
    }
    default: {
      results = raceData?.Races[0]?.Results ?? [];
      break;
    }
  }

  return results;
}
