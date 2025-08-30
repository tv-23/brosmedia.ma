import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route لاستقبال بيانات الفورم
app.post('/send-email', async (req, res) => {
    const { name, emailM, phone, plan, extras } = req.body;

    if (!name || !emailM || !phone) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tvelqjiri@gmail.com',
                pass: 'gqpg ptjl fdch bggv',
            }
        });

        const mailOptions = {
            from: emailM,
            to: 'tvelqjiri@gmail.com',
            subject: `Nouvelle inscription - ${plan}`,
            html: `
                <h3>Détails du formulaire Step 2</h3>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${emailM}</p>
                <p><strong>Numéro:</strong> ${phone}</p>
                <p><strong>Plan choisi:</strong> ${plan}</p>
                <p><strong>Options/Extras:</strong> ${extras}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
});


// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
