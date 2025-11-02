import * as z from "zod";

export const createOrganizationSchema = z.object({
    name: z.string(),
    description: z.string(),
    establishedAt: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    image: z.string()
});

//for event validation
export const createEventSchema = z.object({
    organizationId: z.string(),
    name: z.string(),
    eventDescription: z.string(),
    createdAt: z.string()
});

//for budget
export const createBudgetSchema = z.object({
    organizationId: z.string(),
    name: z.string(),
    amount: z.number()
});

//for policy
export const createPolicySchema = z.object({
    policyName: z.string(),
    policyDescription:z.string(),
    createdAt:z.string(),
    organizationId: z.string()
});


