"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type Aba = "home" | "nova" | "luma";

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Reveal wrapper ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("home");
  const [scrolled, setScrolled] = useState(false);
  
  // Simulação de estado de autenticação - substituir pela lógica real do seu app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dashboardUrl = isLoggedIn ? "/dashboard" : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = abaAtiva === "nova";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#0D0820" : "#FAFAFA",
        color: isDark ? "#F0EBF8" : "#1A0A3D",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        transition: "background 0.6s ease, color 0.6s ease",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          padding: "0 2.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? isDark ? "rgba(13,8,32,0.92)" : "rgba(250,250,250,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none",
          transition: "background 0.4s ease, border 0.4s ease",
        }}
      >
        <button
          onClick={() => setAbaAtiva("home")}
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            fontSize: "1.35rem",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            color: isDark ? "#C9B8FF" : "#2D1B69",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✦ Kaslee
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {(["nova", "luma"] as Aba[]).map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "0.9rem",
                fontWeight: abaAtiva === aba ? 700 : 400,
                letterSpacing: "0.04em",
                color: abaAtiva === aba
                  ? aba === "nova" ? "#F5C542" : "#8B5CF6"
                  : isDark ? "rgba(240,235,248,0.55)" : "rgba(26,10,61,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "color 0.3s",
              }}
            >
              {aba}
            </button>
          ))}
          
          {/* Botão condicional - Login ou Dashboard */}
          {dashboardUrl ? (
            <Link
              href={dashboardUrl}
              style={{
                padding: "0.45rem 1.3rem",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                background: isDark ? "#F5C542" : "#2D1B69",
                color: isDark ? "#1A0A3D" : "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Ir para o painel →
            </Link>
          ) : (
            <Link
              href="/login"
              style={{
                padding: "0.45rem 1.3rem",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                background: isDark ? "#F5C542" : "#2D1B69",
                color: isDark ? "#1A0A3D" : "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>

      {/* ── Sections ── */}
      <main>
        {abaAtiva === "home" && <SectionHome setAba={setAbaAtiva} />}
        {abaAtiva === "nova" && <SectionNova />}
        {abaAtiva === "luma" && <SectionLuma />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════════════════
function SectionHome({ setAba }: { setAba: (a: Aba) => void }) {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orb */}
        <div style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />

        <Reveal>
          <div style={{
            display: "inline-block",
            padding: "0.35rem 1.1rem",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "999px",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8B5CF6",
            marginBottom: "2.5rem",
            fontFamily: "'Georgia', serif",
          }}>
            Plataforma de Aprendizado Socrático com IA · 2026
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 style={{
            fontSize: "clamp(3rem, 7vw, 6.5rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            margin: "0 auto 1.5rem",
          }}>
            A inteligência que<br />
            <em style={{ color: "#8B5CF6" }}>ensina a pensar.</em>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            color: "rgba(26,10,61,0.6)",
            maxWidth: "560px",
            margin: "0 auto 3rem",
            fontFamily: "'Georgia', serif",
          }}>
            A Luma não tem opinião. Ela te ajuda a ter a sua.
            Do 6º ano ao Ensino Médio — 7 anos ao lado do aluno.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setAba("luma")}
              style={{
                padding: "1rem 2.2rem",
                background: "#2D1B69",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.05rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(45,27,105,0.25)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(45,27,105,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(45,27,105,0.25)";
              }}
            >
              Conhecer a Luma →
            </button>
            <button
              onClick={() => setAba("nova")}
              style={{
                padding: "1rem 2.2rem",
                background: "transparent",
                color: "#2D1B69",
                border: "1.5px solid rgba(45,27,105,0.3)",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.05rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2D1B69";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(45,27,105,0.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,27,105,0.3)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              Explorar a Nova
            </button>
          </div>
        </Reveal>

        {/* Stat row */}
        <Reveal delay={400}>
          <div style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            marginTop: "5rem",
            flexWrap: "wrap",
          }}>
            {[
              { n: "7 anos", l: "de acompanhamento" },
              { n: "5 pilares", l: "socrático · vocacional · socioemocional · plural · físico+digital" },
              { n: "100%", l: "ancorado na BNCC" },
            ].map(({ n, l }) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#2D1B69" }}>{n}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(26,10,61,0.45)", marginTop: "0.25rem", maxWidth: "200px", letterSpacing: "0.02em" }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Problema */}
      <section style={{ padding: "6rem 2rem", background: "#F4F1FB" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1rem" }}>
              O problema que a Luma resolve
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: "700px", marginBottom: "3.5rem" }}>
              A escola compete com o scroll infinito — e está perdendo.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🧠", title: "Atrofia do Pensamento", desc: "IA responde antes do aluno pensar. A Geração Alpha perde o raciocínio autônomo." },
              { icon: "📱", title: "Algoritmos vs. Atenção", desc: "Meta foi projetada para destruir o foco. Escolas competem com scroll infinito e perdem." },
              { icon: "⚠️", title: "Bullying e Radicalização", desc: "Redpill e machosfera recrutam adolescentes invisíveis ao sistema escolar." },
              { icon: "👨‍🏫", title: "Professor Sem Suporte", desc: "Domina tecnologia mas não tem método pedagógico para a Geração Alpha." },
              { icon: "🧭", title: "Nenhuma Bússola", desc: "O aluno chega ao 3º EM sem saber quem é. Testes pontuais não constroem identidade." },
            ].map(({ icon, title, desc }) => (
              <Reveal key={title}>
                <div style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid rgba(139,92,246,0.1)",
                  height: "100%",
                }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{icon}</div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{title}</h3>
                  <p style={{ fontSize: "0.83rem", lineHeight: 1.6, color: "rgba(26,10,61,0.55)" }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ padding: "7rem 2rem", background: "#FAFAFA" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1rem" }}>
              Fluxo de uma aula
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "3.5rem", maxWidth: "600px" }}>
              Como o aluno usa a Luma em sala.
            </h2>
          </Reveal>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute",
              left: "1.6rem",
              top: "2.5rem",
              bottom: "2.5rem",
              width: "1px",
              background: "linear-gradient(to bottom, #8B5CF6, rgba(139,92,246,0.1))",
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { n: "01", title: "Âncora Analógica", desc: "Leitura física, imagem ou observação. Sem tela — 10 min. O conhecimento começa no mundo real." },
                { n: "02", title: "Modo Foco", desc: "App abre em tela limpa, sem navegação, sem notificações. Ambiente criado para pensar." },
                { n: "03", title: "Pergunta Socrática", desc: "A IA gera uma pergunta baseada na âncora. Nunca resume. Sempre indaga. Nunca responde." },
                { n: "04", title: "Aluno Escreve", desc: "Tempo mínimo obrigatório. Copy-paste bloqueado. Só palavras próprias valem." },
                { n: "05", title: "Nova Pergunta", desc: "A IA aprofunda o raciocínio com base na resposta. Não elogia nem corrige — calibra." },
                { n: "06", title: "Síntese Final", desc: "Aluno escreve 1 frase de encerramento. Vai direto ao painel do professor." },
              ].map(({ n, title, desc }, i) => (
                <Reveal key={n} delay={i * 80}>
                  <div style={{ display: "flex", gap: "1.8rem", alignItems: "flex-start", paddingLeft: "0.25rem" }}>
                    <div style={{
                      minWidth: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      background: "#2D1B69",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 1,
                    }}>{n}</div>
                    <div style={{ paddingTop: "0.4rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.35rem", letterSpacing: "-0.01em" }}>{title}</h3>
                      <p style={{ fontSize: "0.87rem", lineHeight: 1.65, color: "rgba(26,10,61,0.55)" }}>{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section style={{ padding: "7rem 2rem", background: "#F4F1FB" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1rem" }}>
              Para quem é a Luma
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "3.5rem" }}>
              Um ecossistema completo de aprendizado.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                role: "Aluno",
                sub: "6º ano ao Ensino Médio",
                color: "#8B5CF6",
                items: ["Loop socrático em cada aula", "Perfil vocacional silencioso", "Alertas de saúde mental", "Preparação para ENEM com contexto", "Carta anual de evolução"],
              },
              {
                role: "Professor",
                sub: "Reforço · Escola · EAD",
                color: "#2D1B69",
                items: ["Painel de raciocínio da turma", "Relatório pós-sessão com IA", "Trilha de desenvolvimento docente", "Missões pedagógicas semanais", "Biblioteca por matéria e série"],
              },
              {
                role: "Família",
                sub: "Pais e responsáveis",
                color: "#6D28D9",
                items: ["Relatório mensal de evolução", "Sem exposição de dados individuais", "Alertas discretos de bem-estar", "Sugestões de conversa em casa", "Acesso à Carta Anual do filho"],
              },
              {
                role: "Escola",
                sub: "Privada · Pública · Redes",
                color: "#4C1D95",
                items: ["Dashboard de turmas e séries", "Conformidade LGPD nativa", "Integração com livros adotados", "Relatórios para gestão pedagógica", "Modelo B2B2C por licença"],
              },
            ].map(({ role, sub, color, items }, i) => (
              <Reveal key={role} delay={i * 100}>
                <div style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid rgba(139,92,246,0.1)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{
                    display: "inline-block",
                    padding: "0.25rem 0.8rem",
                    borderRadius: "999px",
                    background: color,
                    color: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    alignSelf: "flex-start",
                  }}>{role}</div>
                  <p style={{ fontSize: "0.78rem", color: "rgba(26,10,61,0.45)", marginBottom: "1.25rem", letterSpacing: "0.02em" }}>{sub}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {items.map(item => (
                      <li key={item} style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "rgba(26,10,61,0.7)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                        <span style={{ color, marginTop: "0.15rem", flexShrink: 0 }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Modelo de negócio */}
      <section style={{ padding: "7rem 2rem", background: "#FAFAFA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1rem" }}>
              Modelo de negócio
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "3.5rem" }}>
              Para cada contexto, um plano.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { plan: "Luma Pro", who: "Professor Particular", price: "R$ 49–79/mês", items: ["Até 20 alunos simultâneos", "Relatório pós-sessão com IA", "Trilha docente personalizada", "30 dias grátis sem cartão"], highlight: false },
              { plan: "Luma Escola", who: "Escolas Privadas", price: "R$ 15–50/aluno/ano", items: ["Licença B2B2C por turma", "Dashboard pedagógico completo", "Alertas socioemocional", "Suporte LGPD incluído"], highlight: true },
              { plan: "Luma Rede", who: "Redes e Grupos", price: "Contrato anual", items: ["200+ escolas num contrato", "API de integração com ERPs", "Gestão centralizada", "Piloto gratuito 60 dias"], highlight: false },
              { plan: "Luma Pública", who: "Escolas Públicas", price: "Via MEC / FNDE / UNICEF", items: ["Preço social diferenciado", "PWA sem hardware extra", "Parceria com Secretarias", "Impacto ESG mensurável"], highlight: false },
            ].map(({ plan, who, price, items, highlight }, i) => (
              <Reveal key={plan} delay={i * 80}>
                <div style={{
                  background: highlight ? "#2D1B69" : "#fff",
                  color: highlight ? "#fff" : "inherit",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: highlight ? "none" : "1px solid rgba(139,92,246,0.15)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: highlight ? "0 20px 60px rgba(45,27,105,0.25)" : "none",
                }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>{plan}</h3>
                  <p style={{ fontSize: "0.78rem", opacity: 0.6, marginBottom: "1rem", letterSpacing: "0.02em" }}>{who}</p>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>{price}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem", marginTop: "auto" }}>
                    {items.map(item => (
                      <li key={item} style={{ fontSize: "0.84rem", lineHeight: 1.5, opacity: highlight ? 0.85 : 0.7, display: "flex", gap: "0.5rem" }}>
                        <span style={{ color: highlight ? "#F5C542" : "#8B5CF6", flexShrink: 0 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        padding: "8rem 2rem",
        background: "#2D1B69",
        textAlign: "center",
        color: "#fff",
      }}>
        <Reveal>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem" }}>
            Uma iniciativa Kaslee · Agnes Benites · 2026
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Uma geração que pensa<br /><em style={{ color: "#F5C542" }}>por si mesma.</em>
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto 3rem", lineHeight: 1.65 }}>
            Do 6º ano ao Ensino Médio — a Luma acompanha o aluno por 7 anos, construindo pensamento crítico sem substituir o professor.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/cadastro/professor"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "#F5C542",
                color: "#2D1B69",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.05rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(245,197,66,0.3)",
              }}
            >
              Começar agora →
            </Link>
            <Link
              href="/planos"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.05rem",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Ver planos
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  NOVA (dark)
// ═══════════════════════════════════════════════════════════════════
function SectionNova() {
  return (
    <div style={{ color: "#F0EBF8" }}>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "8rem 2rem 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(245,197,66,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", width: "100%" }}>
          <div>
            <Reveal>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#F5C542", marginBottom: "1.5rem" }}>
                Nova — Ambiente de alto rendimento
              </div>
              <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
                Estude como<br /><em style={{ color: "#F5C542" }}>você nunca<br />estudou.</em>
              </h1>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(240,235,248,0.65)", marginBottom: "2.5rem", maxWidth: "420px" }}>
                A Nova é a estrutura fora da sala de aula. Organiza, esquematiza e cria trilhas de estudo personalizadas baseadas no que foi aprendido com a Luma.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { icon: "◈", title: "Esquematização de Conteúdos", desc: "Transforma aulas densas em mapas mentais e resumos estruturados automaticamente." },
                  { icon: "⟳", title: "Repetição Espaçada", desc: "Algoritmos que garantem que você nunca esqueça o que foi aprendido em sala." },
                  { icon: "⚡", title: "Estruturas de Estudo", desc: "Planos de ação automáticos calibrados para provas, vestibulares e ENEM." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: "2.2rem", height: "2.2rem", flexShrink: 0,
                      background: "rgba(245,197,66,0.12)",
                      borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#F5C542", fontSize: "0.95rem",
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.2rem" }}>{title}</div>
                      <div style={{ fontSize: "0.82rem", color: "rgba(240,235,248,0.5)", lineHeight: 1.55 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "24px",
              padding: "3rem",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,235,248,0.3)" }}>
                Painel de Estudos — Modo Noturno
              </div>
              {/* Mock dashboard */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { label: "Química — Oxirredução", pct: 78, c: "#F5C542" },
                  { label: "Literatura — Modernismo", pct: 55, c: "#8B5CF6" },
                  { label: "Matemática — Funções", pct: 91, c: "#34D399" },
                  { label: "História — República", pct: 33, c: "#F87171" },
                ].map(({ label, pct, c }) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.35rem", color: "rgba(240,235,248,0.65)" }}>
                      <span>{label}</span><span style={{ color: c }}>{pct}%</span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: "2px" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(240,235,248,0.25)", textAlign: "center" }}>
                Próxima revisão: Química · amanhã 19h
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA dark */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Foco total.<br /><em style={{ color: "#F5C542" }}>Zero distração.</em>
          </h2>
          <Link href="/login" style={{
            display: "inline-block",
            padding: "0.9rem 2.2rem",
            background: "#F5C542",
            color: "#1A0A3D",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
          }}>
            Acessar a Nova →
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  LUMA (light)
// ═══════════════════════════════════════════════════════════════════
function SectionLuma() {
  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "8rem 2rem 5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", width: "100%" }}>
          <div>
            <Reveal>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1.5rem" }}>
                Luma — Auxiliar socrática do professor
              </div>
              <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
                A IA que pergunta<br /><em style={{ color: "#8B5CF6" }}>em vez de<br />responder.</em>
              </h1>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(26,10,61,0.6)", marginBottom: "2.5rem", maxWidth: "420px" }}>
                Dentro da sala, a Luma é uma guia. Ela estimula o pensamento socrático em tempo real — sem substituir o professor, sem impor ideologia.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { icon: "❓", title: "Método Socrático", desc: "A IA nunca entrega a resposta. Aprofunda a pergunta até o aluno construir conhecimento próprio." },
                  { icon: "📚", title: "Ancorada na BNCC", desc: "Todo o conteúdo é validado pelas diretrizes nacionais e conectado ao ENEM." },
                  { icon: "🛡️", title: "Segurança Total", desc: "Ambiente blindado contra conteúdos inadequados. Conformidade LGPD nativa." },
                  { icon: "💙", title: "Saúde Mental", desc: "Detecta padrões de isolamento e alerta o professor de forma discreta, sem expor o aluno." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: "2.2rem", height: "2.2rem", flexShrink: 0,
                      background: "rgba(139,92,246,0.1)",
                      borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem",
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.2rem", color: "#1A0A3D" }}>{title}</div>
                      <div style={{ fontSize: "0.82rem", color: "rgba(26,10,61,0.5)", lineHeight: 1.55 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div style={{
              background: "#F4F1FB",
              borderRadius: "24px",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,10,61,0.35)", marginBottom: "0.5rem" }}>
                Sessão socrática — ao vivo
              </div>
              {[
                { who: "Luma", msg: "Você leu sobre a Revolução Industrial. Por que você acha que os trabalhadores foram para as cidades?", isAI: true },
                { who: "Aluno", msg: "Porque as fábricas pagavam mais do que o campo?", isAI: false },
                { who: "Luma", msg: "Interessante. Mas se o campo era a única vida que conheciam, o que os teria motivado a arriscar a mudança?", isAI: true },
                { who: "Aluno", msg: "Talvez a situação no campo fosse ruim demais...", isAI: false },
              ].map(({ who, msg, isAI }, i) => (
                <div key={i} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isAI ? "flex-start" : "flex-end",
                }}>
                  <div style={{ fontSize: "0.68rem", color: "rgba(26,10,61,0.35)", marginBottom: "0.3rem", letterSpacing: "0.05em" }}>{who}</div>
                  <div style={{
                    background: isAI ? "#2D1B69" : "#fff",
                    color: isAI ? "#fff" : "#1A0A3D",
                    borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                    padding: "0.75rem 1rem",
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                    maxWidth: "85%",
                    border: isAI ? "none" : "1px solid rgba(139,92,246,0.15)",
                  }}>{msg}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Jornada Vocacional */}
      <section style={{ padding: "6rem 2rem", background: "#F4F1FB" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "1rem" }}>Jornada vocacional</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
              Do 6º ano ao ENEM.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              { fase: "Módulo Jornada", periodo: "6º ao 9º ano", items: ["Perfil silencioso em construção", "IA registra padrões de raciocínio", "Analítico vs. narrativo?", "Ciências vs. humanidades?", "Sem testes — o uso revela"] },
              { fase: "Módulo Bússola", periodo: "1º e 2º EM", items: ["Perfil devolvido ao aluno", "Histórias reais de profissões", "Baseado em OIT e ONU Jovens", "Professor recebe mapa vocacional", "Família recebe relatório mensal"] },
              { fase: "Módulo Foco", periodo: "3º EM", items: ["Preparação ENEM com contexto", "Questão conectada ao projeto de vida", "Gaps por área identificados por IA", "Simulados socráticos, não de memória", "Carta Final de Desenvolvimento"] },
            ].map(({ fase, periodo, items }, i) => (
              <Reveal key={fase} delay={i * 100}>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(139,92,246,0.1)", height: "100%" }}>
                  <div style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B5CF6", marginBottom: "0.4rem" }}>{fase}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(26,10,61,0.45)", marginBottom: "1.25rem" }}>{periodo}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {items.map(item => (
                      <li key={item} style={{ fontSize: "0.84rem", color: "rgba(26,10,61,0.65)", display: "flex", gap: "0.5rem" }}>
                        <span style={{ color: "#8B5CF6" }}>→</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div style={{
              marginTop: "2rem",
              padding: "1.25rem 1.75rem",
              background: "#2D1B69",
              borderRadius: "16px",
              color: "#fff",
              fontSize: "0.9rem",
              textAlign: "center",
              fontStyle: "italic",
            }}>
              ✦ Carta Anual de Desenvolvimento — entregue ao aluno ao final de cada ano letivo
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 2rem", background: "#FAFAFA", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "#1A0A3D" }}>
            Professor como mediador,<br /><em style={{ color: "#8B5CF6" }}>não transmissor.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(26,10,61,0.55)", maxWidth: "440px", margin: "0 auto 2.5rem", lineHeight: 1.65 }}>
            A Luma amplifica o papel do professor. Nunca o substitui.
          </p>
          <Link href="/login" style={{
            display: "inline-block",
            padding: "0.9rem 2.2rem",
            background: "#2D1B69",
            color: "#fff",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(45,27,105,0.2)",
          }}>
            Começar com a Luma →
          </Link>
        </Reveal>
      </section>
    </div>
  );
}