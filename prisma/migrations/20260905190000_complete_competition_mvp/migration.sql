-- Complete the competition-critical Jembara workflows: explainable matching,
-- revisions, status history, moderation, audit evidence, and TOTP state.
ALTER TABLE "user"
  ADD COLUMN "twoFactorSecret" VARCHAR(512),
  ADD COLUMN "twoFactorPendingSecret" VARCHAR(512),
  ADD COLUMN "twoFactorRecoveryCodes" JSONB,
  ADD COLUMN "twoFactorEnabledAt" TIMESTAMP(6);

ALTER TABLE "student"
  ADD COLUMN "expectedBudgetMin" INTEGER,
  ADD COLUMN "expectedBudgetMax" INTEGER,
  ADD CONSTRAINT "student_expected_budget_valid" CHECK (
    ("expectedBudgetMin" IS NULL AND "expectedBudgetMax" IS NULL) OR
    ("expectedBudgetMin" >= 50000 AND "expectedBudgetMax" >= "expectedBudgetMin")
  );

ALTER TABLE "student_skill"
  ADD COLUMN "level" TEXT NOT NULL DEFAULT 'BEGINNER',
  ADD COLUMN "evidencePortfolioId" UUID,
  ADD COLUMN "verifiedAt" TIMESTAMP(6),
  ADD COLUMN "verifiedByUserId" UUID,
  ADD CONSTRAINT "student_skill_level_valid" CHECK ("level" IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));

ALTER TABLE "project_skill" ADD COLUMN "required" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "project_submission"
  ADD COLUMN "revisionCount" INTEGER NOT NULL DEFAULT 0,
  ADD CONSTRAINT "project_submission_revision_count_valid" CHECK ("revisionCount" BETWEEN 0 AND 2);

CREATE TABLE "project_revision" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "submissionId" UUID NOT NULL,
  "requestedByUserId" UUID NOT NULL,
  "sequence" INTEGER NOT NULL,
  "reason" VARCHAR(2000) NOT NULL,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "project_revision_sequence_valid" CHECK ("sequence" BETWEEN 1 AND 2)
);

CREATE TABLE "project_status_history" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT NOT NULL,
  "reason" VARCHAR(500),
  "actorUserId" UUID,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_status_history_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "project_status_history_status_valid" CHECK (
    "toStatus" IN ('OPEN','PROPOSAL','IN_PROGRESS','REVIEW','COMPLETED','CANCELLED') AND
    ("fromStatus" IS NULL OR "fromStatus" IN ('OPEN','PROPOSAL','IN_PROGRESS','REVIEW','COMPLETED','CANCELLED'))
  )
);

CREATE TABLE "matching_score" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "studentId" UUID NOT NULL,
  "skillsScore" INTEGER NOT NULL,
  "portfolioScore" INTEGER NOT NULL,
  "ratingScore" INTEGER NOT NULL,
  "budgetScore" INTEGER NOT NULL,
  "availabilityScore" INTEGER NOT NULL,
  "locationScore" INTEGER NOT NULL,
  "totalScore" INTEGER NOT NULL,
  "eligible" BOOLEAN NOT NULL DEFAULT false,
  "reasons" JSONB NOT NULL,
  "inputs" JSONB NOT NULL,
  "calculatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "matching_score_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "matching_score_factors_valid" CHECK (
    "skillsScore" BETWEEN 0 AND 100 AND "portfolioScore" BETWEEN 0 AND 100 AND
    "ratingScore" BETWEEN 0 AND 100 AND "budgetScore" BETWEEN 0 AND 100 AND
    "availabilityScore" BETWEEN 0 AND 100 AND "locationScore" BETWEEN 0 AND 100 AND
    "totalScore" BETWEEN 0 AND 100
  )
);

CREATE TABLE "content_report" (
  "id" UUID NOT NULL,
  "reporterUserId" UUID NOT NULL,
  "targetUserId" UUID,
  "projectId" UUID,
  "messageId" UUID,
  "category" VARCHAR(50) NOT NULL,
  "description" VARCHAR(2000) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "resolutionNote" VARCHAR(2000),
  "resolvedByUserId" UUID,
  "resolvedAt" TIMESTAMP(6),
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "content_report_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "content_report_status_valid" CHECK ("status" IN ('OPEN','REVIEWING','RESOLVED','REJECTED')),
  CONSTRAINT "content_report_target_valid" CHECK (num_nonnulls("targetUserId", "projectId", "messageId") >= 1)
);

CREATE TABLE "audit_log" (
  "id" UUID NOT NULL,
  "actorUserId" UUID,
  "action" VARCHAR(100) NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "entityId" VARCHAR(100),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "project_revision_projectId_sequence_key" ON "project_revision"("projectId", "sequence");
CREATE INDEX "project_revision_submissionId_createdAt_idx" ON "project_revision"("submissionId", "createdAt");
CREATE INDEX "project_revision_requestedByUserId_createdAt_idx" ON "project_revision"("requestedByUserId", "createdAt");
CREATE INDEX "project_status_history_projectId_createdAt_idx" ON "project_status_history"("projectId", "createdAt");
CREATE INDEX "project_status_history_actorUserId_createdAt_idx" ON "project_status_history"("actorUserId", "createdAt");
CREATE UNIQUE INDEX "matching_score_projectId_studentId_key" ON "matching_score"("projectId", "studentId");
CREATE INDEX "matching_score_projectId_eligible_totalScore_idx" ON "matching_score"("projectId", "eligible", "totalScore");
CREATE INDEX "matching_score_studentId_eligible_totalScore_idx" ON "matching_score"("studentId", "eligible", "totalScore");
CREATE INDEX "content_report_status_createdAt_idx" ON "content_report"("status", "createdAt");
CREATE INDEX "content_report_reporterUserId_createdAt_idx" ON "content_report"("reporterUserId", "createdAt");
CREATE INDEX "content_report_projectId_idx" ON "content_report"("projectId");
CREATE INDEX "content_report_messageId_idx" ON "content_report"("messageId");
CREATE INDEX "content_report_targetUserId_idx" ON "content_report"("targetUserId");
CREATE INDEX "audit_log_actorUserId_createdAt_idx" ON "audit_log"("actorUserId", "createdAt");
CREATE INDEX "audit_log_entityType_entityId_createdAt_idx" ON "audit_log"("entityType", "entityId", "createdAt");
CREATE INDEX "audit_log_action_createdAt_idx" ON "audit_log"("action", "createdAt");
CREATE INDEX "student_skill_verifiedByUserId_verifiedAt_idx" ON "student_skill"("verifiedByUserId", "verifiedAt");
CREATE INDEX "student_skill_evidencePortfolioId_idx" ON "student_skill"("evidencePortfolioId");

ALTER TABLE "student_skill" ADD CONSTRAINT "student_skill_evidencePortfolioId_fkey" FOREIGN KEY ("evidencePortfolioId") REFERENCES "portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "student_skill" ADD CONSTRAINT "student_skill_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "project_revision" ADD CONSTRAINT "project_revision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_revision" ADD CONSTRAINT "project_revision_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "project_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_revision" ADD CONSTRAINT "project_revision_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_status_history" ADD CONSTRAINT "project_status_history_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_status_history" ADD CONSTRAINT "project_status_history_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "matching_score" ADD CONSTRAINT "matching_score_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matching_score" ADD CONSTRAINT "matching_score_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
