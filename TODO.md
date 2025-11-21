# TODO: Fix Build Issues

## 1. Fix TypeScript 'any' types

- [ ] About.tsx: Change `icon: any` to proper type for Lucide icons
- [ ] EventsList.tsx: Define proper type for statusConfig instead of `any`

## 2. Escape unescaped entities in JSX

- [ ] About.tsx: Replace `'` with `&apos;` in text content
- [ ] FooterCTA.tsx: Replace `'` with `&apos;` in text content
- [ ] TestimonialsSection.tsx: Replace `"` with `"` in text content
- [ ] VideoTutorialSection.tsx: Replace `'` with `&apos;` in text content
- [ ] ValuePropositionSection.tsx: Replace `'` and `"` with `&apos;` and `"` in text content

## 3. Replace <img> with <Image> and add alt

- [ ] About.tsx: Import Image from 'next/image', replace <img> with <Image> at lines 229 and 275, ensure alt is present
- [ ] LearningSection.tsx: Add alt prop to <img>

## 4. Remove unused variables and imports

- [ ] Events.tsx: Remove formatDateTime, containerVariants, itemVariants, statCardVariants
- [ ] EventsList.tsx: Remove ForwardRefExoticComponent, RefAttributes, ElementType, LucideProps imports
- [ ] EventsSort.tsx: Remove currentPage from props and usage
- [ ] HeroHeader.tsx: Remove fadeUp
- [ ] HistoryTimeline.tsx: Remove Button, ChevronRight imports
- [ ] VideoTutorialSection.tsx: Remove unused icon imports (Check, Bell, etc.)
- [ ] Footer.tsx: Remove itemVariants
- [ ] FooterNewsletter.tsx: Remove useState import
- [ ] FooterStats.tsx: Remove index parameter
- [ ] Header.tsx: Remove icons import

## 5. Fix useEffect dependencies

- [ ] Events.tsx: Add fetchEvents and setBreadcrumbs to the dependency array
- [ ] HeroHeader.tsx: Add mouseX and mouseY to the dependency array

## Followup

- [ ] Run `npm run build` to verify all issues are resolved
