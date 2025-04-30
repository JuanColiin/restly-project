package com.restly.restly_backend.reserves.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendReservationEmail(String toEmail, String userName, String productName, String checkIn, String checkOut, boolean isExtension) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(isExtension ? "Reserva extendida - Restly" : "Confirmación de Reserva - Restly");

            String htmlContent = buildHtmlEmail(userName, productName, checkIn, checkOut, isExtension);
            helper.setText(htmlContent, true);

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de reserva", e);
        }
    }

    private String buildHtmlEmail(String userName, String productName, String checkIn, String checkOut, boolean isExtension) {
        String title = isExtension ? "¡Tu reserva ha sido extendida!" : "¡Gracias por tu reserva!";
        String subtitle = isExtension ? "Aquí tienes los nuevos detalles de tu estadía." : "Aquí tienes los detalles de tu reserva.";

        return """
            <div style="font-family: 'Arial', sans-serif; color: #2b2c28; background-color: #f9f9f9; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px;">
                    <h2 style="color: #00c98c;">%s</h2>
                    <p style="font-size: 16px;">%s</p>
                    <table style="width: 100%%; margin-top: 20px;">
                        <tr>
                            <td style="font-weight: bold;">Producto:</td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Check-in:</td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Check-out:</td>
                            <td>%s</td>
                        </tr>
                    </table>
                    <div style="margin-top: 30px;">
                        <p style="font-size: 15px;">Puedes gestionar tu reserva directamente desde nuestra plataforma.</p>
                        <a href="http://localhost:5173/MyReserves" 
                           style="display: inline-block; padding: 12px 20px; background-color: #00c98c; color: white; text-decoration: none; border-radius: 5px;">
                            Ver mi reserva
                        </a>
                    </div>
                    <p style="margin-top: 40px; font-size: 14px; color: #888;">¡Gracias por preferirnos, %s!<br>Equipo de Restly</p>
                </div>
            </div>
        """.formatted(title, subtitle, productName, checkIn, checkOut, userName);
    }
}
