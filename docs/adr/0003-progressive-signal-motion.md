# Use progressive signal motion for the theme

Accepted: the theme uses a custom CSS token layer and small JavaScript enhancements for terminal lines, reveal states, and counters. DaisyUI is not a runtime dependency in the first slice; the component vocabulary stays framework-light so Hugo templates remain portable and the Railway-inspired visual language stays distinctive.

## Consequences

The design can be tuned with a small set of tokens and works without a JavaScript framework. Any future DaisyUI adoption should consume the existing tokens rather than replace the theme's layout primitives.
