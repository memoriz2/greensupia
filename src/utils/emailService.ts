import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP 설정
    const config: EmailConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.GMAIL_USER || "",
        pass: process.env.GMAIL_APP_PASSWORD || "",
      },
    };

    // 환경 변수 로딩 상태 확인
    console.log("📧 Gmail 설정 확인:");
    console.log(
      "  - GMAIL_USER:",
      process.env.GMAIL_USER ? "설정됨" : "설정되지 않음"
    );
    console.log(
      "  - GMAIL_APP_PASSWORD:",
      process.env.GMAIL_APP_PASSWORD ? "설정됨" : "설정되지 않음"
    );
    console.log(
      "  - EMAIL_FROM_NAME:",
      process.env.EMAIL_FROM_NAME || "Greensupia"
    );

    this.transporter = nodemailer.createTransport(config);
  }

  // 이메일 발송 메서드
  async sendEmail(content: EmailContent): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "Greensupia"}" <${
          process.env.GMAIL_USER
        }>`,
        to: content.to,
        subject: content.subject,
        html: content.html,
        text: content.text || this.htmlToText(content.html),
      };

      console.log("📧 이메일 발송 시도:", {
        from: mailOptions.from,
        to: content.to,
        subject: content.subject,
        user: process.env.GMAIL_USER,
        hasPassword: !!process.env.GMAIL_APP_PASSWORD,
      });

      const info = await this.transporter.sendMail(mailOptions);
      console.log("📧 이메일 발송 성공:", info.messageId);
      return true;
    } catch (error) {
      console.error("📧 이메일 발송 실패:", error);

      // 더 자세한 에러 정보
      if (error instanceof Error) {
        console.error("📧 에러 상세 정보:");
        console.error("  - 메시지:", error.message);

        // Nodemailer 에러 타입 정의
        interface NodemailerError extends Error {
          code?: string;
          response?: string;
          command?: string;
        }

        const nodemailerError = error as NodemailerError;
        console.error("  - 코드:", nodemailerError.code);
        console.error("  - 응답:", nodemailerError.response);
        console.error("  - 명령어:", nodemailerError.command);
      }

      return false;
    }
  }

  // HTML을 텍스트로 변환 (fallback용)
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // HTML 태그 제거
      .replace(/&nbsp;/g, " ") // &nbsp;를 공백으로
      .replace(/&amp;/g, "&") // &amp;를 &로
      .replace(/&lt;/g, "<") // &lt;를 <로
      .replace(/&gt;/g, ">") // &gt;를 >로
      .replace(/&quot;/g, '"') // &quot;를 "로
      .trim();
  }

  // 문의글 답변 알림 이메일 템플릿
  generateInquiryAnswerEmail(
    inquiryTitle: string,
    inquiryContent: string,
    answer: string,
    authorName: string
  ): EmailContent {
    const subject = `[Greensupia] 문의글 "${inquiryTitle}"에 답변이 등록되었습니다`;

    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>문의글 답변 알림</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 10px; border-left: 4px solid #667eea; padding-left: 15px; }
          .inquiry-box, .answer-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c; margin: 10px 0; }
          .answer-box { border-left-color: #27ae60; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 문의글 답변 알림</h1>
            <p>안녕하세요! 문의하신 내용에 답변이 등록되었습니다.</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">📝 문의 내용</div>
              <div class="inquiry-box">
                <strong>제목:</strong> ${inquiryTitle}<br>
                <strong>작성자:</strong> ${authorName}<br><br>
                <strong>내용:</strong><br>
                ${inquiryContent.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">✅ 답변</div>
              <div class="answer-box">
                ${answer.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div class="highlight">
              💡 추가 문의사항이 있으시면 언제든지 문의해 주세요!
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="${
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
              }/inquiry" class="btn">
                문의글 목록 보기
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>본 메일은 자동으로 발송되었습니다.</p>
            <p>© 2024 Greensupia. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      to: "", // 실제 이메일 주소는 호출 시 설정
      subject,
      html,
    };
  }
}

// 싱글톤 인스턴스
export const emailService = new EmailService();
