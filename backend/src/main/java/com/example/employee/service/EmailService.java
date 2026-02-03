    package com.example.employee.service;

    import com.example.employee.model.Product;
    import com.sendgrid.*;
    import com.sendgrid.helpers.mail.Mail;
    import com.sendgrid.helpers.mail.objects.Attachments;
    import com.sendgrid.helpers.mail.objects.Content;
    import com.sendgrid.helpers.mail.objects.Email;
    import com.sendgrid.helpers.mail.objects.Personalization;
    import lombok.RequiredArgsConstructor;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.core.io.ByteArrayResource;
    import org.springframework.stereotype.Service;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.util.Base64;
    import java.util.List;

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

        public void sendVisitorThankYouEmail(
                String to,
                String visitorName,
                String exhibitionName
        ) {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            Content content = new Content(
                    "text/plain",
                    "Dear " + visitorName + ",\n\n" +
                            "Thank you for visiting us at " + exhibitionName + ".\n" +
                            "We will follow up shortly with more details.\n\n" +
                            "Regards,\nExhibition Team"
            );

            Mail mail = new Mail(from,
                    "Thank you for visiting us",
                    toEmail,
                    content
            );

            send(mail);
        }

        public void sendVisitorProductEmail(
                String to,
                String visitorName,
                String exhibitionName,
                List<Product> products
        ) {

            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            Email cc1 = new Email("govind.bharkade@nixelsoft.com");
            Email cc2 = new Email("sana.chougle@nixelsoft.com");

            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(visitorName).append(",\n\n")
                    .append("Thank you for visiting us at ").append(exhibitionName).append(".\n")
                    .append("Please find attached the product details you showed interest in:\n\n");

            for (Product product : products) {
                body.append("- ").append(product.getName()).append("\n");
            }

            body.append("\nRegards,\nExhibition Team");

            Content content = new Content("text/plain", body.toString());

            Mail mail = new Mail();
            mail.setFrom(from);
            mail.setSubject("Product Details from Exhibition");
            mail.addContent(content);

            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);
            personalization.addCc(cc1);
            personalization.addCc(cc2);

            mail.addPersonalization(personalization);

            // 📎 Attach product files
            for (Product product : products) {

                if (product.getAttachment() == null) continue;

                try {
                    Path filePath = Paths.get("uploads/products")
                            .resolve(product.getAttachment());

                    if (!Files.exists(filePath)) continue;

                    byte[] fileBytes = Files.readAllBytes(filePath);

                    Attachments attachment = new Attachments();
                    attachment.setFilename(product.getAttachment());
                    attachment.setType("application/octet-stream");
                    attachment.setDisposition("attachment");
                    attachment.setContent(Base64.getEncoder().encodeToString(fileBytes));

                    mail.addAttachments(attachment);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            send(mail);
        }
    }
