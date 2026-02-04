    package com.example.employee.service;

    import com.example.employee.model.Product;
    import com.sendgrid.*;
    import com.sendgrid.helpers.mail.Mail;
    import com.sendgrid.helpers.mail.objects.Attachments;
    import com.sendgrid.helpers.mail.objects.Content;
    import com.sendgrid.helpers.mail.objects.Email;
    import com.sendgrid.helpers.mail.objects.Personalization;
    import lombok.RequiredArgsConstructor;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
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

        private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

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
                logger.info("SendGrid email sent successfully. Status: {}", response.getStatusCode());

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

            String productNames = products.stream()
                    .map(Product::getName)
                    .distinct()
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("our solutions");

            String signature = """
                    Best Regards.<br/>
                    Govind Bharkade<br/>
                    Revenue &amp; Partnership<br/>
                    Corporate Office Address:<br/>
                    Nixel Software Solutions Pvt. Ltd.<br/>
                    Ambrosia Galaxy, Innov8 Workspaces,<br/>
                    7th Floor, Pan card club Road,<br/>
                    Baner, Pune, Maharashtra, India 411069<br/>
                    Mobile: +91 9172014303<br/>
                    Email: Govind.bharkade@nixelsoft.com<br/>
                    Web: www.nixelsoft.com<br/>
                    <br/>
                    <img src="cid:nixel-logo" alt="Nixel" style="max-width:220px; height:auto;" />
                    """;

            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(visitorName).append(",<br/><br/>")
                    .append("Thank you for visiting our stall at ").append(exhibitionName)
                    .append(" and taking the time to learn about our ")
                    .append(productNames).append(" solutions.<br/><br/>")
                    .append("We enjoyed discussing how ").append(productNames)
                    .append(" can help your business with integrated modules for sales, inventory, accounting, HR, and more—tailored to your specific needs.<br/><br/>")
                    .append("If you’d like to dive deeper into ").append(productNames)
                    .append(" implementation, customization, or support, please let us know. We’d be glad to schedule a follow-up discussion.<br/><br/>")
                    .append("We appreciate your interest and look forward to assisting you in your digital transformation journey.<br/><br/>")
                    .append(signature);

            Content content = new Content("text/html", body.toString());

            Mail mail = new Mail();
            mail.setFrom(from);
            mail.setSubject("Thank You for Your Interest in " + productNames + " Solutions");
            mail.addContent(content);

            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);
            personalization.addCc(cc1);
            personalization.addCc(cc2);

            mail.addPersonalization(personalization);

            // Inline logo
            try {
                Path logoPath = Paths.get("src/main/resources/documents/Nixel.jpeg");
                if (Files.exists(logoPath)) {
                    byte[] logoBytes = Files.readAllBytes(logoPath);
                    Attachments logo = new Attachments();
                    logo.setFilename("Nixel.jpeg");
                    logo.setType("image/jpeg");
                    logo.setDisposition("inline");
                    logo.setContentId("nixel-logo");
                    logo.setContent(Base64.getEncoder().encodeToString(logoBytes));
                    mail.addAttachments(logo);
                }
            } catch (IOException e) {
                logger.warn("Failed to attach inline logo for visitor email: {}", e.getMessage());
            }

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
