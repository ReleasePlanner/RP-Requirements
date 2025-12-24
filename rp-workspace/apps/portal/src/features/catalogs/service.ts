import { VerificationMethod, RequirementType, Priority, RiskLevel, Complexity, LifecycleStatus, Metric, ProductOwner, Approver } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const CatalogsService = {

    getVerificationMethods: async (): Promise<VerificationMethod[]> => {
        const response = await fetch(`${API_URL}/catalogs/verification-methods`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createVerificationMethod: async (data: { name: string }): Promise<VerificationMethod> => {
        const response = await fetch(`${API_URL}/catalogs/verification-methods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create verification method');
        return response.json();
    },
    updateVerificationMethod: async (id: number, data: { name: string }): Promise<VerificationMethod> => {
        const response = await fetch(`${API_URL}/catalogs/verification-methods/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update verification method');
        return response.json();
    },
    deleteVerificationMethod: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/verification-methods/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete verification method');
    },

    getPriorities: async (): Promise<Priority[]> => {
        const response = await fetch(`${API_URL}/catalogs/priorities`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createPriority: async (data: { name: string }): Promise<Priority> => {
        const response = await fetch(`${API_URL}/catalogs/priorities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create priority');
        return response.json();
    },
    updatePriority: async (id: number, data: { name: string }): Promise<Priority> => {
        const response = await fetch(`${API_URL}/catalogs/priorities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update priority');
        return response.json();
    },
    deletePriority: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/priorities/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete priority');
    },

    getRiskLevels: async (): Promise<RiskLevel[]> => {
        const response = await fetch(`${API_URL}/catalogs/risk-levels`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createRiskLevel: async (data: { name: string }): Promise<RiskLevel> => {
        const response = await fetch(`${API_URL}/catalogs/risk-levels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create risk level');
        return response.json();
    },
    updateRiskLevel: async (id: number, data: { name: string }): Promise<RiskLevel> => {
        const response = await fetch(`${API_URL}/catalogs/risk-levels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update risk level');
        return response.json();
    },
    deleteRiskLevel: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/risk-levels/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete risk level');
    },

    getComplexities: async (): Promise<Complexity[]> => {
        const response = await fetch(`${API_URL}/catalogs/complexities`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createComplexity: async (data: { name: string }): Promise<Complexity> => {
        const response = await fetch(`${API_URL}/catalogs/complexities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create complexity');
        return response.json();
    },
    updateComplexity: async (id: number, data: { name: string }): Promise<Complexity> => {
        const response = await fetch(`${API_URL}/catalogs/complexities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update complexity');
        return response.json();
    },
    deleteComplexity: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/complexities/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete complexity');
    },

    getStatuses: async (): Promise<LifecycleStatus[]> => {
        const response = await fetch(`${API_URL}/catalogs/statuses`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createStatus: async (data: { name: string }): Promise<LifecycleStatus> => {
        const response = await fetch(`${API_URL}/catalogs/statuses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create status');
        return response.json();
    },
    updateStatus: async (id: number, data: { name: string }): Promise<LifecycleStatus> => {
        const response = await fetch(`${API_URL}/catalogs/statuses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },
    deleteStatus: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/statuses/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete status');
    },

    getMetrics: async (): Promise<Metric[]> => {
        const response = await fetch(`${API_URL}/catalogs/metrics`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createMetric: async (data: { name: string, baselineValue?: string, targetGoal?: string }): Promise<Metric> => {
        const response = await fetch(`${API_URL}/catalogs/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create metric');
        return response.json();
    },
    updateMetric: async (id: number, data: { name: string, baselineValue?: string, targetGoal?: string }): Promise<Metric> => {
        const response = await fetch(`${API_URL}/catalogs/metrics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update metric');
        return response.json();
    },
    deleteMetric: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/metrics/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete metric');
    },

    getTypes: async (): Promise<RequirementType[]> => {
        const response = await fetch(`${API_URL}/catalogs/types`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createType: async (data: { name: string }): Promise<RequirementType> => {
        const response = await fetch(`${API_URL}/catalogs/types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create type');
        return response.json();
    },
    updateType: async (id: number, data: { name: string }): Promise<RequirementType> => {
        const response = await fetch(`${API_URL}/catalogs/types/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update type');
        return response.json();
    },
    deleteType: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/types/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete type');
    },

    getProductOwners: async (): Promise<ProductOwner[]> => {
        const response = await fetch(`${API_URL}/catalogs/product-owners`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createProductOwner: async (data: { firstName: string, lastName: string, role: string, status?: string }): Promise<ProductOwner> => {
        const response = await fetch(`${API_URL}/catalogs/product-owners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create product owner');
        return response.json();
    },
    updateProductOwner: async (id: string, data: { firstName: string, lastName: string, role: string, status?: string }): Promise<ProductOwner> => {
        const response = await fetch(`${API_URL}/catalogs/product-owners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update product owner');
        return response.json();
    },
    deleteProductOwner: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/product-owners/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete product owner');
    },

    getApprovers: async (): Promise<Approver[]> => {
        const response = await fetch(`${API_URL}/catalogs/approvers`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },
    createApprover: async (data: { firstName: string, lastName: string, role: string, status?: string }): Promise<Approver> => {
        const response = await fetch(`${API_URL}/catalogs/approvers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create approver');
        return response.json();
    },
    updateApprover: async (id: string, data: { firstName: string, lastName: string, role: string, status?: string }): Promise<Approver> => {
        const response = await fetch(`${API_URL}/catalogs/approvers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update approver');
        return response.json();
    },
    deleteApprover: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/catalogs/approvers/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete approver');
    },

    getEffortTypes: async (): Promise<any[]> => {
        const response = await fetch(`${API_URL}/catalogs/effort-estimate-types`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },

    getSources: async (): Promise<any[]> => {
        const response = await fetch(`${API_URL}/catalogs/sources`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    }
};
