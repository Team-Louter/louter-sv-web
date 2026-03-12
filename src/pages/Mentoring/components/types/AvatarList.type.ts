type PersonType = "single" | "batch";

export type RoleType = "LEADER" | "MENTOR" | "MENTEE";

interface BaseItem {
  id: number;
  roomId: number;
  type: PersonType;
  name: string;
  users: { id: number; img: string; name: string }[];
  myRole?: RoleType;
}

interface SingleItem extends BaseItem {
  type: "single";
  userImg: string;
}

interface BatchItem extends BaseItem {
  type: "batch";
}

export type AvatarItem = SingleItem | BatchItem;
