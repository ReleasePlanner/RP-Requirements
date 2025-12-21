# Requirements Table Field Documentation

This document describes the data model for the `Requirement` table, detailing each field's purpose and providing example data.

| Field Name | Data Type | Description | Example Data |
| :--- | :--- | :--- | :--- |
| **RequirementID** | UUID (PK) | Unique identifier for the requirement. | `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11` |
| **Title** | VARCHAR(255) | Short, descriptive title of the requirement. | "Add One-Click Checkout" |
| **StoryStatement** | TEXT | The user story description (e.g., As a [role], I want [feature], so that [benefit]). | "As a shopper, I want to checkout with a single click so that I can buy products faster." |
| **AcceptanceCriteria** | TEXT | Conditions that must be met for the requirement to be considered complete. | "Given I am logged in, when I click 'Buy Now', then the order is placed immediately." |
| **EstimatedIncrementalSales** | INT | Projected increase in sales volume attributable to this requirement. | `5000` (units) |
| **ExperienceImpactScore** | INT | Score representing the impact on user experience (e.g., 1-10 scale). | `8` |
| **CompetitiveBenchmarkScore**| INT | Score indicating how this feature compares to competitors (e.g., 1-10). | `9` |
| **ValueEffortRatio** | DECIMAL | Calculated ratio of Business Value to Effort, used for prioritization. | `1.5` |
| **CampaignUrgencyScore** | INT | Score reflecting the urgency related to marketing campaigns. | `10` (High urgency) |
| **NeedsFunctionalDiscovery** | BOOLEAN | Flag indicating if further functional breakdown or research is needed. | `true` |
| **NeedsExperimentation** | BOOLEAN | Flag indicating if the feature requires A/B testing or PoC. | `false` |
| **ExternalReferenceLink** | VARCHAR(500)| Link to external tracking systems (e.g., Jira, Azure DevOps). | `https://jira.company.com/browse/PROJ-123` |
| **TeamDependencies** | TEXT | List or description of other teams required to deliver this feature. | "Payments Team, Logistics Team" |
| **ApplicablePhase** | VARCHAR(100)| The project phase or milestone this requirement belongs to. | "Phase 1 - MVP" |
| **EffortEstimate** | INT | Estimated effort in FIB points or hours. | `13` (Fibonacci) |
| **ActualEffort** | INT | Actual effort expended on the requirement. | `15` |
| **BusinessValue** | DECIMAL | Total business value score assigned to the requirement. | `95.5` |
| **RequirementVersion** | VARCHAR(50) | Version string for tracking requirement changes. | "v1.2" |
| **IsMandatory** | BOOLEAN | Flag indicating if this requirement is non-negotiable/regulatory. | `true` |
| **GoLiveDate** | DATE | Typescript Date object representing the expected release date. | `2025-12-25` |
| **PriorityID** | INT (FK) | Reference to the Priority catalog (e.g., High, Medium, Low). | `1` (High) |
| **StatusID** | INT (FK) | Reference to the LifecycleStatus catalog (e.g., Draft, In Progress).| `2` (Approved) |
| **TypeID** | INT (FK) | Reference to the RequirementType catalog (e.g., Functional, Non-Functional).| `1` (Functional) |
| **ComplexityID** | INT (FK) | Reference to the Complexity catalog. | `3` (High) |
| **SourceID** | INT (FK) | Reference to the source of the requirement (e.g., Customer, Regulatory). | `1` (Client Request) |
| **EffortTypeID** | INT (FK) | Reference to the type of effort estimation used. | `1` (Fibonacci) |
| **ProductOwnerID** | UUID (FK) | ID of the User who owns this requirement (Product Owner). | `user-uuid-123` |
| **ApproverUserID** | UUID (FK) | ID of the User who approved this requirement. | `user-uuid-456` |
| **EpicID** | UUID (FK) | ID of the parent Epic this requirement belongs to. | `epic-uuid-789` |
| **RiskLevelID** | INT (FK) | Reference to the RiskLevel catalog. | `2` (Medium) |
| **MetricID** | INT (FK) | Reference to the Metric catalog associated with success capability. | `1` (NPS) |
| **VerificationMethodID** | INT (FK) | Reference to the VerificationMethod catalog. | `1` (Automated Test) |
