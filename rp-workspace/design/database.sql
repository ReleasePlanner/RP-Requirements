-- Database Schema for Requirements Definition and Governance Model
-- Generated based on design/database.puml

-- ===================================================
-- 1. STRATEGY AND PORTFOLIO
-- ===================================================
CREATE TABLE "Portfolio" (
    "portfolioId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "creationDate" TIMESTAMP NOT NULL DEFAULT now(),
    "sponsorUserId" UUID,
    CONSTRAINT "PK_Portfolio" PRIMARY KEY ("portfolioId")
);

CREATE TABLE "Initiative" (
    "initiativeId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "strategicGoal" TEXT,
    "estimatedBusinessBenefit" DECIMAL,
    "estimatedCost" DECIMAL,
    "estimatedROI" DECIMAL,
    "dateProposed" TIMESTAMP,
    "portfolioId" UUID,
    "statusId" INT,
    CONSTRAINT "PK_Initiative" PRIMARY KEY ("initiativeId")
);

-- ===================================================
-- 2. REQUIREMENTS HIERARCHY
-- ===================================================
CREATE TABLE "Epic" (
    "epicId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "goal" TEXT,
    "businessCaseLink" VARCHAR,
    "actualCost" DECIMAL,
    "startDate" DATE,
    "endDate" DATE,
    "initiativeId" UUID,
    "statusId" INT,
    CONSTRAINT "PK_Epic" PRIMARY KEY ("epicId")
);

CREATE TABLE "Requirement" (
    "requirementId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "storyStatement" TEXT,
    "acceptanceCriteria" TEXT,
    "effortEstimate" INT,
    "actualEffort" INT,
    "businessValue" DECIMAL,
    "changeHistoryLink" VARCHAR,
    "ownerRole" VARCHAR(100),
    "applicablePhase" VARCHAR(100),
    "requirementVersion" VARCHAR(50),
    "requirementStatusDate" TIMESTAMP,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "creationDate" TIMESTAMP NOT NULL DEFAULT now(),
    "goLiveDate" DATE,
    "priorityId" INT,
    "statusId" INT,
    "typeId" INT,
    "complexityId" INT,
    "sourceId" INT,
    "effortTypeId" INT,
    "productOwnerId" UUID,
    "approverUserId" UUID,
    "epicId" UUID,
    "riskLevelId" INT,
    "metricId" INT,
    "verificationMethodId" INT,
    CONSTRAINT "PK_Requirement" PRIMARY KEY ("requirementId")
);

-- ===================================================
-- 3. USERS (Roles)
-- ===================================================
CREATE TABLE "User" (
    "userId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    CONSTRAINT "PK_User" PRIMARY KEY ("userId")
);

-- ===================================================
-- 4. LOOKUP TABLES (CATALOGS)
-- ===================================================
CREATE TABLE "Priority" (
    "priorityId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_Priority" PRIMARY KEY ("priorityId")
);

CREATE TABLE "LifecycleStatus" (
    "statusId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_LifecycleStatus" PRIMARY KEY ("statusId")
);

CREATE TABLE "RequirementType" (
    "typeId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_RequirementType" PRIMARY KEY ("typeId")
);

CREATE TABLE "Complexity" (
    "complexityId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_Complexity" PRIMARY KEY ("complexityId")
);

CREATE TABLE "Source" (
    "sourceId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_Source" PRIMARY KEY ("sourceId")
);

CREATE TABLE "EffortEstimateType" (
    "effortTypeId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_EffortEstimateType" PRIMARY KEY ("effortTypeId")
);

CREATE TABLE "RiskLevel" (
    "riskLevelId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    "riskType" VARCHAR,
    CONSTRAINT "PK_RiskLevel" PRIMARY KEY ("riskLevelId")
);

CREATE TABLE "Metric" (
    "metricId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_Metric" PRIMARY KEY ("metricId")
);

CREATE TABLE "VerificationMethod" (
    "verificationMethodId" INT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_VerificationMethod" PRIMARY KEY ("verificationMethodId")
);

-- ===================================================
-- 5. RELATIONSHIPS (FOREIGN KEYS)
-- ===================================================

-- Portfolio
ALTER TABLE "Portfolio" ADD CONSTRAINT "FK_Portfolio_Sponsor" FOREIGN KEY ("sponsorUserId") REFERENCES "User"("userId");

-- Initiative
ALTER TABLE "Initiative" ADD CONSTRAINT "FK_Initiative_Portfolio" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("portfolioId");
ALTER TABLE "Initiative" ADD CONSTRAINT "FK_Initiative_Status" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId");

-- Epic
ALTER TABLE "Epic" ADD CONSTRAINT "FK_Epic_Initiative" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("initiativeId");
ALTER TABLE "Epic" ADD CONSTRAINT "FK_Epic_Status" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId");

-- Requirement
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Priority" FOREIGN KEY ("priorityId") REFERENCES "Priority"("priorityId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Status" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Type" FOREIGN KEY ("typeId") REFERENCES "RequirementType"("typeId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Complexity" FOREIGN KEY ("complexityId") REFERENCES "Complexity"("complexityId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Source" FOREIGN KEY ("sourceId") REFERENCES "Source"("sourceId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_EffortType" FOREIGN KEY ("effortTypeId") REFERENCES "EffortEstimateType"("effortTypeId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_RiskLevel" FOREIGN KEY ("riskLevelId") REFERENCES "RiskLevel"("riskLevelId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Metric" FOREIGN KEY ("metricId") REFERENCES "Metric"("metricId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_VerificationMethod" FOREIGN KEY ("verificationMethodId") REFERENCES "VerificationMethod"("verificationMethodId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Epic" FOREIGN KEY ("epicId") REFERENCES "Epic"("epicId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_ProductOwner" FOREIGN KEY ("productOwnerId") REFERENCES "User"("userId");
ALTER TABLE "Requirement" ADD CONSTRAINT "FK_Requirement_Approver" FOREIGN KEY ("approverUserId") REFERENCES "User"("userId");
