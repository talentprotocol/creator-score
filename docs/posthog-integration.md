# PostHog Product Analytics Integration

## Overview
PostHog is integrated for comprehensive product analytics, user identification, and custom event tracking across all authentication contexts (Privy, Farcaster, Dev mode).

## Setup
- **Region**: EU (configured via PostHog wizard)
- **Provider**: `PostHogProvider` wraps the entire app in `app/providers.tsx`
- **Environment**: API key and settings in `.env.local`
- **Reverse Proxy**: Configured in `next.config.ts` for client-side tracking

## Architecture

### Core Service
- **`app/services/PostHogService.ts`**: Centralized PostHog service handling user identification and auth events
- **React Integration**: Uses `usePostHog()` hook (never direct imports)
- **Error Handling**: Graceful fallbacks with optional chaining

### User Identification
- **Automatic**: Users identified when they authenticate via any provider
- **Properties**: Auth provider, context, wallet address, Farcaster data
- **Lifecycle**: Identity reset on logout with proper event tracking

## Event Schema

### Authentication Events
```typescript
// User successfully authenticates
"user_authenticated": {
  authProvider: "privy" | "farcaster",
  context: "browser" | "farcaster_miniapp", 
  hasWallet: boolean,
  hasFarcaster: boolean
}

// User initiates logout
"user_logout_initiated": {
  context: AuthContext,
  authProvider: string
}

// Logout completed and identity reset
"user_logged_out": {
  context: AuthContext
}
```

### User Properties
```typescript
{
  authProvider: "privy" | "farcaster",
  context: "browser" | "farcaster_miniapp",
  walletAddress?: string,  // If connected
  fid?: number,           // If Farcaster user
  fname?: string          // If Farcaster user
}
```

## Implementation Guidelines

### ✅ Correct Usage
```typescript
import { usePostHog } from 'posthog-js/react';

function MyComponent() {
  const posthog = usePostHog();
  
  const handleClick = () => {
    posthog?.capture('button_clicked', {
      buttonType: 'primary',
      location: 'header'
    });
  };
}
```

### ❌ Incorrect Usage
```typescript
// NEVER do this - causes React initialization errors
import posthog from 'posthog-js';

function MyComponent() {
  posthog.capture('event'); // Will fail
}
```

### Custom Events Best Practices
- Use descriptive event names: `creator_category_selected` not `click`
- Include relevant context: user state, component, previous values
- Add error tracking: `save_failed` events with error details
- Track user flows: view → interact → submit → success/fail

## Files Structure
```
app/
  providers.tsx           # PostHogProvider setup
  services/
    PostHogService.ts     # Centralized service
hooks/auth/
  useAuth.ts              # Auto user identification 
lib/auth/providers/
  usePrivyBridge.ts       # Privy integration
next.config.ts            # Reverse proxy config
.env.local               # API keys and settings
```

## Testing
1. **Development**: Debug mode enabled, logs in console
2. **Events**: Check browser console for PostHog capture logs
3. **Dashboard**: Verify events appear in PostHog EU instance
4. **User ID**: Confirm user identification with properties

## Key Decisions
- **EU Region**: For compliance and performance
- **Automatic ID**: Seamless user tracking without manual calls  
- **Centralized Service**: Single source of truth for PostHog interactions
- **React Hooks**: Proper React integration avoiding initialization errors
- **Error Resilience**: App works even if PostHog fails to load

## Adding New Events
1. Use `usePostHog()` hook in components
2. Add optional chaining: `posthog?.capture()`
3. Include meaningful properties for analysis
4. Document event schema in this file
5. Test in dev mode and verify in dashboard 