export enum Roles {
  MAKER = 'maker',
  APPROVER = 'approver',
}

export enum Statuses {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CREATED = 'created',
  VALIDATED = 'validated',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}

export enum InstructionType {
  IMMEDIATE = 'immediate',
  STANDING_INSTRUCTION = 'standingInstruction',
}

export enum TransferTypes {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
