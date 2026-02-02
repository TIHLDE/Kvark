# TanStack React Query Mutation Options Convention

Based on [tkDodo's blog: Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)

## Naming Convention

Function names match the Photon SDK method names with a suffix:
- Queries: `photon.{method}` → `{method}Query`
- Mutations: `photon.{method}` → `{method}Mutation`

Examples:
- `photon.listEvents` → `listEventsQuery`
- `photon.getEvent` → `getEventQuery`
- `photon.createEvent` → `createEventMutation`
- `photon.updateEvent` → `updateEventMutation`
- `photon.deleteEvent` → `deleteEventMutation`

## Core Principles

1. **Use `mutationOptions`** - Type-safe mutation definitions with centralized cache handling
2. **Wrap SDK calls** - Accept only the payload (body), not the full request object
3. **Handle invalidation in the mutation** - Keep cache logic centralized, not scattered across components
4. **Use query keys for invalidation** - Leverage existing query key constants

## Implementation Pattern

### Basic Mutation (No Path Parameters)

```typescript
import { mutationOptions } from '@tanstack/react-query';
import type { CreateEventData } from '~/gen-client/types.gen';
import { photon } from '../photon';
import type { Payload } from './helper';

export const eventCreateMutation = mutationOptions({
  mutationFn: (body: Payload<CreateEventData>) => photon.createEvent({ body }),
  onMutate: async (_, ctx) => {
    await ctx.client.cancelQueries({ queryKey: eventKeys.lists });
  },
  onSuccess: (_, __, ___, ctx) => {
    ctx.client.invalidateQueries({
      queryKey: eventKeys.lists,
    });
  },
});
```

### Parameterized Mutation (With Path Parameters)

```typescript
export const eventUpdateMutation = (eventId: string) =>
  mutationOptions({
    mutationFn: (body: Payload<UpdateEventData>) =>
      photon.updateEvent({ path: { id: eventId }, body }),
    onMutate: async (_, ctx) => {
      await ctx.client.cancelQueries({ queryKey: eventKeys.all });
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.all });
    },
  });

export const eventDeleteMutation = (eventId: string) =>
  mutationOptions({
    mutationFn: () => photon.deleteEvent({ path: { eventId } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
```

### Delete Mutation (No Body)

```typescript
export const notificationDeleteMutation = (id: string) =>
  mutationOptions({
    mutationFn: () => photon.deleteNotification({ path: { id } }),
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
```

## Usage in Components

```typescript
import { eventCreateMutation, eventUpdateMutation } from '@/api/queries/events';
import { useMutation } from '@tanstack/react-query';

function EventForm() {
  // Basic mutation
  const createEvent = useMutation(eventCreateMutation);

  // Parameterized mutation
  const updateEvent = useMutation(eventUpdateMutation(eventId));

  const handleCreate = () => {
    createEvent.mutate({
      title: 'New Event',
      description: '...',
    });
  };

  const handleUpdate = () => {
    updateEvent.mutate({
      title: 'Updated Title',
    });
  };
}
```

## Callback Context

The `mutationOptions` helper provides a `ctx` object with access to the query client:

| Parameter | Description |
|-----------|-------------|
| `ctx.client` | QueryClient instance for cache operations |

```typescript
mutationOptions({
  mutationFn: (body) => photon.createEvent({ body }),
  onMutate: async (variables, ctx) => {
    // Cancel in-flight queries before mutation
    await ctx.client.cancelQueries({ queryKey: eventKeys.lists });
  },
  onSuccess: (data, variables, context, ctx) => {
    // Invalidate related queries after success
    ctx.client.invalidateQueries({ queryKey: eventKeys.lists });
  },
  onError: (error, variables, context, ctx) => {
    // Handle errors, potentially rollback optimistic updates
  },
});
```

## Helper Types

Use `Payload<T>` to extract the body type from SDK data types:

```typescript
import type { Payload } from './helper';
import type { CreateEventData } from '~/gen-client/types.gen';

// Payload<CreateEventData> extracts { title: string; description: string; ... }
mutationFn: (body: Payload<CreateEventData>) => photon.createEvent({ body }),
```

## Cache Invalidation Patterns

### Invalidate Lists After Create

```typescript
onSuccess: (_, __, ___, ctx) => {
  ctx.client.invalidateQueries({ queryKey: eventKeys.lists });
},
```

### Invalidate All (Lists + Details) After Update/Delete

```typescript
onSuccess: (_, __, ___, ctx) => {
  ctx.client.invalidateQueries({ queryKey: eventKeys.all });
},
```

### Invalidate Related Resources

```typescript
onSuccess: (_, __, ___, ctx) => {
  ctx.client.invalidateQueries({ queryKey: eventKeys.all });
  ctx.client.invalidateQueries({ queryKey: notificationKeys.lists });
},
```

## Anti-Patterns to Avoid

❌ **Passing full request object**

```typescript
mutationFn: photon.createEvent, // Requires { body: { ... } }
```

✅ **Wrap to accept payload directly**

```typescript
mutationFn: (body: Payload<CreateEventData>) => photon.createEvent({ body }),
```

---

❌ **Hardcoded mutations in components**

```typescript
useMutation({
  mutationFn: (data) => photon.createEvent({ body: data }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
});
```

✅ **Centralized mutation options**

```typescript
useMutation(eventCreateMutation);
```

---

❌ **Forgetting to cancel in-flight queries**

```typescript
onSuccess: (_, __, ___, ctx) => {
  ctx.client.invalidateQueries({ queryKey: eventKeys.lists });
},
```

✅ **Cancel before mutating to prevent race conditions**

```typescript
onMutate: async (_, ctx) => {
  await ctx.client.cancelQueries({ queryKey: eventKeys.lists });
},
onSuccess: (_, __, ___, ctx) => {
  ctx.client.invalidateQueries({ queryKey: eventKeys.lists });
},
```
