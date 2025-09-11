import { atom } from 'recoil';

// File and input states
export const resumeFileState = atom({
  key: 'resumeFileState',
  default: null,
});

export const jobDescriptionState = atom({
  key: 'jobDescriptionState',
  default: '',
});

// Loading and error states
export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const errorState = atom({
  key: 'errorState',
  default: '',
});

// Results states
export const resultsState = atom({
  key: 'resultsState',
  default: '',
});

export const scoreState = atom({
  key: 'scoreState',
  default: null,
});

export const coverLetterState = atom({
  key: 'coverLetterState',
  default: '',
});

// Tool results states
export const rewriteBulletsState = atom({
  key: 'rewriteBulletsState',
  default: '',
});

export const skillsGapState = atom({
  key: 'skillsGapState',
  default: '',
});

export const tailorState = atom({
  key: 'tailorState',
  default: '',
});

export const interviewQsState = atom({
  key: 'interviewQsState',
  default: '',
});

export const linkedinState = atom({
  key: 'linkedinState',
  default: '',
});

// UI states
export const activeSectionState = atom({
  key: 'activeSectionState',
  default: 'analysis',
});

// Component visibility states
export const showAnalysisState = atom({
  key: 'showAnalysisState',
  default: true,
});

export const showScoreState = atom({
  key: 'showScoreState',
  default: true,
});

export const showCoverState = atom({
  key: 'showCoverState',
  default: true,
});

export const showRewriteState = atom({
  key: 'showRewriteState',
  default: true,
});

export const showSkillsState = atom({
  key: 'showSkillsState',
  default: true,
});

export const showTailorState = atom({
  key: 'showTailorState',
  default: true,
});

export const showInterviewState = atom({
  key: 'showInterviewState',
  default: true,
});

export const showLinkedinState = atom({
  key: 'showLinkedinState',
  default: true,
});

export const showToolsMenuState = atom({
  key: 'showToolsMenuState',
  default: false,
});
