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
//            Email cc2 = new Email("sana.chougle@nixelsoft.com");

            String productNames = products.stream()
                    .map(Product::getName)
                    .distinct()
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("our solutions");

            String signature = """
                    <div style="margin-top:16px; padding-top:12px; border-top:1px solid #e5e7eb; font-family:Arial, sans-serif; font-size:13px; color:#374151;">
                      <div style="font-weight:600; color:#111827; margin-bottom:2px;">Best Regards.</div>
                      <div style="font-size:14px; font-weight:600; color:#0f172a;">Govind Bharkade</div>
                      <div style="color:#475569; margin-bottom:6px;">Revenue &amp; Partnership</div>
                      <div style="color:#111827; font-weight:600;">Corporate Office Address:</div>
                      <div style="color:#475569;">Nixel Software Solutions Pvt. Ltd.</div>
                      <div style="color:#475569;">Ambrosia Galaxy, Innov8 Workspaces,</div>
                      <div style="color:#475569;">7th Floor, Pan card club Road,</div>
                      <div style="color:#475569;">Baner, Pune, Maharashtra, India 411069</div>
                      <div style="margin-top:6px; color:#111827;">
                        Mobile: <span style="color:#475569;">+91 9172014303</span>
                      </div>
                      <div style="color:#111827;">
                        Email: <span style="color:#475569;">Govind.bharkade@nixelsoft.com</span>
                      </div>
                      <div style="color:#111827;">
                        Web: <span style="color:#475569;">www.nixelsoft.com</span>
                      </div>
                      <div style="margin-top:10px;">
                        <img src="cid:nixel-logo" alt="Nixel" style="max-width:140px; height:auto;" />
                      </div>
                    </div>
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
//            personalization.addCc(cc2);

            mail.addPersonalization(personalization);

            // Inline logo
            try {
                Path logoPath = Paths.get("src/main/resources/documents/New Nixel Logo.jpg");
                if (Files.exists(logoPath)) {
                    byte[] logoBytes = Files.readAllBytes(logoPath);
                    Attachments logo = new Attachments();
                    logo.setFilename("New Nixel Logo.jpg");
                    logo.setType("image/jpeg");
                    logo.setDisposition("inline");
                    logo.setContentId("nixel-logo");
                    logo.setContent(Base64.getEncoder().encodeToString(logoBytes));
                    mail.addAttachments(logo);
                }
            } catch (IOException e) {
                logger.warn("Failed to attach inline logo for visitor email: {}", e.getMessage());
            }

            // Attach corporate profile PDF
            try {
                Path profilePath = Paths.get("src/main/resources/documents/Nixel Corporate Profile.pdf");
                if (Files.exists(profilePath)) {
                    byte[] profileBytes = Files.readAllBytes(profilePath);
                    Attachments profileAttachment = new Attachments();
                    profileAttachment.setFilename("Nixel Corporate Profile.pdf");
                    profileAttachment.setType("application/pdf");
                    profileAttachment.setDisposition("attachment");
                    profileAttachment.setContent(Base64.getEncoder().encodeToString(profileBytes));
                    mail.addAttachments(profileAttachment);
                }
            } catch (IOException e) {
                logger.warn("Failed to attach corporate profile PDF: {}", e.getMessage());
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
