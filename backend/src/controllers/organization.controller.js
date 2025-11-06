import { createOrganizationSchema, createBudgetSchema, createEventSchema, createPolicySchema } from "../utils/validation/organization.validation.js"
import { prisma } from "../utils/validation/prismaClient.js"

export const getOrganization = async (req, res) => {
    const { organizationID } = req.params;
    console.log("this is org id", organizationID)
    if (!organizationID) {
        res.status(400).json({ message: "Organization ID required" })
        return
    }
    try {
        const organizationExist = await prisma.organization.findUnique({
            where: {
                id: organizationID
            }
        })
        if (!organizationExist) {
            res.status(400).json({ message: "Organization not found" })
            return
        }
        res.status(200).json({ message: "organization found", data: organizationExist })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
//for multiple organizations
export const getOrganizations = async (req, res) => {

    console.log("this is here comes organization")
    try {
        const organizationsExist = await prisma.organization.findMany();
        if (organizationsExist.length === 0) {
            res.status(400).json({ message: "Organization not found" })
        }
        res.status(200).json({ message: "organizations found", data: organizationsExist })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
};



export const createOrganiation = async (req, res) => {
    console.log(req.body, "this is message form frontend")
    const parsedData = createOrganizationSchema.safeParse(req.body)
    console.log("this is validated data", parsedData.data)
    if (!parsedData.success) {
        console.log("why validateion failed", parsedData.error.message)
        res.status(400).json({ message: "Validation failed" })
        return
    }

    try {
        const organizationExist = await prisma.organization.findUnique({
            where: {
                name: parsedData.data.name
            }
        });
        if (organizationExist) {
            res.status(400).json({ message: "Organization already exist" })
            return
        }
        const establishDate = new Date(parsedData.data.establishedAt).toISOString()
        const createdOrganization = await prisma.organization.create({
            data: { ...parsedData.data, establishedAt: establishDate }
        });
        if (!createdOrganization) {
            res.status(400).json({ message: "Failed to create" })
            return
        }
        res.status(200).json({ message: "Organization created", data: { id: createdOrganization.id } })
    } catch (error) {
        console.error("failed to create organization", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const deleteOrganization = async (req, res) => {
    const { organizationID } = req.params
    if (!organizationID) {
        res.status(400).json({ message: "Organization ID not found" });
        return
    }
    try {
        const organizationExist = await prisma.organization.findUnique({
            where: {
                id: organizationID
            }
        });
        if (!organizationExist) {
            res.status(400).json({ message: "Organization not found" })
            return
        }
        await prisma.budget.deleteMany({ where: { organizationId: organizationID } });
        await prisma.policy.deleteMany({ where: { organizationId: organizationID } });
        await prisma.event.deleteMany({ where: { organizationId: organizationID } });
        await prisma.organization.delete({
            where: {
                id: organizationID

            }
        });
        res.status(200).json({ message: "Organization Deleted" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

export const updateOrganization = async (req, res) => {
    const { organizationID } = req.params;

    if (!organizationID) {
        return res.status(400).json({ message: "Organization ID not found" });
    }

    // Validate the request body
    const parsedData = createOrganizationSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Validation failed:", parsedData.error.message);
        return res.status(400).json({ message: "Validation failed", error: parsedData.error });
    }

    try {
        const organizationExist = await prisma.organization.findUnique({
            where: { id: organizationID },
        });

        if (!organizationExist) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Convert date to ISO string
        const establishDate = new Date(parsedData.data.establishedAt).toISOString();

        const updatedOrganization = await prisma.organization.update({
            where: { id: organizationID },
            data: { ...parsedData.data, establishedAt: establishDate },
        });

        return res.status(200).json({
            message: "Organization updated successfully",
            data: updatedOrganization,
        });
    } catch (error) {
        console.error("Failed to update organization", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

// //For events
// export const createEventsForOrganization = async (req, res) => {
//     console.log(req.body)
//     const parsedData = createEventSchema.safeParse(req.body)//error
//     console.log(parsedData)
//     if (!parsedData.success) {
//         res.status(400).json({ message: "Validation Failed." })
//         return
//     }
//     try {
//         const eventExist = await prisma.event.findFirst({
//             where: {
//                 organizationId: parsedData.data.organizationId,
//                 name: parsedData.data.name

//             }
//         });
//         if (eventExist) {
//             res.status(400).json({ message: "Event Exist." })
//             return
//         }
//         const createEvent = await prisma.event.create({
//             data: {
//                 name: parsedData.data.name,
//                 eventDescription: parsedData.data.eventDescription,
//                 createdAt: parsedData.data.createdAt,
//                 organizationId: parsedData.data.organizationId
//             }
//         });
//         if (!createEvent) {
//             res.status(400).json({ message: "Failed to create event." })
//             return
//         }
//         console.log("hit")
//         res.status(200).json({ message: "Event created." })
//     } catch (error) {
//         console.log("this is error on event createion", error)
//         res.status(500).json({ message: "Internal server error", error })
//     }
// }

// For events
export const createEventsForOrganization = async (req, res) => {
    console.log(req.body);

    const parsedData = createEventSchema.safeParse(req.body);
    console.log(parsedData);

    if (!parsedData.success) {
        return res.status(400).json({ success: false, message: "Validation Failed." });
    }

    try {
        const eventExist = await prisma.event.findFirst({
            where: {
                organizationId: parsedData.data.organizationId,
                name: parsedData.data.name
            }
        });

        if (eventExist) {
            return res.status(400).json({ success: false, message: "Event already exists." });
        }

        const createEvent = await prisma.event.create({
            data: {
                name: parsedData.data.name,
                eventDescription: parsedData.data.eventDescription,
                createdAt: parsedData.data.createdAt, // now string
                organizationId: parsedData.data.organizationId
            }
        });

        if (!createEvent) {
            return res.status(400).json({ success: false, message: "Failed to create event." });
        }

        console.log("hit ✅");
        return res.status(201).json({
            success: true,
            message: "Event created.",
            data: createEvent   //send back full event object
        });

    } catch (error) {
        console.log("❌ Error on event creation:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

export const deleteEventsFromOrganization = async (req, res) => {
    const { eventID } = req.params
    if (!eventID) {
        res.status(400).json({ message: "EventID not found." })
        return
    }
    try {
        const eventExist = await prisma.event.findUnique({
            where: {
                id: eventID
            }
        });
        if (!eventExist) {
            res.status(400).json({ message: "Event not found." })
            return
        }
        await prisma.event.delete({
            where: {
                id: eventID
            }
        });
        res.status(200).json({ message: "Event deleted" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const updateEventsFromOrganization = async (req, res) => {
    const { eventID } = req.params;
    if (!eventID) {
        res.status(400).json({ message: "Event ID not found." })
        return
    }
    try {
        const eventExist = await prisma.event.findUnique(
            {
                where: { id: eventID },
            }
        )
        if (!eventExist) {
            res.status(400).json({ message: "Event doesnot exist." })
            return
        }
        await prisma.event.update({
            where: { id: eventID },
            data: { ...req.body }
        });
        res.status(200).json({ message: "Event updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

export const getEventFromOrganization = async (req, res) => {
    const { eventID } = req.params;
    if (!eventID) {
        res.status(400).json({ message: "Event ID not found." })
        return
    }
    try {
        const eventExist = await prisma.event.findUnique({
            where: {
                id: eventID
            }
        })
        if (!eventExist) {
            res.status(400).json({ message: "Event not found" })
            return
        }
        res.status(200).json({ message: "event found" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
//for many events
export const getEventsFromOrganization = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                Organization: true, 
            },
        });

        if (events.length === 0) {
            return res.status(404).json({ success: false, message: "No events found", data: [] });
        }

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events,
        });
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};



//for policies
export const createPoliciesForOrganization = async (req, res) => {
    const parsedData = createPolicySchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Data not found" })
        return
    }
    try {
        const createdOrganization = await prisma.organization.findUnique({
            where: {
                id: parsedData.data.organizationId,
            }
        })
        if (!createdOrganization) {
            res.status(400).json({ message: "Oganization not found" })
            return
        }

        const policyExist = await prisma.policy.findFirst({
            where: {
                organizationId: parsedData.data.organizationId,
                policyName: parsedData.data.policyName
            }
        });
        if (policyExist) {
            res.status(400).json({ message: "Policy already exist." })
            return
        }
        const createPolicy = await prisma.policy.create({
            data: {
                organizationId: parsedData.data.organizationId,
                policyName: parsedData.data.policyName,
                policyDescription: parsedData.data.policyDescription,
                createAt: parsedData.data.createdAt
            }
        })
        if (!createPolicy) {
            res.status(400).json({ message: "Fails to create Policy." })
            return
        }
        res.status(200).json({ message: "New Policy create." })

    } catch (error) {
        console.log("this is error in create policy", error)
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const deletePoliciesFromOrganization = async (req, res) => {
    const { policyID } = req.params
    if (!policyID) {
        res.status(400).json({ message: "Policy ID not found." })
        return
    }
    try {
        const policyExist = await prisma.policy.findUnique({
            where: {
                id: policyID
            }
        });
        if (!policyExist) {
            res.status(400).json({ message: "Policy not found" })
            return
        }
        await prisma.policy.delete({
            where: {
                id: policyID
            }
        });
        res.status(200).json({ message: "Policy deleted" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const updatePoliciesFromOrganization = async (req, res) => {
    const { policyID } = req.params
    if (!policyID) {
        res.status(400).json({ message: "Policy ID not found" })
        return
    }
    try {
        const policyExist = await prisma.policy.findUnique({
            where: {
                id: policyID
            }
        });
        if (!policyExist) {
            res.status(400).json({ message: "Policy not found" })
            return
        }
        await prisma.policy.update({
            where: {
                id: policyID
            },
            data: { ...req.body }
        });
        res.status(200).json({ message: "Policy updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

export const getPolicyFromOrganization = async (req, res) => {
    const { policyID } = req.params
    if (!policyID) {
        res.status(400).json({ message: "policy ID not found." })
        return
    }
    try {
        const policyExist = await prisma.policy.findUnique({
            where: {
                id: policyID
            }
        })
        if (!policyExist) {
            res.status(400).json({ message: "Policy not found" })
            return
        }
        res.status(200).json({ message: "Policy found" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
//for many policies
export const getPoliciesFromOrganization = async (req, res) => {
    try {
        const policyExist = await prisma.policy.findMany()
        if (policyExist.length === 0) {
            res.status(400).json({ message: "Policy not found" })
            return
        }
        res.status(200).json({ message: "Policy found", policyExist })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

//budget
export const createBudgetForOrganization = async (req, res) => {
    const parsedData = createBudgetSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Failed to get data" })
        return
    }
    try {
        const createdOrganization = await prisma.organization.findUnique({
            where: {
                id: parsedData.data.organizationId,
            }
        })
        if (!createdOrganization) {
            res.status(400).json({ message: "Oganization not found" })
            return
        }

        const budgetExist = await prisma.budget.findFirst({
            where: {
                organizationId: createdOrganization.id,
                name: parsedData.data.name
            }
        });
        if (budgetExist) {
            res.status(400).json({ message: "Budget already exist." })
            return
        }
        const createBudget = await prisma.budget.create({
            data: {
                name: parsedData.data.name,
                organizationId: parsedData.data.organizationId,
                amount: parsedData.data.amount
            }
        });
        if (!createBudget) {
            res.status(400).json({ message: "Budget failed to create." })
            return
        }
        res.status(200).json({ message: "New budget added." })
    } catch (error) {
        console.log("this is eroor in cretre budget", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const deleteBudgetFromOrganization = async (req, res) => {
    const { budgetID } = req.params;
    if (!budgetID) {
        res.status(400).json({ message: "Budget ID not found." })
        return
    }
    try {
        const budgetExist = await prisma.budget.findUnique({
            where: {
                id: budgetID
            }
        });
        if (!budgetExist) {
            res.status(400).json({ message: "Budget not found" })
            return
        }
        await prisma.budget.delete({
            where: {
                id: budgetID
            }
        });
        res.status(200).json({ message: "budget deleted" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const updateBudgetFromOrganization = async (req, res) => {
    const { budgetID } = req.params;
    if (!budgetID) {
        res.status(400).json({ message: "Budget ID not found" })
        return
    }
    try {
        const budgetExist = await prisma.budget.findUnique({
            where: {
                id: budgetID
            }
        });
        if (!budgetExist) {
            res.status(400).json({ message: "Budget not found" })
            return
        }
        await prisma.budget.update({
            where: { id: budgetID },
            data: { ...req.body }
        });
        res.status(200).json({ message: "Budget updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

//for budget
export const getBudgetFromOrganization = async (req, res) => {
    console.log("REQ.PARAMS:", req.params);
    const { budgetID } = req.params
    if (!budgetID) {
        res.status(400).json({ message: "Budget ID not found." })
        return
    }
    try {
        const budgetExist = await prisma.budget.findUnique({
            where: {
                id: budgetID
            }
        })
        if (!budgetExist) {
            res.status(400).json({ message: "Budget not found" })
            return
        }
        res.status(200).json({ message: "Budget found" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
//for many budget
export const getBudgetsFromOrganization = async (req, res) => {
    try {
        const budgetExist = await prisma.budget.findMany()
        if (budgetExist.length === 0) {
            res.status(400).json({ message: "budget not found" })
            return
        }
        res.status(200).json({ message: "Budget found", budgetExist })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
