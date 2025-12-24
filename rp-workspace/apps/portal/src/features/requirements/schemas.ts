import { z } from 'zod';

export const createRequirementSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  storyStatement: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  effortEstimate: z.number().int().positive().optional(),
  actualEffort: z.number().int().positive().optional(),
  businessValue: z.number().positive().optional(),
  goLiveDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'La fecha debe estar en formato YYYY-MM-DD',
  }),
  requirementStatusDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'La fecha debe estar en formato YYYY-MM-DD',
  }),
  requirementVersion: z.string().optional(),
  isMandatory: z.boolean().optional(),
  changeHistoryLink: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  ownerRole: z.string().optional(),
  applicablePhase: z.string().optional(),
  priorityId: z.number().int().positive().optional(),
  complexityId: z.number().int().positive().optional(),
  riskLevelId: z.number().int().positive().optional(),
  sourceId: z.number().int().positive().optional(),
  effortTypeId: z.number().int().positive().optional(),
  metricId: z.number().int().positive().optional(),
  verificationMethodId: z.number().int().positive().optional(),
  epicId: z.string().uuid('Debe ser un UUID válido').optional().or(z.literal('')),
  productOwnerId: z.string().uuid('Debe ser un UUID válido').optional().or(z.literal('')),
  approverUserId: z.string().uuid('Debe ser un UUID válido').optional().or(z.literal('')),
});

export const updateRequirementSchema = createRequirementSchema.partial();

export type CreateRequirementFormData = z.infer<typeof createRequirementSchema>;
export type UpdateRequirementFormData = z.infer<typeof updateRequirementSchema>;

