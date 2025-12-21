'use server';

import { RequirementsService } from './service';
import { UpdateRequirementDto } from './types';
import { revalidatePath } from 'next/cache';

export async function updateRequirementAction(id: string, data: UpdateRequirementDto) {
    const result = await RequirementsService.update(id, data);
    if (result) {
        revalidatePath('/portal/requirements');
        return { success: true, data: result };
    }
    return { success: false, error: 'Failed to update' };
}
