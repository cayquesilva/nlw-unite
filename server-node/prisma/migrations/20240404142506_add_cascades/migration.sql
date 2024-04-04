-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_atendee_id_fkey" FOREIGN KEY ("atendee_id") REFERENCES "atendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("atendee_id", "created_at", "id") SELECT "atendee_id", "created_at", "id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE UNIQUE INDEX "check_ins_atendee_id_key" ON "check_ins"("atendee_id");
CREATE TABLE "new_atendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "atendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_atendees" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "atendees";
DROP TABLE "atendees";
ALTER TABLE "new_atendees" RENAME TO "atendees";
CREATE UNIQUE INDEX "atendees_event_id_email_key" ON "atendees"("event_id", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
