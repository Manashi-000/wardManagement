import { createEmergencySchema } from "../utils/validation/emergency.validation.js";
import { prisma } from "../utils/validation/prismaClient.js"

export const createEmergency = async (req, res) => {
    const parsedData = createEmergencySchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation Failed" })
        return
    }
    try {
        const emergencyExist = await prisma.emergency.findFirst({
            where: {
                public_service: parsedData.data.public_service
            }
        });
        if (emergencyExist) {
            res.status(400).json({ message: "Contact exist" })
            return
        }
        const createdEmergency = await prisma.emergency.create({
            data: { ...parsedData.data }
        });
        if (!createdEmergency) {
            res.status(400).json({ message: "Failed to create" })
            return
        }
        res.status(200).json({ message: "Emergency Contact Created." })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteEmergency = async (req, res) => {
    const { emergencyID } = req.params
    if (!emergencyID) {
        res.status(400).json({ message: "Emergency ID not found." })
        return
    }
    try {
        const emergencyExist = await prisma.emergency.findUnique({
            where: {
                id: emergencyID
            }
        });
        if (!emergencyID) {
            res.status(400).json({ message: "Emergency contact not found." })
            return
        }
        await prisma.emergency.delete({
            where: {
                id: emergencyID
            }
        });
        res.status(200).json({ message: "Emergency Deleted" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

export const getEmergency = async (req, res) => {
    const { emergencyID } = req.params;

    if (!emergencyID) {
        return res.status(400).json({ message: "Emergency ID is required" });
    }

    try {
        const emergencyExist = await prisma.emergency.findUnique({
            where: {
                id: emergencyID,
            },
        });

        if (!emergencyExist) {
            return res.status(404).json({ message: "Emergency contact not found" });
        }

        return res.status(200).json({
            message: "Emergency contact found",
            data: emergencyExist,
        });
    } catch (error) {
        console.error("GetEmergency Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getEmergencies = async (req, res) => {
    console.log("get here in emergiecies")
    try {
        const emergencies = await prisma.emergency.findMany();
        if (!emergencies || emergencies.length === 0) {
            return res.status(404).json({ message: "No emergency contacts found" });
        }
        return res.status(200).json({
            message: "Emergency contacts fetched successfully",
            data: emergencies,
        });
    } catch (error) {
        console.error("getEmergencies Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const updateEmergency = async (req, res) => {
    const { emergencyID } = req.params;
    if (!emergencyID) {
        res.status(400).json({ message: "Emergency ID not found" })
        return
    }
    try {
        const emergencyExist = await prisma.emergency.findUnique({
            where: {
                id: emergencyID
            }
        });
        if (!emergencyExist) {
            res.status(400).json({ message: "Emergency contact not found." })
            return
        }
        await prisma.emergency.update({
            where: {
                id: emergencyID
            },
            data: { ...req.body }
        });
        res.status(200).json({ message: "Emergency contact updated." })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}