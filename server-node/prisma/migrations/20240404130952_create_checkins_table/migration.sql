-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_atendee_id_fkey" FOREIGN KEY ("atendee_id") REFERENCES "atendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_atendee_id_key" ON "check_ins"("atendee_id");
