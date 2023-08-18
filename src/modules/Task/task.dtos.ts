export enum TaskPriorities {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent',
}

export enum TaskTags {
  personal = 'personal',
  study = 'study',
  finance = 'finance',
  career = 'career',
  health = 'health',
}

export class CreateTaskInput {
  name: string;
  date: Date;
  hour: Date;
  description: string;
  priority: TaskPriorities;
  tag: TaskTags;
}
