import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1766064361824 implements MigrationInterface {
    name = 'InitialSchema1766064361824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "role" character varying(100), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_45f0625bd8172eb9c821c948a0f" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "Portfolio" ("portfolioId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "sponsorUserId" uuid, CONSTRAINT "PK_c3aea81bb2f1ccd65a42d6c7d22" PRIMARY KEY ("portfolioId"))`);
        await queryRunner.query(`CREATE TABLE "LifecycleStatus" ("statusId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_4acd64135f6da99a2c53806a903" PRIMARY KEY ("statusId"))`);
        await queryRunner.query(`CREATE TABLE "Initiative" ("initiativeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "strategicGoal" text, "estimatedBusinessBenefit" numeric(18,2), "estimatedCost" numeric(18,2), "estimatedROI" numeric(18,2), "dateProposed" TIMESTAMP, "portfolioId" uuid, "statusId" integer, CONSTRAINT "PK_18c88bcee1a9071e3358bd9d960" PRIMARY KEY ("initiativeId"))`);
        await queryRunner.query(`CREATE TABLE "Epic" ("epicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "goal" text, "businessCaseLink" character varying(500), "actualCost" numeric(18,2), "initiativeId" uuid, "startDate" date, "endDate" date, "statusId" integer, CONSTRAINT "PK_063b5589d546d1425b96c050f6f" PRIMARY KEY ("epicId"))`);
        await queryRunner.query(`CREATE TABLE "Priority" ("priorityId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_59d84f34be3ef8bd38863b84de6" PRIMARY KEY ("priorityId"))`);
        await queryRunner.query(`CREATE TABLE "RequirementType" ("typeId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_59d79c4872f4e4055ed9b35620e" PRIMARY KEY ("typeId"))`);
        await queryRunner.query(`CREATE TABLE "Complexity" ("complexityId" SERIAL NOT NULL, "name" character varying(10) NOT NULL, CONSTRAINT "PK_374912de75b1aa0f90bb8ab0836" PRIMARY KEY ("complexityId"))`);
        await queryRunner.query(`CREATE TABLE "Source" ("sourceId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_706eea235974833986f4e2e7764" PRIMARY KEY ("sourceId"))`);
        await queryRunner.query(`CREATE TABLE "EffortEstimateType" ("effortTypeId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_2a8e3a82ffc211ac90cd301b7be" PRIMARY KEY ("effortTypeId"))`);
        await queryRunner.query(`CREATE TABLE "RiskLevel" ("riskLevelId" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "riskType" character varying(50), CONSTRAINT "PK_91e730482ddbe026367e6120451" PRIMARY KEY ("riskLevelId"))`);
        await queryRunner.query(`CREATE TABLE "Metric" ("metricId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_8574b499221f6dd1721e2173105" PRIMARY KEY ("metricId"))`);
        await queryRunner.query(`CREATE TABLE "Requirement" ("requirementId" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "storyStatement" text, "acceptanceCriteria" text, "effortEstimate" integer, "actualEffort" integer, "businessValue" numeric(18,2), "changeHistoryLink" character varying(500), "ownerRole" character varying(100), "applicablePhase" character varying(100), "requirementVersion" character varying(50), "requirementStatusDate" TIMESTAMP, "isMandatory" boolean NOT NULL DEFAULT false, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "goLiveDate" date, "estimatedIncrementalSales" integer, "experienceImpactScore" integer, "competitiveBenchmarkScore" integer, "valueEffortRatio" numeric(18,2), "campaignUrgencyScore" integer, "needsFunctionalDiscovery" boolean NOT NULL DEFAULT false, "needsExperimentation" boolean NOT NULL DEFAULT false, "externalReferenceLink" character varying(500), "teamDependencies" text, "priorityId" integer, "statusId" integer, "typeId" integer, "complexityId" integer, "sourceId" integer, "effortTypeId" integer, "riskLevelId" integer, "metricId" integer, "verificationMethodId" integer, "epicId" uuid, "productOwnerId" uuid, "approverUserId" uuid, CONSTRAINT "PK_273b63033703c064059856aaeef" PRIMARY KEY ("requirementId"))`);
        await queryRunner.query(`CREATE TABLE "VerificationMethod" ("verificationMethodId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_05c3e98c31f6d668c1dabe01743" PRIMARY KEY ("verificationMethodId"))`);
        await queryRunner.query(`ALTER TABLE "Portfolio" ADD CONSTRAINT "FK_1da98eaa5e346aa16d6712a0800" FOREIGN KEY ("sponsorUserId") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Initiative" ADD CONSTRAINT "FK_f38a0c639d08218ce431afe7dd0" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("portfolioId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Initiative" ADD CONSTRAINT "FK_689b96c6519a100d872af5b147a" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD CONSTRAINT "FK_9871e71a5e003c2353b1071a5f1" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("initiativeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD CONSTRAINT "FK_507b9a5aad746cde948099190bb" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_320d1c94d0ce09ab8fe25ba89a3" FOREIGN KEY ("priorityId") REFERENCES "Priority"("priorityId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_fa5bd09e823e43ac68517a9117d" FOREIGN KEY ("statusId") REFERENCES "LifecycleStatus"("statusId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_befb4c540d3fabc95c28f8699a1" FOREIGN KEY ("typeId") REFERENCES "RequirementType"("typeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_80462115b3708f16f00a8292036" FOREIGN KEY ("complexityId") REFERENCES "Complexity"("complexityId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_a6b5493bd68766c9e9f3c8dca9e" FOREIGN KEY ("sourceId") REFERENCES "Source"("sourceId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_78a46e8304f07899dcab21c4608" FOREIGN KEY ("effortTypeId") REFERENCES "EffortEstimateType"("effortTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_85c83e43e43adc2de847a68c2bc" FOREIGN KEY ("riskLevelId") REFERENCES "RiskLevel"("riskLevelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_a0673e44cee36f262ca006db26f" FOREIGN KEY ("metricId") REFERENCES "Metric"("metricId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_4d08a20999ed620c8243adae436" FOREIGN KEY ("verificationMethodId") REFERENCES "VerificationMethod"("verificationMethodId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_29edd9c2446e1460a6d01d5cd12" FOREIGN KEY ("epicId") REFERENCES "Epic"("epicId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_0f9df40e914cf27465e6a6a419e" FOREIGN KEY ("productOwnerId") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Requirement" ADD CONSTRAINT "FK_5b2433d7aa06d268979f39810e7" FOREIGN KEY ("approverUserId") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_5b2433d7aa06d268979f39810e7"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_0f9df40e914cf27465e6a6a419e"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_29edd9c2446e1460a6d01d5cd12"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_4d08a20999ed620c8243adae436"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_a0673e44cee36f262ca006db26f"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_85c83e43e43adc2de847a68c2bc"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_78a46e8304f07899dcab21c4608"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_a6b5493bd68766c9e9f3c8dca9e"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_80462115b3708f16f00a8292036"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_befb4c540d3fabc95c28f8699a1"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_fa5bd09e823e43ac68517a9117d"`);
        await queryRunner.query(`ALTER TABLE "Requirement" DROP CONSTRAINT "FK_320d1c94d0ce09ab8fe25ba89a3"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP CONSTRAINT "FK_507b9a5aad746cde948099190bb"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP CONSTRAINT "FK_9871e71a5e003c2353b1071a5f1"`);
        await queryRunner.query(`ALTER TABLE "Initiative" DROP CONSTRAINT "FK_689b96c6519a100d872af5b147a"`);
        await queryRunner.query(`ALTER TABLE "Initiative" DROP CONSTRAINT "FK_f38a0c639d08218ce431afe7dd0"`);
        await queryRunner.query(`ALTER TABLE "Portfolio" DROP CONSTRAINT "FK_1da98eaa5e346aa16d6712a0800"`);
        await queryRunner.query(`DROP TABLE "VerificationMethod"`);
        await queryRunner.query(`DROP TABLE "Requirement"`);
        await queryRunner.query(`DROP TABLE "Metric"`);
        await queryRunner.query(`DROP TABLE "RiskLevel"`);
        await queryRunner.query(`DROP TABLE "EffortEstimateType"`);
        await queryRunner.query(`DROP TABLE "Source"`);
        await queryRunner.query(`DROP TABLE "Complexity"`);
        await queryRunner.query(`DROP TABLE "RequirementType"`);
        await queryRunner.query(`DROP TABLE "Priority"`);
        await queryRunner.query(`DROP TABLE "Epic"`);
        await queryRunner.query(`DROP TABLE "Initiative"`);
        await queryRunner.query(`DROP TABLE "LifecycleStatus"`);
        await queryRunner.query(`DROP TABLE "Portfolio"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
