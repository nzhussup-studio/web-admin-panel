export const queryKeys = {
  overview: ["overview"] as const,
  projects: ["projects"] as const,
  cv: {
    workExperience: ["cv", "work-experience"] as const,
    education: ["cv", "education"] as const,
    skills: ["cv", "skills"] as const,
    certifications: ["cv", "certifications"] as const,
    preferences: ["cv", "preferences"] as const,
  },
  albums: {
    all: ["albums"] as const,
    list: (type = "all") => ["albums", "list", type] as const,
    detail: (id: string) => ["albums", "detail", id] as const,
    upload: (albumId: string, jobId: string) =>
      ["albums", "upload", albumId, jobId] as const,
  },
  llm: {
    configuration: ["llm", "configuration"] as const,
    summary: (language: string) => ["llm", "summary", language] as const,
  },
} as const;
