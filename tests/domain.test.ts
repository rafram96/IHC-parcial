import { test } from "node:test";
import assert from "node:assert/strict";
import { acknowledgeSnapshot, duplicateCandidates, newDraft, seedDatabase, validateDraft, validateActivity, newActivity } from "../lib/jornada";

test("acknowledgement never clears changes made while a synchronization is in flight", () => {
  const db = seedDatabase(); db.records[0].pending = true;
  const snapshot = [{ id: db.records[0].id, revision: db.records[0].revision }];
  db.records[0] = { ...db.records[0], revision: 2, description: "Edited during upload" };
  const result = acknowledgeSnapshot(db, snapshot, "2026-05-12T12:00:00Z");
  assert.equal(result.records[0].pending, true);
  assert.equal(result.records[0].description, "Edited during upload");
});
test("an optional phone or absent document does not prevent registration", () => {
  const d = newDraft("case"); d.type = "Vecinal"; d.description = "Conflicto entre vecinos sobre un lindero.";
  d.people[0].name = "Rosa Flores"; d.people[0].community = "Santa Rosa";
  assert.deepEqual(validateDraft(d, 2), {});
  d.people[0].documentType = "DNI"; d.people[0].document = "123";
  assert.ok(validateDraft(d, 2).document0);
});
test("repeated participation alone does not mark unrelated types as duplicates", () => {
  const db = seedDatabase(); const d = newDraft("notary"); d.type = "Constancia de convivencia"; d.people[0].name = "Lucía Torres";
  assert.equal(duplicateCandidates(d, db.records).length, 0);
  d.type = "Certificación de firmas";
  assert.equal(duplicateCandidates(d, db.records).length, 1);
});
test("end time requires a start and must follow it", () => {
  const a = newActivity(); a.title = "Reunión"; a.place = "Santa Rosa"; a.end = "10:00";
  assert.ok(validateActivity(a).end);
  a.start = "11:00"; assert.ok(validateActivity(a).end);
  a.start = "09:00"; assert.deepEqual(validateActivity(a), {});
});
