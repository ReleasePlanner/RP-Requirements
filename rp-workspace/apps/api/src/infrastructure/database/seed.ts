import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

// Entities
import { Priority } from '../../domain/entities/priority.entity';
import { LifecycleStatus } from '../../domain/entities/lifecycle-status.entity';
import { RequirementType } from '../../domain/entities/requirement-type.entity';
import { RiskLevel } from '../../domain/entities/risk-level.entity';
import { Complexity } from '../../domain/entities/complexity.entity';
import { Source } from '../../domain/entities/source.entity';
import { EffortEstimateType } from '../../domain/entities/effort-estimate-type.entity';
import { Metric } from '../../domain/entities/metric.entity';
import { VerificationMethod } from '../../domain/entities/verification-method.entity';
import { Sponsor } from '../../domain/entities/sponsor.entity';
import { Portfolio } from '../../domain/entities/portfolio.entity';
import { Initiative } from '../../domain/entities/initiative.entity';
import { Epic } from '../../domain/entities/epic.entity';
import { Approver } from '../../domain/entities/approver.entity';
import { Requirement } from '../../domain/entities/requirement.entity';

import { ProductOwner } from '../../domain/entities/product-owner.entity';
import { RequirementReference } from '../../domain/entities/requirement-reference.entity';
import { Widget, WidgetType } from '../../domain/entities/widget.entity';

dotenv.config({ path: join(__dirname, '../../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../../domain/entities/*.entity{.ts,.js}')],
  synchronize: true,
  dropSchema: true,
  logging: false,
});

