# MG OS — Operations Platform

A single, beautiful dashboard for running a company: built for the CEO, Director of
Operations, Finance, Marketing, and Partnerships teams to work from one place.

## Modules (V1)

1. **Executive Dashboard** — company pulse, key metrics, priorities/OKRs, department snapshot.
2. **Task Command Center** — a drag-and-drop kanban board across every department.
3. **Finance Dashboard** — revenue vs. expenses trend, monthly figures, budget vs. actual.
4. **Meeting Assistant** — agendas, notes, and action items per meeting.
5. **SOP Library** — searchable, categorized standard operating procedures.

Every field in every module is editable in place — click any value to edit it, and use
the add/delete controls to manage records. All data is stored locally in your browser
(`localStorage`); nothing is sent to a server.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Recharts (finance trend chart)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. To build for production:

```bash
npm run build
npm run preview
```

## Design

Minimal luxury: emerald green, black, and white, with restrained gold accents. Built to
feel calm and premium — Apple-quality UI — rather than dense enterprise software.
