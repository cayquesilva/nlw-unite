/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `atendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "atendees_event_id_email_key" ON "atendees"("event_id", "email");
