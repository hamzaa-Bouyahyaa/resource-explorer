# Resource Explorer 🚀

A modern, responsive React application for exploring characters from the Rick and Morty universe. Built with Next.js, TypeScript, and Tailwind CSS, featuring advanced filtering, sorting, favorites management, and real-time search capabilities.

![Resource Explorer](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)

## ✨ Features

- 🔍 **Real-time Search** - Debounced search with instant results
- 🎛️ **Advanced Filtering** - Filter by status, gender, species, and favorites
- 📊 **Smart Sorting** - Multiple sorting options with client-side optimization
- ❤️ **Favorites System** - Persistent favorites with localStorage
- 🔗 **URL State Sync** - All filters and state reflected in shareable URLs
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- ⚡ **Performance Optimized** - React Query caching, memoization, and lazy loading
- 🎨 **Modern UI/UX** - Clean design with smooth animations and transitions

## 🚀 How to Run

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **yarn** 1.22.x)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resource-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Environment Setup

The application uses the public Rick and Morty API, so no environment variables are required for basic functionality.

## 🏗️ Architecture Overview

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── characters/[id]/    # Dynamic character detail pages
│   ├── favorites/          # Favorites management page
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page with character grid
│   └── providers.tsx       # Global context providers
├── components/
│   ├── features/           # Business logic components
│   │   ├── character-card.tsx
│   │   ├── character-grid.tsx
│   │   ├── favorites-filter.tsx
│   │   ├── search-filter-bar.tsx
│   │   └── pagination.tsx
│   ├── layout/             # Layout components
│   │   └── navigation.tsx
│   └── ui/                 # Reusable UI components
│       ├── favorite-button.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       └── empty-state.tsx
├── contexts/               # React Context providers
│   └── favorites-context.tsx
├── hooks/                  # Custom React hooks
│   ├── use-characters.ts   # Data fetching hooks
│   ├── use-favorites.ts    # Favorites management
│   ├── use-url-state.ts    # URL state synchronization
│   └── use-debounce.ts     # Performance optimization
├── lib/                    # Utility libraries
│   ├── api.ts              # API client and utilities
│   ├── favorites-storage.ts # Favorites persistence
│   ├── sort-utils.ts       # Sorting algorithms
│   └── query-client.ts     # React Query configuration
├── types/                  # TypeScript definitions
│   ├── api.ts              # API response types
│   └── index.ts            # Application types
└── constants/              # Application constants
    ├── api.ts              # API endpoints and config
    └── index.ts            # General constants
```

### Design Patterns Implemented

#### 1. **Repository Pattern**

- **Location**: `src/lib/api.ts`, `src/lib/favorites-storage.ts`
- **Purpose**: Abstracts data access logic from business logic
- **Benefits**: Easy testing, swappable data sources, consistent error handling

```typescript
// API Repository
export class CharacterRepository {
  static async getCharacters(filters: CharacterFilters, signal?: AbortSignal) {
    // Implementation details abstracted
  }
}

// Favorites Repository with Strategy Pattern
export class FavoritesRepository {
  constructor(private storage: StorageStrategy) {}
  // Supports localStorage and memory storage strategies
}
```

#### 2. **Strategy Pattern**

- **Location**: `src/lib/sort-utils.ts`, `src/lib/favorites-storage.ts`
- **Purpose**: Encapsulates algorithms and makes them interchangeable
- **Benefits**: Easy to extend, testable, follows Open/Closed Principle

```typescript
// Sorting strategies
interface SortStrategy {
  sort(characters: Character[]): Character[];
}

