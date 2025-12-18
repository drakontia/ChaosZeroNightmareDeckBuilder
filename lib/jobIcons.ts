import { JobType, JobIcon } from "@/types";

export const jobIcons: Record<JobType, JobIcon> = {
  [JobType.STRIKER]: {
    job: JobType.STRIKER,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC96dHZOT2tCZC5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxNSwiZml0IjoiY292ZXIifX19",
  },
  [JobType.VANGUARD]: {
    job: JobType.VANGUARD,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC8xcDhsTlJWYS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxNSwiZml0IjoiY292ZXIifX19",
  },
  [JobType.RANGER]: {
    job: JobType.RANGER,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9zbEgwcVFHay5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxNSwiZml0IjoiY292ZXIifX19",
  },
  [JobType.HUNTER]: {
    job: JobType.HUNTER,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9haDZjdG5ZbS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxNSwiZml0IjoiY292ZXIifX19",
  },
  [JobType.CONTROLLER]: {
    job: JobType.CONTROLLER,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9HbnExRmd2YS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxNSwiZml0IjoiY292ZXIifX19",
  },
  [JobType.PSIONIC]: {
    job: JobType.PSIONIC,
    iconUrl: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9PYVFzR2t1Ry5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
  },
};

export const getJobIcon = (job: JobType): string => {
  return jobIcons[job]?.iconUrl || "";
};
