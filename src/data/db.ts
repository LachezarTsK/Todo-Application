import type { TODO } from "../util/dataStructures";
import { Dexie, type EntityTable } from "dexie";
import "dexie-observable";

export const db = new Dexie("MyDatabase") as Dexie & {
  todo: EntityTable<TODO, "id">;
};

db.version(1).stores({
  todo: "++id, title, todoList",
});
