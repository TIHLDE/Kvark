# TanStack React Query Key Convention

Based on [tkDodo's blog: Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)

## Core Principles

1. **Always use arrays** - Even for single elements: `['auth']` not `'auth'`
2. **Structure from generic to specific** - `['resource', 'operation', ...params]`
3. **Use queryOptions or objects with queryKeys for type safety** - Keeps TypeScript types and enables auto-imports

## Key Structure Pattern

List for specific identifier

```ts
["resource", "lists", ...dynamicParams];
```

List item detail with specifier

```ts
["resource", "detail", listEntryId, ...otherPotentialParams];
```

For data which is not listable, but still uses parameters

```ts
["something-else", ...dynamicParams];
```

## Implementation Pattern

### Basic Query (No Parameters)

```typescript
export const authQueries = {
  session: queryOptions({
    queryKey: ["auth", "session"],
    queryFn: internalMethods.getSession,
  }),

  user: queryOptions({
    queryKey: ["auth", "user"],
    queryFn: internalMethods.getUser,
  }),
};
```

### Parameterized Query

```typescript
// Private key constants for hierarchical invalidation
const eventKeys = {
  all: ["events"] as const,
  lists: ["events", "list"] as const,
  details: ["events", "detail"] as const,
};

export const eventListQuery = (filters: FilterType) => queryOptions({
  queryKey: [...eventKeys.list, filters]
  queryFn: () => eventApi.listEvents(filters)
});

export const eventDetailQuery = (eventId: string) => queryOptions({
  queryKey: [...eventKeys.details, eventId],
  queryKey: () => eventApi.getEvent(eventId)
})

```

## Usage in Components

```typescript
// Auto-import and type safety
import { eventListQuery } from "@/queries/events";
import { useQuery } from "@tanstack/react-query";

function SomePage() {
  const { data } = useSuspenseQuery(eventListQuery({ /* filters here */ }))
  // Or
  const { data } = useQuery(eventListQuery({ /* filters here */ }));



  const { data } = useSuspenseQuery(eventDetailQuery(eventId));
  // Or
  const { data } = useQuery(eventDetailQuery(eventId))
}
```

## Invalidation Patterns

```typescript
// Invalidates all lists regardless of filters
queryClient.invalidateQueries({
  queryKey: eventKeys.list,
});
// Invalidates specific list with given filters
queryClient.invalidateQueries(eventListQuery({ /* filters */ }));

// Invalidates all event details regardless of eventId
queryClient.invalidateQueries({
  queryKey: eventKeys.details,
});
queryClient.invalidateQueries(eventDetailQuery(eventId));
```

## Anti-Patterns to Avoid
❌ **String keys: NEVER-EVER do this**

```typescript
queryKey: "users"; // Don't do this
```

✅ **Array keys**

```typescript
queryKey: ["users"];
```

---

❌ **Inconsistent structure**

```typescript
queryKey: ["user-events", userId]; // mixing concepts
queryKey: ["eventDetails", walletId]; // inconsistent naming
```

✅ **Consistent hierarchy**

```typescript
queryKey: ["events", "list", userId];
queryKey: ["events", "detail", walletId];
```

---

❌ **Hardcoded keys everywhere**

```typescript
useQuery({
  queryKey: ["user", userId],
  // duplicated across components
});
```

✅ **Centralized queryOptions**

```typescript
useQuery(userByIdQuery(userId));
// defined once, used everywhere
```
