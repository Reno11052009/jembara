CREATE INDEX IF NOT EXISTS "auth_session_lastSeenAt_idx"
ON "auth_session"("lastSeenAt");

INSERT INTO "skill" ("id", "name", "category", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Web Development', 'Technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'UI/UX Design', 'Design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Graphic Design', 'Design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Video Editing', 'Creative', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Photography', 'Creative', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Digital Marketing', 'Marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Social Media Management', 'Marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Content Creation', 'Creative', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Copywriting', 'Marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'SEO', 'Marketing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Figma', 'Design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'React', 'Technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Next.js', 'Technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Product Photography', 'Creative', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO UPDATE
SET "category" = EXCLUDED."category", "updatedAt" = CURRENT_TIMESTAMP;

-- Hapus hanya master skill liar yang tidak pernah dipakai. Skill legacy yang
-- sudah terhubung ke profil/proyek tetap dipertahankan agar data pengguna aman.
DELETE FROM "skill" AS candidate
WHERE candidate."name" NOT IN (
  'Web Development', 'UI/UX Design', 'Graphic Design', 'Video Editing',
  'Photography', 'Digital Marketing', 'Social Media Management',
  'Content Creation', 'Copywriting', 'SEO', 'Figma', 'React', 'Next.js',
  'Product Photography'
)
AND NOT EXISTS (
  SELECT 1 FROM "student_skill" WHERE "student_skill"."skillId" = candidate."id"
)
AND NOT EXISTS (
  SELECT 1 FROM "project_skill" WHERE "project_skill"."skillId" = candidate."id"
);
