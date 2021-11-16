export enum WarningType {
  ERROR = 0,
  WARNING = 1,
  MESSAGE = 2,
}

export enum Study {
  DATAING = 'Dataing',
  DIGFOR = 'DigFor',
  DIGSEC = 'DigSec',
  DIGSAM = 'DigSam',
}

export enum CheatsheetType {
  FILE = 'FILE',
  GITHUB = 'GITHUB',
  LINK = 'LINK',
  OTHER = 'OTHER',
}

export enum UserStudy {
  DATAING = 1,
  DIGFOR = 2,
  DIGSEC = 3,
  DIGSAM = 4,
  DRIFT = 5,
}

export enum UserClass {
  ALUMNI = -1,
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
}

export enum PermissionApp {
  CHEATSHEET = 'cheatsheet',
  EVENT = 'event',
  GROUP = 'group',
  JOBPOST = 'jobpost',
  NEWS = 'news',
  PAGE = 'page',
  USER = 'user',
}
export enum Groups {
  HS = 'HS',
  INDEX = 'Index',
  PROMO = 'Promo',
  NOK = 'NoK',
  SOSIALEN = 'Sosialen',
  DRIFT = 'Drift',
}

export enum FormType {
  SURVEY = 'SURVEY',
  EVALUATION = 'EVALUATION',
}

export enum FormResourceType {
  FORM = 'Form',
  EVENT_FORM = 'EventForm',
}

export enum FormFieldType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  TEXT_ANSWER = 'TEXT_ANSWER',
}

export enum MembershipType {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

export enum GroupType {
  TIHLDE = 'TIHLDE',
  BOARD = 'BOARD',
  SUBGROUP = 'SUBGROUP',
  COMMITTEE = 'COMMITTEE',
  STUDYYEAR = 'STUDYYEAR',
  INTERESTGROUP = 'INTERESTGROUP',
  OTHER = 'OTHER',
}

export enum StrikeReason {
  PAST_DEADLINE = 'PAST_DEADLINE',
  NO_SHOW = 'NO_SHOW',
  LATE = 'LATE',
  BAD_BEHAVIOR = 'BAD_BEHAVIOR',
  EVAL_FORM = 'EVAL_FORM',
}