// Storage strategies
interface StorageStrategy {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
```

#### 3. **Observer Pattern**

- **Location**: `src/contexts/favorites-context.tsx`
- **Purpose**: Manages global state changes and notifications
- **Benefits**: Decoupled components, reactive updates, centralized state

#### 4. **Command Pattern**

- **Location**: `src/hooks/use-url-state.ts`
- **Purpose**: Encapsulates filter update operations
- **Benefits**: Undo/redo capability, logging, consistent state updates

#### 5. **Factory Pattern**

- **Location**: `src/lib/sort-utils.ts`
- **Purpose**: Creates sort strategy instances based on configuration
- **Benefits**: Centralized creation logic, easy to extend

### State Management Architecture

#### 1. **URL-First State Management**

All application state is synchronized with the URL, making the application:

- **Bookmarkable**: Users can save and share specific filter states
- **SEO-Friendly**: Search engines can index different filter combinations
- **Navigation-Aware**: Browser back/forward buttons work correctly

```typescript
// URL structure example
/?q=rick&status=Alive&favorites=true&sortBy=name&sortDir=asc&page=2
```

#### 2. **React Query for Server State**

- **Caching**: Intelligent caching with stale-while-revalidate strategy
- **Background Updates**: Automatic refetching and cache invalidation
- **Error Handling**: Robust error boundaries and retry mechanisms
- **Performance**: Request deduplication and parallel queries

#### 3. **Context API for Client State**

- **Favorites**: Global favorites state with localStorage persistence
- **UI State**: Loading states, error states, and user preferences

### Performance Optimizations

#### 1. **Debouncing Strategy**

```typescript
// Individual debouncing for different input types
const debouncedName = useDebounce(filters.name || "", 300); // Text inputs
const debouncedSpecies = useDebounce(filters.species || "", 300); // Text inputs
// Dropdowns update immediately for better UX
```

#### 2. **Memoization**

- **React.memo**: Prevents unnecessary re-renders of expensive components
- **useMemo**: Caches expensive calculations (sorting, filtering)
- **useCallback**: Stabilizes function references for child components

#### 3. **Code Splitting**

- **Dynamic Imports**: Lazy loading of non-critical components
- **Route-based Splitting**: Automatic code splitting by Next.js App Router

#### 4. **Image Optimization**

- **Next.js Image**: Automatic WebP conversion, lazy loading, responsive images
- **Proper Sizing**: Responsive images with appropriate size hints

## 🔄 Trade-offs & Decisions

### 1. **Client-Side vs Server-Side Filtering**

**Decision**: Hybrid approach

- **Server-side**: Primary filtering (name, status, gender, species) via API
- **Client-side**: Favorites filtering and sorting

**Trade-offs**:

- ✅ **Pros**: Reduced API calls, better performance for favorites, immediate sorting
- ❌ **Cons**: Limited by API pagination, potential memory usage for large datasets
- **Rationale**: Rick & Morty API doesn't support favorites filtering, client-side sorting provides better UX

### 2. **State Management: URL-First Approach**

**Decision**: URL as single source of truth for filters and pagination

**Trade-offs**:

- ✅ **Pros**: Shareable URLs, SEO benefits, browser navigation support, no hydration issues
- ❌ **Cons**: More complex state synchronization, URL length limitations
- **Rationale**: Better user experience and SEO outweigh complexity costs

### 3. **Favorites Storage: localStorage vs Server**

**Decision**: localStorage with memory fallback

**Trade-offs**:

- ✅ **Pros**: No authentication required, instant persistence, offline support
- ❌ **Cons**: Device-specific, storage limitations, no cross-device sync
- **Rationale**: Simpler implementation for demo purposes, easily upgradeable to server storage

### 4. **TypeScript Strictness**

**Decision**: Strict TypeScript configuration with no `any` types

**Trade-offs**:

- ✅ **Pros**: Better developer experience, fewer runtime errors, self-documenting code
- ❌ **Cons**: Longer development time, learning curve for team members
- **Rationale**: Long-term maintainability and code quality benefits

### 5. **Component Architecture: Composition vs Inheritance**

**Decision**: Composition-based component design

**Trade-offs**:

- ✅ **Pros**: Better reusability, easier testing, follows React patterns
- ❌ **Cons**: More boilerplate, potential prop drilling
- **Rationale**: Aligns with React philosophy and modern best practices

### 6. **Error Handling Strategy**

**Decision**: Graceful degradation with user-friendly error messages

**Trade-offs**:

- ✅ **Pros**: Better user experience, easier debugging, resilient application
- ❌ **Cons**: More code complexity, additional testing scenarios
- **Rationale**: Production-ready applications require robust error handling

## 🧪 Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Custom hooks, utility functions, and pure components
2. **Integration Tests**: Component interactions and data flow
3. **E2E Tests**: Critical user journeys (search, filter, favorites)

### Testing Tools Recommendation

- **Jest** + **React Testing Library** for unit/integration tests
- **Playwright** or **Cypress** for E2E tests
- **MSW** (Mock Service Worker) for API mocking

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Search**: Full-text search across all character properties
2. **Infinite Scroll**: Replace pagination with infinite scrolling
3. **Dark Mode**: Theme switching with system preference detection
4. **Offline Support**: PWA capabilities with service worker
5. **Character Comparison**: Side-by-side character comparison tool
6. **Export Features**: PDF/CSV export of filtered results
7. **User Accounts**: Server-side favorites synchronization
8. **Analytics**: User behavior tracking and insights

### Technical Improvements

1. **Micro-frontends**: Split into smaller, deployable units
2. **GraphQL**: Replace REST API with GraphQL for better data fetching
3. **Server Components**: Leverage Next.js 13+ server components
4. **Edge Functions**: Move some logic to edge for better performance

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rick and Morty API](https://rickandmortyapi.com/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using modern React ecosystem**
