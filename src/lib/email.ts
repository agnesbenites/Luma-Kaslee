import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarCredenciaisAluno({
  nome,
  email,
  senha,
  nomeEscola,
}: {
  nome: string;
  email: string;
  senha: string;
  nomeEscola: string;
}) {
  await transporter.sendMail({
    from: `"Luma — ${nomeEscola}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Suas credenciais de acesso à Luma",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Georgia, serif; background: #F4F1FB; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(45,27,105,0.08);">
            
            <div style="background: #2D1B69; padding: 32px; text-align: center;">
              <h1 style="color: #F5C542; font-size: 28px; margin: 0; font-style: italic;">✦ Luma</h1>
              <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">A inteligência que ensina a pensar.</p>
            </div>

            <div style="padding: 36px 32px;">
              <h2 style="color: #2D1B69; font-size: 20px; margin: 0 0 8px;">Olá, ${nome}!</h2>
              <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Sua conta na Luma foi criada por <strong>${nomeEscola}</strong>. 
                Use as credenciais abaixo para fazer seu primeiro acesso.
              </p>

              <div style="background: #F4F1FB; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold;">Suas credenciais</p>
                <div style="margin-bottom: 12px;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">E-mail</p>
                  <p style="margin: 0; font-size: 15px; font-weight: bold; color: #2D1B69;">${email}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">Senha temporária</p>
                  <p style="margin: 0; font-size: 22px; font-weight: bold; color: #2D1B69; letter-spacing: 0.15em; font-family: monospace;">${senha}</p>
                </div>
              </div>

              <a href="${process.env.NEXTAUTH_URL}/login"
                style="display: block; background: #2D1B69; color: #fff; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; margin-bottom: 24px;">
                Acessar a Luma →
              </a>

              <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
                ⚠️ Por segurança, altere sua senha no primeiro acesso em 
                <strong>Configurações → Alterar senha</strong>.
              </p>
            </div>

            <div style="background: #F9FAFB; padding: 20px 32px; text-align: center; border-top: 1px solid #F3F4F6;">
              <p style="color: #D1D5DB; font-size: 12px; margin: 0;">
                Luma · Kaslee · Plataforma de Aprendizado Socrático
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function enviarCredenciaisAlunoPrivado({
  nome,
  email,
  senha,
  nomeProfessor,
}: {
  nome: string;
  email: string;
  senha: string;
  nomeProfessor: string;
}) {
  await transporter.sendMail({
    from: `"Luma — ${nomeProfessor}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Suas credenciais de acesso à Luma",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Georgia, serif; background: #F4F1FB; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(45,27,105,0.08);">
            
            <div style="background: #2D1B69; padding: 32px; text-align: center;">
              <h1 style="color: #F5C542; font-size: 28px; margin: 0; font-style: italic;">✦ Luma</h1>
              <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">A inteligência que ensina a pensar.</p>
            </div>

            <div style="padding: 36px 32px;">
              <h2 style="color: #2D1B69; font-size: 20px; margin: 0 0 8px;">Olá, ${nome}!</h2>
              <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Seu professor <strong>${nomeProfessor}</strong> criou sua conta na Luma.
                Use as credenciais abaixo para fazer seu primeiro acesso.
              </p>

              <div style="background: #F4F1FB; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; font-size: 13px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold;">Suas credenciais</p>
                <div style="margin-bottom: 12px;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">E-mail</p>
                  <p style="margin: 0; font-size: 15px; font-weight: bold; color: #2D1B69;">${email}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">Senha temporária</p>
                  <p style="margin: 0; font-size: 22px; font-weight: bold; color: #2D1B69; letter-spacing: 0.15em; font-family: monospace;">${senha}</p>
                </div>
              </div>

              <a href="${process.env.NEXTAUTH_URL}/login"
                style="display: block; background: #2D1B69; color: #fff; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; margin-bottom: 24px;">
                Acessar a Luma →
              </a>

              <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
                ⚠️ Por segurança, altere sua senha no primeiro acesso em 
                <strong>Configurações → Alterar senha</strong>.
              </p>
            </div>

            <div style="background: #F9FAFB; padding: 20px 32px; text-align: center; border-top: 1px solid #F3F4F6;">
              <p style="color: #D1D5DB; font-size: 12px; margin: 0;">
                Luma · Kaslee · Plataforma de Aprendizado Socrático
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
