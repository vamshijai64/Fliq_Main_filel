// import AWS from "aws-sdk";

// // AWS S3 Configuration
// const S3_BUCKET = "cinemaquiz"; // Replace with your S3 Bucket name
// const REGION = "ap-south-1"; // Example: "ap-south-1"
// const ACCESS_KEY = "AKIAT7JJVAZS5TINAYMP";
// const SECRET_ACCESS_KEY = "yrrk9bLoLPmR5DkyLJ2LocjOLFL27muv8vrofpbb";

// AWS.config.update({
//   accessKeyId: ACCESS_KEY,
//   secretAccessKey: SECRET_ACCESS_KEY,
// });

// const s3 = new AWS.S3({
//   region: REGION,
//   params: { Bucket: S3_BUCKET },
// });

// // Function to upload file to S3
// export const uploadToS3 = async (file) => {
//   const fileName = `uploads/${Date.now()}_${file.name}`; // Unique filename
//   const params = {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     Body: file,
//     //ACL: "public-read",
//     ContentType: file.type,
//   };

//   try {
//     const upload = await s3.upload(params).promise();
//     return upload.Location; // Returns the file URL
//   } catch (error) {
//     console.error("S3 Upload Error:", error);
//     throw new Error("Failed to upload image to S3");
//   }
// };


export const uploadToS3 = async (file) => {
  try {
    // Step 1: Request signed URL from backend
    const response = await fetch("http://localhost:3003/s3/generate-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.statusText}`);
    }

    const { signedUrl, finalUrl } = await response.json();

    // Step 2: Upload directly to S3 using the signed URL
    const s3UploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: file,
     
    });

    if (!s3UploadResponse.ok) {
      throw new Error("Failed to upload file to S3");
    }

    return finalUrl; // Public S3 URL
  } catch (error) {
    console.error("uploadToS3 error:", error);
    throw error;
  }
};