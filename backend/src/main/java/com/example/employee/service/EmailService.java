package com.example.employee.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendSelectionEmail(
            String to,
            String employeeName,
            String position
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Selection Confirmation - " + position);
        message.setText(
                "Dear " + employeeName + ",\n\n" +
                        "We are pleased to inform you that you have been selected " +
                        "for the position of " + position + ".\n\n" +
                        "Our HR team will share further details shortly.\n\n" +
                        "Regards,\nHR Team"
        );

        mailSender.send(message);
    }

    public void sendOfferLetterEmail(
            String to,
            String employeeName,
            MultipartFile offerLetter
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Offer Letter");
            helper.setText(
                    "Dear " + employeeName + ",\n\n" +
                            "Congratulations! Please find your offer letter attached.\n\n" +
                            "Regards,\nHR Team"
            );

            if (offerLetter != null && !offerLetter.isEmpty()) {
                helper.addAttachment(
                        offerLetter.getOriginalFilename(),
                        new ByteArrayResource(offerLetter.getBytes())
                );
            }

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send offer letter email", e);
        }
    }
}