async function seed() {
  console.log('🌱 Starting Database Seed...');
  await dataSource.initialize();

  try {
    console.log('🧹 Cleaning existing data...');
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }

    console.log('� Seeding Catalogs...');

    // Lifecycle Status
    const statusRepo = dataSource.getRepository(LifecycleStatus);
    const statuses = await statusRepo.save([
      { statusId: 1, name: 'Draft' },
      { statusId: 2, name: 'Approved' },
      { statusId: 3, name: 'In Progress' },
      { statusId: 4, name: 'Done' },
      { statusId: 5, name: 'Archived' },
    ]);

    // Requirement Types
    const typeRepo = dataSource.getRepository(RequirementType);
    const types = await typeRepo.save([
      { typeId: 1, name: 'User Story' },
      { typeId: 2, name: 'Non-Functional' },
      { typeId: 3, name: 'Technical Debt' },
      { typeId: 4, name: 'Business Rule' },
    ]);

    // Verification Methods
    const vmRepo = dataSource.getRepository(VerificationMethod);
    const vMethods = await vmRepo.save([
      { verificationMethodId: 1, name: 'Inspection' },
      { verificationMethodId: 2, name: 'Demonstration' },
      { verificationMethodId: 3, name: 'Test' },
      { verificationMethodId: 4, name: 'Analysis' },
    ]);

    // Priorities
    const priorities = await dataSource.getRepository(Priority).save([
      { priorityId: 1, name: 'Critical', weight: 100 },
      { priorityId: 2, name: 'High', weight: 80 },
      { priorityId: 3, name: 'Medium', weight: 50 },
      { priorityId: 4, name: 'Low', weight: 20 },
    ]);

    // Risk Levels, Complexity, Effort, Source, Metric (Standard)
    await dataSource.getRepository(RiskLevel).save([
      { riskLevelId: 1, name: 'High', riskType: 'Technical' },
      { riskLevelId: 2, name: 'Medium', riskType: 'Business' },
      { riskLevelId: 3, name: 'Low', riskType: 'Operational' },
    ]);
    const complexities = await dataSource.getRepository(Complexity).save([
      { complexityId: 1, name: 'High' },
      { complexityId: 2, name: 'Medium' },
      { complexityId: 3, name: 'Low' },
    ]);
    const effortTypes = await dataSource.getRepository(EffortEstimateType).save([
      { effortEstimateTypeId: 1, name: 'Story Points' },
      { effortEstimateTypeId: 2, name: 'Hours' },
    ]);
    const sources = await dataSource.getRepository(Source).save([
      { sourceId: 1, name: 'Customer' },
      { sourceId: 2, name: 'Market Analysis' },
    ]);
    await dataSource.getRepository(Metric).save([
      { metricId: 1, name: 'NPS Impact' },
      { metricId: 2, name: 'Revenue Growth' },
    ]);

    console.log('�👥 Seeding Sponsors...');
    const password = await bcrypt.hash('Password123!', 10);
    const sponsors = await dataSource.getRepository(Sponsor).save([
      {
        sponsorId: uuidv4(),
        name: 'System Admin',
        email: 'admin@example.com',
        password,
        role: 'Admin',
      },
      {
        sponsorId: uuidv4(),
        name: 'Sarah Connor',
        email: 'sponsor@example.com',
        password,
        role: 'Sponsor',
      },
      {
        sponsorId: uuidv4(),
        name: 'John Doe',
        email: 'po@example.com',
        password,
        role: 'ProductOwner',
      },
      {
        sponsorId: uuidv4(),
        name: 'Jane Smith',
        email: 'approver@example.com',
        password,
        role: 'Approver',
      },
    ]);

    // Sponsors (just keeping them for Portfolio/Project sponsorship if needed)
    const sponsorUser = sponsors[1];

    console.log('👷 Seeding Product Owners...');
    const productOwnerRepo = dataSource.getRepository(ProductOwner);
    const productOwners = await productOwnerRepo.save([
      {
        productOwnerId: uuidv4(),
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'Lead PO',
        status: 'Active',
      },
      {
        productOwnerId: uuidv4(),
        firstName: 'Bob',
        lastName: 'Williams',
        role: 'Technical PO',
        status: 'Active',
      },
      {
        productOwnerId: uuidv4(),
        firstName: 'Charlie',
        lastName: 'Brown',
        role: 'Junior PO',
        status: 'Inactive',
      },
    ]);

    console.log('📝 Seeding Approvers...');
    const approverRepo = dataSource.getRepository(Approver);
    const approvers = await approverRepo.save([
      {
        approverId: uuidv4(),
        firstName: 'David',
        lastName: 'Miller',
        role: 'Director',
        status: 'Active',
      },
      { approverId: uuidv4(), firstName: 'Eva', lastName: 'Davis', role: 'VP', status: 'Active' },
      {
        approverId: uuidv4(),
        firstName: 'Frank',
        lastName: 'Moore',
        role: 'Manager',
        status: 'Active',
      },
      {
        approverId: uuidv4(),
        firstName: 'Grace',
        lastName: 'Taylor',
        role: 'Senior Manager',
        status: 'Active',
      },
      {
        approverId: uuidv4(),
        firstName: 'Henry',
        lastName: 'Anderson',
        role: 'Head of Product',
        status: 'Active',
      },
      { approverId: uuidv4(), firstName: 'Ivy', lastName: 'Thomas', role: 'CTO', status: 'Active' },
      {
        approverId: uuidv4(),
        firstName: 'Jack',
        lastName: 'Jackson',
        role: 'CIO',
        status: 'Inactive',
      },
      {
        approverId: uuidv4(),
        firstName: 'Kathy',
        lastName: 'White',
        role: 'Manager',
        status: 'Active',
      },
      {
        approverId: uuidv4(),
        firstName: 'Leo',
        lastName: 'Harris',
        role: 'Director',
        status: 'Inactive',
      },
      { approverId: uuidv4(), firstName: 'Mia', lastName: 'Martin', role: 'VP', status: 'Active' },
    ]);

    console.log('🗺️ Seeding Strategy...');
    const portfolio = await dataSource.getRepository(Portfolio).save({
      portfolioId: uuidv4(),
      name: 'Digital Transformation 2025',
      creationDate: new Date(),
      sponsor: sponsorUser, // Link to Sponsor
      status: 'ACTIVE', // Populate status string
    });

    const initiative = await dataSource.getRepository(Initiative).save({
      initiativeId: uuidv4(),
      title: 'Cloud Migration',
      strategicGoal: 'Reduce infrastructure costs by 30%',
      estimatedCost: 500000,
      estimatedROI: 1200000,
      dateProposed: new Date(),
      portfolio,
      status: statuses[2], // In Progress (Relation)
      status_text: 'ACTIVE', // Populate status_text string
    });

    const epic = await dataSource.getRepository(Epic).save({
      epicId: uuidv4(),
      name: 'Auth System Migration',
      goal: 'Migrate on-prem LDAP to Cloud Identity',
      businessCaseLink: 'http://sharepoint/business-case-123',
      actualCost: 150000,
      initiative,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: statuses[2],
      status_text: 'ACTIVE', // Populate status_text string
    });

    console.log('🔨 Seeding Execution Items (Requirements)...');
    const reqRepo = dataSource.getRepository(Requirement);

    const createdReq = await reqRepo.save({
      requirementId: uuidv4(),
      title: 'SSO Integration',
      storyStatement: 'As an employee, I want to log in with my corp creds...',
      acceptanceCriteria: 'Given valid creds, When I login, Then I access the portal.',
      priority: priorities[0],
      status: statuses[2], // In Progress
      type: types[0], // User Story
      complexity: complexities[0],
      source: sources[0],
      effortType: effortTypes[0],
      effortEstimate: 13,
      actualEffort: 5,
      businessValue: 80.0, // High Value
      productOwner: productOwners[0],
      approver: approvers[0],
      verificationMethod: vMethods[2], // Test
      epic,
      version: '1.0',
      requirementStatusDate: new Date(),
      isMandatory: true,
      creationDate: new Date(),
    });

    // Add References
    const refRepo = dataSource.getRepository(RequirementReference);
    await refRepo.save([
      {
        type: 'Link',
        path: 'https://confluence.corp.com/pages/viewpage.action?pageId=123456',
        referenceName: 'Architecture Diagram',
        description: 'High level auth flow',
        status: 'Active',
        requirement: createdReq,
      },
      {
        type: 'Document',
        path: '//sharepoint/docs/auth-specs.pdf',
        referenceName: 'Security Specs',
        description: 'Detailed security requirements',
        status: 'Active',
        requirement: createdReq,
      },
    ]);

    // Creating more requirements for the same Epic
    await reqRepo.save({
      requirementId: uuidv4(),
      title: 'Logout Functionality',
      storyStatement: 'As a user, I want to securely logout...',
      priority: priorities[1],
      status: statuses[0], // Draft
      type: types[0],
      epic,
      productOwner: productOwners[0],
      creationDate: new Date(),
      effortEstimate: 20, // High Effort
      businessValue: 90.0, // High Value -> Strategic Bet
    });

    // Another Initiative and Epic (Customer 360)
    const initiative2 = await dataSource.getRepository(Initiative).save({
      initiativeId: uuidv4(),
      title: 'Customer 360',
      strategicGoal: 'Unify customer data',
      estimatedCost: 800000,
      estimatedROI: 2000000,
      dateProposed: new Date(),
      portfolio,
      status: statuses[2],
      status_text: 'ACTIVE',
    });

    const epic2 = await dataSource.getRepository(Epic).save({
      epicId: uuidv4(),
      name: 'Unified Profile API',
      goal: 'Single view of customer',
      initiative: initiative2,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      status: statuses[2],
      status_text: 'ACTIVE',
    });

    await reqRepo.save({
      requirementId: uuidv4(),
      title: 'Get Customer Profile API',
      storyStatement: 'API Endpoint to retrieve full customer details',
      priority: priorities[0],
      status: statuses[2],
      type: types[1], // Non-Functional
      epic: epic2,
      productOwner: productOwners[1],
      creationDate: new Date(),
      effortEstimate: 5, // Low Effort
      businessValue: 95.0, // High Value -> Quick Win
    });

    // Time Sink Example
    await reqRepo.save({
      requirementId: uuidv4(),
      title: 'Legacy Data Cleanup',
      storyStatement: 'Cleanup old logs',
      priority: priorities[3],
      status: statuses[1],
      type: types[2], // Tech Debt
      epic: epic2,
      productOwner: productOwners[1],
      creationDate: new Date(),
      effortEstimate: 25, // High Effort
      businessValue: 10.0, // Low Value -> Time Sink
    });

    // Filler Example
    await reqRepo.save({
      requirementId: uuidv4(),
      title: 'Update Footer Text',
      storyStatement: 'Change copyright year',
      priority: priorities[3],
      status: statuses[3], // Done
      type: types[0],
      epic: epic2,
      productOwner: productOwners[1],
      creationDate: new Date(),
      effortEstimate: 1, // Low Effort
      businessValue: 5.0, // Low Value -> Filler
    });

    // Seeding Widgets
    console.log('📊 Seeding Widgets...');
    const widgetRepo = dataSource.getRepository(Widget);
    await widgetRepo.save([
      {
        widgetId: uuidv4(),
        title: 'Overview Stats',
        type: WidgetType.STATS_OVERVIEW,
        isVisible: true,
        defaultOrder: 0,
        config: {},
      },
      {
        widgetId: uuidv4(),
        title: 'Requirements Status',
        type: WidgetType.REQUIREMENTS_CHART,
        isVisible: true,
        defaultOrder: 1,
        config: { chartType: 'doughnut' },
      },
      {
        widgetId: uuidv4(),
        title: 'Recent Activity',
        type: WidgetType.RECENT_ACTIVITY,
        isVisible: true,
        defaultOrder: 2,
        config: { limit: 5 },
      },
      {
        widgetId: uuidv4(),
        title: 'Priority Breakdown',
        type: WidgetType.PRIORITY_CHART,
        isVisible: true,
        defaultOrder: 3,
        config: { chartType: 'bar' },
      },
      {
        widgetId: uuidv4(),
        title: 'Value vs Effort',
        type: WidgetType.VALUE_EFFORT_MATRIX,
        isVisible: true,
        defaultOrder: 4,
        config: {},
      },
      {
        widgetId: uuidv4(),
        title: 'Portfolio Health',
        type: WidgetType.PORTFOLIO_HEALTH,
        isVisible: true,
        defaultOrder: 5,
        config: {},
      },
    ]);

    console.log('✅ Database Seeded Successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
