import express, { Request, Response } from "express";
import { google, Auth } from "googleapis";
import path from "path";

const app = express();
const port = 3001;

// Root route for health check
app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

const keyFilePath = path.join(__dirname, "cakee-project.json");

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Route to get Google Photos
app.get(
  "/get-google-photos",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const authClient = await auth.getClient();
      if (!authClient) {
        throw new Error("authClient not found");
      }

      const drive = google.drive({
        version: "v3",
        auth: authClient as Auth.OAuth2Client,
      });
      const folderId = "169MMv2eXBj_Qzmdl8LHPPxXn9-pnmsEF";

      const driveRes = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "files(id, name, webViewLink, webContentLink, mimeType)",
        key: "YOUR_API_KEY",
      });

      const files = driveRes.data.files || [];

      return res.json({
        message: "Photos fetched successfully!",
        data: files,
      });
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Error fetching photos", error });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
