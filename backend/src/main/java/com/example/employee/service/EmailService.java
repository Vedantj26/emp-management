package com.example.employee.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final SendGrid sendGrid;

    @Value("${spring.sendgrid.from-email}")
    private String fromEmail;

    private static final String REPLY_TO = "no-reply@sendgrid.net";

    // 1️⃣ Selection Email (NO attachment)
    public void sendSelectionEmail(String to, String employeeName, String position) {

        Mail mail = buildMail(
                to,
                "[HR] Selection Confirmation - " + position,
                "Dear " + employeeName + ",\n\n" +
                        "We are pleased to inform you that you have been selected " +
                        "for the position of " + position + ".\n\n" +
                        "Regards,\nHR Team"
        );

        send(mail);
    }

    // 2️⃣ Offer Letter Email (WITH attachment)
    public void sendOfferLetterEmail(
            String to,
            String employeeName,
            ByteArrayResource offerLetter
    ) {

        Mail mail = buildMail(
                to,
                "[HR] Offer Letter",
                "Dear " + employeeName + ",\n\n" +
                        "Congratulations! Please find your offer letter attached.\n\n" +
                        "Regards,\nHR Team"
        );

        if (offerLetter != null) {
            Attachments attachment = new Attachments();
            attachment.setFilename("Offer_Letter.pdf");
            attachment.setType("application/pdf");
            attachment.setDisposition("attachment");
            attachment.setContent(
                    Base64.getEncoder().encodeToString(offerLetter.getByteArray())
            );
            mail.addAttachments(attachment);
        }

        send(mail);
    }

    private Mail buildMail(String to, String subject, String body) {

        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", body);

        Mail mail = new Mail(from, subject, toEmail, content);
        mail.setReplyTo(new Email(REPLY_TO));

        return mail;
    }

    private void send(Mail mail) {
        try {
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException(
                        "SendGrid failed: " + response.getStatusCode() + " " + response.getBody()
                );
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to send email via SendGrid", e);
        }
    }
}
