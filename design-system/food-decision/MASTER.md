# Food Decision design system

## Direction

A readable food journal inside a European fantasy kingdom. Warm parchment, forest
ink, restrained burgundy and aged brass. The interface remains an ordinary useful
React app: visible navigation, real food data and native controls. No character
art, invented food photography, decorative chips, neon, glass or heavy effects.

## Sources and selection

Official [UI UX Pro Max README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill#installation)
and [skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md)
were read before implementation. Installed globally with
`npx --yes ui-ux-pro-max-cli init --ai codex --global`; not a website dependency.
Python 3 was already available. Search script is under the installed
`~/.agents/skills/ui-ux-pro-max/scripts/` directory.

Searches used:

```text
search.py "food entertainment medieval fantasy" --design-system -p "Food Decision"
search.py "vintage editorial" --domain style -n 2
search.py "heritage editorial serif" --domain typography -n 3
search.py "restaurant warm" --domain color -n 2
search.py "responsive form focus" --stack react -n 3
search.py "keyboard focus dialog" --domain ux -n 2
```

The first generated system suggested generic Swiss style, orange/blue and a
marketing hero. That was not a verified match for this existing app, so it was
not persisted verbatim. Focused results supplied Editorial Grid / Magazine
(content hierarchy and responsive grid), Vintage Analog (warmth only), and News
Editorial typography (Newsreader / Roboto). Film effects, parallax, page flips,
sales CTAs and all-serif body options were rejected. Restaurant/Food Service's
warm gold informed the brass accent; its bright red/pink palette was replaced
by the user's specified parchment, forest and burgundy. This file records the
reviewed selection, rather than treating search output as requirements.

Food Gacha Screen.pdf is a flow reference: map destinations, budget choice,
ranked suggestions, shared constraints, catalog and detail. Sample food names,
percentages and character placeholders are not application data or requirements.

## Tokens

Single source: [tokens.css](tokens.css), imported by frontend global CSS.

| Role | Value |
| --- | --- |
| Background | #f4efe3 |
| Paper | #fffcf5 |
| Ink | #292e25 |
| Muted text | #626553 |
| Primary / forest | #294b3e |
| Burgundy / error | #7f3b3b |
| Brass | #866522 |
| Control boundary | #91836a |
| Decorative rule | #d6cbb5 |
| Heading | Newsreader, Georgia, serif |
| Body | Roboto, system-ui, sans-serif |

Font weights 400–700, with swap and system fallbacks. Body 16px, line-height 1.6;
fluid headings, short measures, no clipped labels. Normal text target >=4.5:1,
controls/focus >=3:1. Brass is an accent, not a large filled primary button.
Corners 4px; fine borders and low shadows. Spacing uses 4/8px increments.

## Screen composition

- Shared shell: crest, compact persistent mode navigation, visible active state,
  skip link and unobscured focus. Vietnamese page language and labels.
- Map: four actual destination buttons over a quiet SVG route map. No pan/zoom
  dependency. On phones it becomes a vertical route list in the same DOM order.
- Food Roll: clear budget summary and one action, native modal for precise budget
  and presets, short rolling feedback, real result, reroll/change-budget controls.
- Explore: searchable/sortable food journal grid; full detail in an accessible
  native dialog, retaining catalog position on return.
- Oracle: preferences beside ranked real API results. Show score as points out
  of 100, never invented probabilities. Preserve API order and reason meaning.
- Round Table: choose 2–12 existing foods, set constraints, inspect finalists and
  explicit elimination reasons. Final random pick remains on the client.

## Interaction and responsive rules

Native inputs and dialogs; real labels; SVG icons hidden when adjacent text
already names the action. Native modal focus containment, Escape and focus return.
No interaction relies on hover. All button/choice touch areas target 44px or more.
One primary action per form. Disabled/busy states use text, not color alone.
Loading, empty, retry and errors remain operable. Food fallback is a small line
icon and honest missing-photo text; only existing API imageUrl values are used.

Mobile first, target widths 375/768/1024/1440px. Reflow rather than truncate; no
fixed-width content that overflows. Forms/results stack on smaller screens.
Motion is limited to loading feedback and subtle color transitions and is
disabled under prefers-reduced-motion. No automatic decorative animation.

## Contract and scope

The API adapter stays unchanged. No backend, food data, Atlas, credentials or
API scoring changes. No new runtime dependencies. Existing client navigation is
in-memory; introducing a router, auth, voting or chat is outside this redesign.
Verification details and remaining review items are recorded separately after QA.
