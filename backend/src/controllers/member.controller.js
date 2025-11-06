import { prisma } from "../utils/validation/prismaClient.js";
import { createMemberSchema } from "../utils/validation/member.validation.js";


export const createMember = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const imagePath = req.file ? req.file.filename : null;

    // Combine text data and file data
    const parsedData = createMemberSchema.parse({
      ...req.body,
      image: imagePath,
    });

    const member = await prisma.member.create({
      data: {
        name: parsedData.name,
        position: parsedData.position,
        contactNumber: parsedData.contactNumber,
        classification: parsedData.classification,
        image: parsedData.image ?? null,
      },
    });

    res.status(201).json({ message: "Member created successfully", member });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ message: "Members retrieved successfully", members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get single member
export const getMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id: parseInt(id) },
    });

    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json({ message: "Member retrieved successfully", member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update member (with optional file update)
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const imagePath = req.file ? req.file.filename : undefined;

    const updateSchema = createMemberSchema.partial();
    const parsedData = updateSchema.parse({
      ...req.body,
      ...(imagePath && { image: imagePath }),
    });

    const member = await prisma.member.update({
      where: { id: parseInt(id) },
      data: parsedData,
    });

    res.status(200).json({ message: "Member updated successfully", member });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.member.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
