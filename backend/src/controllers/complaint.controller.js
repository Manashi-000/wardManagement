import { complaintsFromUserSchema, adminRespondSchema } from "../utils/validation/complaint.validation.js"
import { prisma } from "../utils/validation/prismaClient.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

export const createComplaints = async (req, res) => {
  try {
    console.log("📩 Complaint API hit!");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    // Parse body using Zod but cast strings to correct types
    const parsedData = complaintsFromUserSchema.safeParse({
      ...req.body,
      images: req.files?.map((file) => file.path) || []
    });

    if (!parsedData.success) {
      console.log("Validation failed", parsedData.error.format());
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.format()
      });
    }

    const userId = req.user?.id || parsedData.data.userId || null;
    const uploadedImagesUrl = []
    await Promise.all([
      parsedData.data.images.map(async (filename) => {
        const uploadResult = await uploadOnCloudinary(filename, "/wardmanagement/complaints")
        console.log("upload result", uploadResult)
        uploadedImagesUrl.push(uploadResult.url)
      })
    ])

    const createdComplaint = await prisma.complaint.create({
      data: {
        subject: parsedData.data.subject,
        description: parsedData.data.description,
        images: uploadedImagesUrl, 
        taggedLocation: parsedData.data.taggedLocation,
        category: parsedData.data.category,
        status: parsedData.data.status || "PENDING",
        userId: userId
      }
    });

    return res.status(200).json({
      message: "Complaint Accepted",
      complaint: createdComplaint
    });
  } catch (error) {
    console.error("❌ Prisma error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      code: error.code || null,
      meta: error.meta || null
    });
  }
};


export const updateComplaints = async (req, res) => {
  const { complaintID } = req.params;
  if (!complaintID) {
    res.status(400).json({ message: "Complaint id not found." })
    return
  }
  try {
    const complaintExist = await prisma.complaint.findFirst({
      where: {
        id: complaintID
      }
    });
    if (!complaintExist) {
      res.status(400).json({ message: "Complaint doesnot exist" })
      return
    }
    await prisma.complaint.update({
      where: {
        id: complaintID
      },
      data: { ...req.body }
    });
    res.status(200).json({ message: "Complaints updated" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error })
  }
}

export const deleteComplaints = async (req, res) => {
  const { complaintID } = req.params;
  if (!complaintID) {
    res.status(400).json({ message: "Complaint ID not found." })
    return
  }
  try {
    const complaintExist = await prisma.complaint.findUnique({
      where: {
        id: complaintID
      }
    });
    if (!complaintExist) {
      res.status(400).json({ message: "Complaint not found" })
      return
    }
    await prisma.complaint.delete({
      where: {
        id: complaintID
      }
    });
    res.status(200).json({ message: "Complaint Deleted." })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

export const getComplaint = async (req, res) => {
  const { complaintID } = req.params;
  if (!complaintID) {
    res.status(400).json({ message: "complaint ID not found" })
    return
  }
  try {
    const complaintExist = await prisma.complaint.findUnique({
      where: {
        id: complaintID
      }
    });
    if (!complaintExist) {
      res.status(400).json({ message: "Complaint doesnot exist" })
      return
    }
    res.status(200).json({ message: "Complaint found", data: complaintExist })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}
//for many complaints
export const getComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { User: true } // optional: include user details
    });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }

    res.status(200).json({
      message: "Complaints fetched successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const adminRespondToComplaint = async (req, res) => {
  const { complaintID } = req.params;
  if (!complaintID) {
    return res.status(400).json({ message: "Complaint ID not found" });
  }

  const parsedData = adminRespondSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsedData.error });
  }

  try {
    const complaintExist = await prisma.complaint.findUnique({ where: { id: complaintID } });
    if (!complaintExist) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintID },
      data: {
        response: parsedData.data.response ?? complaintExist.response,
        status: parsedData.data.status ?? complaintExist.status,
      },
    });

    res.status(200).json({ message: "Complaint updated successfully by admin", complaint: updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getActiveComplaintCount = async (req, res) => {
  try {
    const count = await prisma.complaint.count({
      where: {
        status: {
          not: "RESOLVED",
        },
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching complaint count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
