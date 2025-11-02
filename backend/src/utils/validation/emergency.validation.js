import * as z from "zod";
export const createEmergencySchema=z.object({
  public_service: z.string(),
  contact:z.string(),
  description : z.string(),  
  icon:z.string(),            
});
