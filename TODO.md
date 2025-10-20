# TODO: Add Share Button to Study Materials Cards

## Tasks
- [x] Add `handleShare` function in `src/hooks/useStudyMaterialHandlers.ts` to handle sharing using Web Share API
- [x] Update `src/components/study-materials/StudyMaterialCard.tsx` to include the Share button with conditional enable/disable based on visibility
- [x] Update `src/components/study-materials/StudyMaterialList.tsx` to pass `onShare` prop to the card

## Followup
- [x] Updated share to use material's URL instead of page URL for sharing particular content

# TODO: Add Share Button to External Links Cards

## Tasks
- [x] Add `handleShare` function in `src/hooks/useExternalLinkHandlers.ts` to handle sharing using Web Share API
- [x] Update `src/components/external-links/ExternalLinkCard.tsx` to include the Share button
- [x] Update `src/components/external-links/ExternalLinkList.tsx` to use the hook and pass `onShare` prop to the card
