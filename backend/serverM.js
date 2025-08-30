import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';

const upload = multer(); // ميموري ستوراج

const app = express();
app.use(cors());

app.post('/send-message', upload.single('file'), async (req, res) => {
  const { email, message } = req.body;
  const file = req.file;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tvelqjiri@gmail.com',
        pass: 'gqpg ptjl fdch bggv',
      },
    });

    let textMessage = message || "Pas de message texte.";
    textMessage += `\n\n---\nEmail client: ${email}`;

    const mailOptions = {
      from: email,
      to: 'tvelqjiri@gmail.com',
      subject: `Nouveau service sélectionné par ${email}`,
      text: textMessage,
    };

    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        }
      ];
    }

    await transporter.sendMail(mailOptions);
    res.status(200).send('Message envoyé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
