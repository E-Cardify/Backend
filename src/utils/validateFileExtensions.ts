import { imageExtensions } from "../constants/fileExtensions";

function validateImageFileExtension(file: Express.Multer.File): boolean {
  const isValid = imageExtensions.includes(file.mimetype.split("/")[1]);

  return isValid;
}

export default validateImageFileExtension;
