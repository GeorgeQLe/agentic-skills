export type ListType = "normal" | "done" | "punt";
export type CardType = "task" | "action";
export type BoardActorType = "user" | "agent";
export type BoardComponentType = "board" | "list" | "card";
export type BoardActionName =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "MOVE"
  | "REORDER"
  | "RENAME"
  | "UPDATE_DESCRIPTION"
  | "SET_DUE_DATE"
  | "CLEAR_DUE_DATE"
  | "SET_PROGRESS"
  | "CLEAR_PROGRESS"
  | "ADD_CATEGORY"
  | "REMOVE_CATEGORY"
  | "STAR"
  | "UNSTAR"
  | "ASSIGN_USER"
  | "UNASSIGN_USER"
  | "ASSIGN_AGENT"
  | "UNASSIGN_AGENT"
  | "SET_TEAM"
  | "REMOVE_TEAM"
  | "ARCHIVE"
  | "RESTORE"
  | "MARK_DONE"
  | "MARK_UNDONE"
  | "ADD_CHECKLIST"
  | "DELETE_CHECKLIST"
  | "TOGGLE_CHECKLIST_ITEM";

export type BoardActionChangeValue = string | number | boolean | Date | null;
export type BoardActionChanges = Record<string, BoardActionChangeValue>;

export interface BoardView {
  id: string;
  name: string;
}

export interface BoardCardView {
  id: string;
  name: string;
  done: boolean;
  starred: boolean;
  dueDate?: string | Date | null;
  description?: string | null;
  progress?: number | null;
}

export interface BoardListSummary {
  id: string;
  name: string;
  type: ListType;
  order?: number;
  cards?: BoardCardView[];
}

export interface BoardSearchResult {
  id: string;
  name: string;
  done: boolean;
  starred: boolean;
  dueDate?: string | Date | null;
  listName?: string | null;
  boardName?: string | null;
  boardId?: string | null;
}

export interface BoardActionInput {
  action: BoardActionName;
  entity: BoardComponentType;
  entityId: string;
  entityName: string;
  boardId: string;
  changes?: BoardActionChanges | null;
}

export interface BoardActionRecord {
  id: string;
  action: BoardActionName;
  boardComponent: BoardComponentType;
  boardComponentId: string;
  boardComponentName: string;
  boardId: string;
  changes: BoardActionChanges | null;
  createdAt: string | Date;
  userId: string;
  actorType: BoardActorType;
  agentSessionId?: string | null;
  agentTemplateId?: string | null;
}

export interface BoardActionActivityEntry {
  action: BoardActionName;
  actorType: BoardActorType;
  userId: string;
  changes: BoardActionChanges | null;
  createdAt: string | Date;
}

export interface ListDefinition {
  name: string;
  order: number;
  listType: ListType;
}
