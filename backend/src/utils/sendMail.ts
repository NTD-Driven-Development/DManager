import { createTransport, Transporter } from "nodemailer"

const sendEmail = async (
    toMail: string,
    subject: string,
    content: string
): Promise<void> => {
    try {
        const transporter: Transporter = createTransport({
            host: process.env.MAILER_HOST,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
            },
            secure: true,
            tls: {
                rejectUnauthorized: false,
            },
        })

        const mailOptions = {
            from: process.env.MAILER_USER,
            to: toMail,
            subject: subject,
            text: content,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully!", info.messageId)
    } catch (error) {
        // await 2 seconds before retry
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.error("Error occurred while sending email:", error)
    }
}

export default { sendEmail }
