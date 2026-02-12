        const express = require("express");
        const nodemailer = require("nodemailer");
        const cors = require("cors");
        require("dotenv").config();

        const app = express();
        app.use(cors());
        app.use(express.json());

        const PORT = process.env.PORT || 5000;

        /* ROOT CHECK */
        app.get("/", (req, res) => {
          res.send("✅ CW365 Email Server is Running");
        });

        /* SEND EMAIL */
        app.post("/send-email", async (req, res) => {
          try {
            const subject = req.body.subject;
            const text = req.body.text;
            const html = req.body.html;

            if (!subject) {
              return res.status(400).json({ error: "Subject is required" });
            }

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

            const mailOptions = {
  from: 'CW365 Support <${process.env.EMAIL_USER}>',
  to: process.env.RECEIVER_EMAIL,
  subject: subject || "CW365 Notification",
  text: text || "This is a system generated email.",
  html: html || 
    <div style="font-family:Segoe UI;padding:20px;background:#f5f7fb">
      <div style="max-width:500px;margin:auto;background:#ffffff;padding:20px;border-radius:12px">
        <h2 style="color:#4d6ef5">CW365 Notification</h2>
        <p>This is a system generated email from CW365.</p>
        <p style="margin-top:20px;font-size:12px;color:#777">
          Do not reply to this email.
        </p>
      </div>
    </div>
  '
};
            await transporter.sendMail(mailOptions);

            res.status(200).json({
              success: true,
              message: "✅ Email sent successfully",
            });

          } catch (error) {
            console.error("❌ Email error:", error);
            res.status(500).json({
              success: false,
              error: "Failed to send email",
            });
          }
        });

        /* START SERVER */
        app.listen(PORT, "0.0.0.0", () => {
          console.log('🚀 Server is running on port ${PORT}');
        });
