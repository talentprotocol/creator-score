# c 

## 🎯 MISSION
Build a **fast, minimal, and scalable Next.js app** that supports dual authentication and integrates with Talent Protocol API. The app should automatically detect context (Farcaster miniapp vs browser) and authenticate users seamlessly without user friction.

## 🔐 AUTHENTICATION REQUIREMENTS
1. **Browser context**: Authenticate with Privy (wallet-based)
   - Auth state persists across sessions
   - Include logout flow
2. **Farcaster miniapp context**: Auto-detect and use built-in user info (FID, wallet)
   - No state persistence needed - context always injected
   - Use Farcaster Frame SDK for seamless auth

## 🧩 CORE USE CASE
Once authenticated (either method):
1. Verify user's **wallet address or FID**
2. Make request to **Talent Protocol API**: `https://api.talentprotocol.com/profile`
3. Display profile information

## 📋 TECHNICAL REQUIREMENTS

### Architecture (STRICT)
Follow this layered architecture pattern:
```
External APIs → API Clients → Services → API Routes → Hooks → Pure UI Components
```

**CRITICAL RULES:**
- Client-side code NEVER directly imports server-side services
- All data fetching flows through API routes
- Use Tanstack Query, Tailwind CSS, and shadcn/ui
- TypeScript strict mode throughout
- Enforce clean separation between client and server code

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 18+
- **UI**: shadcn/ui + Tailwind CSS (mobile-first design)
- **Auth**: Privy SDK + Farcaster Frame SDK with auto-detection
- **State**: React hooks + Tanstack Query (no external state library)

### User Resolution System
- **Canonical ID**: Talent UUID as primary identifier
- **Multi-identifier Support**: Accept Farcaster fname, GitHub usernames, wallet addresses, or UUIDs
- **Universal Resolver**: Single abstraction handles all identifier types with regex detection
- **URL Strategy**: Dynamic routing with human-readable URLs (Farcaster > UUID priority)

## 📚 IMPORTANT: CODE REUSE STRATEGY
**I have built a similar app before with reusable code patterns.** Before implementing any new functionality, especially for API integration, **ALWAYS ASK for existing code references** from the previous implementation.

**Critical Request Protocol:**
- Before writing Phase 4 (Talent Protocol) - Ask: "Can you share existing Talent Protocol API client, services, and hooks implementations?"
- For any complex functionality - Ask: "Do you have existing code for [specific feature] I can reference?"

## 🚀 EXECUTION PHASES

### Phase 1: Foundation Setup
- Initialize Next.js 15 with TypeScript, Tailwind, and ESLint
- Setup shadcn/ui from the start
- Install core dependencies: Privy, Farcaster, Tanstack Query

### Phase 2: Architecture Scaffolding
- Create layered folder structure following file-structure-framework.md
- Setup API clients layer for external API abstractions
- Create services layer for business logic (server-side only)
- Setup hooks layer for data fetching with Tanstack Query
- Initialize shadcn/ui components structure

### Phase 3: Core Authentication Flow
- Build context detection for Farcaster vs browser environments
- Implement Privy provider with Farcaster login method configuration
- Create development mode bypass for rapid UI iteration
- Build universal user resolver that accepts any identifier type
- Ensure seamless authentication without user choice

### Phase 4: Talent Protocol Integration
🚨 STOP: REQUEST EXISTING CODE FIRST
Ask for existing Talent Protocol integration before implementing:
- API client patterns and error handling
- Services layer for user resolution and profile transformation
- API routes structure and patterns
- Hooks implementation with caching strategies
- Profile display components and loading states

### Phase 5: Production Polish
- Optimize bundle size and implement performance best practices
- Create Farcaster manifest configuration
- Add error boundaries and graceful fallbacks
- Prepare for production deployment
- Test both authentication contexts

## 🎨 UI/UX REQUIREMENTS

### Design Principles
- **Mobile-first approach**: Fixed top header + bottom navigation pattern
- **Modal Strategy**: Draggable bottom sheets on mobile, side dialogs on desktop
- **Color System**: Minimal neutral palette with single strategic accent color
- **Typography**: Clear documented scale for consistency
- **Progress Visualization**: Minimal thin progress bars throughout

### Component Patterns
- **Profile Views**: Modal overlays instead of navigation (maintain context)
- **Loading States**: Skeleton loaders with graceful error handling
- **User Positioning**: Current user always pinned to top of lists
- **Content Management**: Show more/less toggles for long content
- **Search Enhancement**: Blue callout for advanced search linking

## 🔧 KEY IMPLEMENTATION STRATEGIES

### Authentication Context Detection
Automatically detect whether running in Farcaster miniapp iframe or standard browser environment. Configure appropriate authentication method without user intervention.

### Universal User Resolution
Build single abstraction that accepts any identifier type (wallet address, Farcaster ID, fname, UUID) and resolves to canonical Talent Protocol data using regex pattern detection.

### Strict Architecture Enforcement
Ensure all client-side data fetching flows through API routes. Server-side services and external API calls only exist in API routes and services layer.

### Caching Strategy
Implement appropriate cache durations: profile data (5 minutes), expensive computations (60 minutes), with proper invalidation patterns.

## 🚨 SUCCESS CRITERIA
- ✅ **Performance**: Under 3 seconds initial load time
- ✅ **User Experience**: Seamless auth detection without user friction
- ✅ **Flexibility**: Universal user resolution accepting any identifier type
- ✅ **Architecture**: Strict separation with no direct service imports on client
- ✅ **Extensibility**: Easy to add features while maintaining patterns
- ✅ **Mobile Optimization**: Responsive design prioritizing mobile experience
- ✅ **Developer Experience**: Development mode enabling rapid UI iteration

## 🚀 EXECUTION GUIDANCE
Start with Phase 1 and progress systematically through each phase. Prioritize **fast building** while maintaining **strict architectural separation**. Use established patterns from shadcn/ui and follow Next.js best practices. Build foundation that's minimal but extensible, optimized for rapid iteration and maintainability.

Focus on creating a system that "vibe coders" can extend quickly while ensuring production-quality architecture and performance.


