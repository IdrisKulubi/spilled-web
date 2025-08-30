import { BaseRepository } from "./BaseRepository";
import { users, type User, type InsertUser } from "@/server/db/schema";

export class UserRepository extends BaseRepository<User, InsertUser> {
  protected table = users;
  protected idColumn = users.id;
}

