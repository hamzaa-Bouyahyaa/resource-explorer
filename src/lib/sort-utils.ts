import { Character, SortConfig, SortOption } from "@/types";

interface SortStrategy {
  compare(a: Character, b: Character): number;
}

class NameSortStrategy implements SortStrategy {
  compare(a: Character, b: Character): number {
    const aValue = a.name.toLowerCase();
    const bValue = b.name.toLowerCase();
    return aValue.localeCompare(bValue);
  }
}

/**
 * ID sorting strategy
 */
class IdSortStrategy implements SortStrategy {
  compare(a: Character, b: Character): number {
    return a.id - b.id;
  }
}

/**
 * Created date sorting strategy
 */
class CreatedSortStrategy implements SortStrategy {
  compare(a: Character, b: Character): number {
    const aTime = new Date(a.created).getTime();
    const bTime = new Date(b.created).getTime();
    return aTime - bTime;
  }
}

/**
 * Status sorting strategy with priority ordering
 */
class StatusSortStrategy implements SortStrategy {
  private getStatusPriority(status: Character["status"]): number {
    const priorities = {
      Alive: 1,
      Dead: 2,
      unknown: 3,
    };
    return priorities[status] || 4;
  }

  compare(a: Character, b: Character): number {
    const aPriority = this.getStatusPriority(a.status);
    const bPriority = this.getStatusPriority(b.status);

    // If same status, sort by name as secondary
    if (aPriority === bPriority) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }

    return aPriority - bPriority;
  }
}

/**
 * Species sorting strategy
 */
class SpeciesSortStrategy implements SortStrategy {
  compare(a: Character, b: Character): number {
    const aValue = a.species.toLowerCase();
    const bValue = b.species.toLowerCase();

    // If same species, sort by name as secondary
    if (aValue === bValue) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }

    return aValue.localeCompare(bValue);
  }
}

/**
 * Strategy factory for creating sort strategies
 */
class SortStrategyFactory {
  private static strategies: Record<SortOption, SortStrategy> = {
    name: new NameSortStrategy(),
    id: new IdSortStrategy(),
    created: new CreatedSortStrategy(),
    status: new StatusSortStrategy(),
    species: new SpeciesSortStrategy(),
  };

  static getStrategy(key: SortOption): SortStrategy {
    return this.strategies[key] || this.strategies.name;
  }

  /**
   * Register a new sorting strategy (for extensibility)
   */
  static registerStrategy(key: SortOption, strategy: SortStrategy): void {
    this.strategies[key] = strategy;
  }
}

/**
 * Context class that uses the strategy pattern for sorting
 */
class CharacterSorter {
  private strategy: SortStrategy;

  constructor(strategy: SortStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(
    characters: Character[],
    direction: SortConfig["direction"]
  ): Character[] {
    const sortedCharacters = [...characters].sort((a, b) => {
      const comparison = this.strategy.compare(a, b);
      return direction === "desc" ? -comparison : comparison;
    });

    return sortedCharacters;
  }
}

/**
 * Main sorting function using Strategy Pattern
 * This replaces the previous switch-case implementation
 */
export function sortCharacters(
  characters: Character[],
  sortConfig: SortConfig
): Character[] {
  const { key, direction } = sortConfig;

  // Get the appropriate strategy for the sort key
  const strategy = SortStrategyFactory.getStrategy(key);

  // Create sorter with the strategy and sort
  const sorter = new CharacterSorter(strategy);
  return sorter.sort(characters, direction);
}

/**
 * Export strategy classes for potential extension
 */
export type { SortStrategy };
export {
  SortStrategyFactory,
  CharacterSorter,
  NameSortStrategy,
  IdSortStrategy,
  CreatedSortStrategy,
  StatusSortStrategy,
  SpeciesSortStrategy,
};
