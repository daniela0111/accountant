import { Cloudinary } from "cloudinary-core"
import { cdConf } from "./cd.config";
export const odeslatCN = async (file) => {
    const cloudinaryCore = new Cloudinary({
        cloud_name: cdConf.cloud_name,
        secure: true,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nahraj"); // Replace with your upload preset

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name
            }/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();
        alert("File uploaded successfully!", data.secure_ur);
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file");
    } finally {
    }
};