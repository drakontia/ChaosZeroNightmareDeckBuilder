import { JobType, JobIcon } from "@/types";

export const jobIcons: Record<JobType, JobIcon> = {
  [JobType.STRIKER]: {
    job: JobType.STRIKER,
    iconUrl: "/images/characters/jobs/character_job_striker.png",
  },
  [JobType.VANGUARD]: {
    job: JobType.VANGUARD,
    iconUrl: "/images/characters/jobs/character_job_vanguard.png",
  },
  [JobType.RANGER]: {
    job: JobType.RANGER,
    iconUrl: "/images/characters/jobs/character_job_ranger.png",
  },
  [JobType.HUNTER]: {
    job: JobType.HUNTER,
    iconUrl: "/images/characters/jobs/character_job_hunter.png",
  },
  [JobType.CONTROLLER]: {
    job: JobType.CONTROLLER,
    iconUrl: "/images/characters/jobs/character_job_controller.png",
  },
  [JobType.PSIONIC]: {
    job: JobType.PSIONIC,
    iconUrl: "/images/characters/jobs/character_job_psionic.png",
  },
};

export const getJobIcon = (job: JobType): string => {
  return jobIcons[job]?.iconUrl || "";
};
