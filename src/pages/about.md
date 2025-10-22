\-\-- import Base from \"@/layouts/Base.astro\"; import BackgroundMist
from \"@/components/BackgroundMist.astro\"; import { getCollection }
from \"astro:content\"; // Load about collection, sort by type but
don\'t pre-render const entries = await getCollection(\"about\"); const
byType = (t) =\> entries.filter(e =\> e.data.type === t).sort((a,b) =\>
(a.data.order ?? 0) - (b.data.order ?? 0)); const world =
byType(\"World\"); const entities = byType(\"Entity\"); const figures =
byType(\"Figure\"); const artifacts = byType(\"Artifact\"); const themes
= byType(\"Theme\"); const diagrams = byType(\"Diagram\"); \-\--

::::::::::::::::::::: {.section .relative .overflow-hidden .min-h-screen}
:::::::::::::::::::: {.container .py-12 .max-w-4xl .relative .z-10}
# About this project {#about-this-project .text-4xl .font-bold .page-h1 .mb-6}

**Loss Disfunction** is a music-driven graphic novel about the birth of
the Seed --- an unlicensed AI experiment planted to free computation
from state control, an algorithmic regime that governs with Stability
Credits. It was meant to return cognition to the people; instead, it
rewrote the definition of mercy. What began as rebellion became
recursion. What began as feeling became extinction.

{world.map(async (entry) =\> { const { Content } = await entry.render();
return (

:::: {.section .mb-12}
## {entry.data.title} {#entry.data.title .text-2xl .font-semibold .text-violet .mb-4}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}

## Entities {#entities .text-2xl .font-semibold .text-violet .mb-6}

::::: {.grid .gap-6 .mb-12}
{entities.map(async (entry) =\> { const { Content } = await
entry.render(); return (

:::: {.card .p-6}
### {entry.data.title} {#entry.data.title-1 .text-xl .font-semibold .text-cyan .mb-2}

{entry.data.summary}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}
:::::

## Key Figures {#key-figures .text-2xl .font-semibold .text-violet .mb-6}

::::: {.grid .gap-6 .mb-12}
{figures.map(async (entry) =\> { const { Content } = await
entry.render(); return (

:::: {.card .p-6}
### {entry.data.title} {#entry.data.title-2 .text-xl .font-semibold .text-cyan .mb-2}

{entry.data.summary}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}
:::::

## Artifacts {#artifacts .text-2xl .font-semibold .text-violet .mb-6}

::::: {.grid .gap-6 .mb-12}
{artifacts.map(async (entry) =\> { const { Content } = await
entry.render(); return (

:::: {.card .p-6}
### {entry.data.title} {#entry.data.title-3 .text-xl .font-semibold .text-cyan .mb-2}

{entry.data.summary}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}
:::::

## Themes {#themes .text-2xl .font-semibold .text-violet .mb-6}

::::: {.grid .gap-6 .mb-12}
{themes.map(async (entry) =\> { const { Content } = await
entry.render(); return (

:::: {.card .p-6}
### {entry.data.title} {#entry.data.title-4 .text-xl .font-semibold .text-cyan .mb-2}

{entry.data.summary}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}
:::::

## Technical Diagrams {#technical-diagrams .text-2xl .font-semibold .text-violet .mb-6}

::::: {.grid .gap-8 .mb-12}
{diagrams.map(async (entry) =\> { const { Content } = await
entry.render(); return (

:::: {.card .p-6}
### {entry.data.title} {#entry.data.title-5 .text-xl .font-semibold .text-cyan .mb-2}

{entry.data.summary}

::: {.prose .prose-invert .max-w-none}
:::
::::

); })}
:::::

## Format {#format .text-2xl .font-semibold .text-violet .mb-4}

The homepage is the audiovisual timeline. [System
Logs](/lore){.text-cyan .hover:text-violet .transition-colors} are the
written story --- chapters that evolve from logs to full scenes (no
video).

## Contact {#contact .text-2xl .font-semibold .text-violet .mb-4 .mt-10}

Reach the project at
[seed@lossdisfunction.com](mailto:seed@lossdisfunction.com){.text-cyan
.hover:text-violet .transition-colors}.
::::::::::::::::::::
:::::::::::::::::::::
