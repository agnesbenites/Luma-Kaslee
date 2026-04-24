"use client";

import { useState } from "react";
import { 
  ShieldCheck, FileText, Lock, Scale, 
  ChevronRight, Brain, Zap, ShieldAlert,
  CheckCircle, Activity, Focus, Timer, 
  Map, Lightbulb, TrendingUp, Presentation,
  BookOpen, GraduationCap, Eye, Target, Sparkles
} from "lucide-react";

export default function CentralLegalPage() {
  const [abaAtiva, setAbaAtiva] = useState("termos");

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-6 bg-[#FDFCFE] min-h-screen">
      {/* Sidebar de Navegação Robusta */}
      <aside className="w-full md:w-80 space-y-3">
        <div className="p-8 mb-6 bg-[#2D1B69] rounded-[2.5rem] text-white shadow-2xl shadow-purple-900/20 border border-purple-500/20">
          <h2 className="font-bold text-2xl flex items-center gap-2 text-[#F5C542]">
             Kaslee Legal
          </h2>
          <p className="text-[10px] opacity-70 mt-3 leading-relaxed font-bold uppercase tracking-[0.2em]">
            Compliance & Neurociência
          </p>
        </div>
        
        {[
          { id: "termos", label: "Termos e Condições", icon: FileText },
          { id: "capacidades", label: "Capacidades da Luma", icon: Presentation },
          { id: "metodologia", label: "Metodologias Ativas", icon: Brain },
          { id: "cognitivo", label: "Foco e Dopamina", icon: Activity },
          { id: "privacidade", label: "Privacidade e Ética", icon: ShieldCheck },
          { id: "cookies", label: "Cookies e Segurança", icon: Lock },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setAbaAtiva(item.id)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              abaAtiva === item.id 
                ? "bg-white shadow-xl text-[#2D1B69] border border-purple-100 translate-x-2" 
                : "text-gray-400 hover:bg-purple-50 hover:text-[#2D1B69]"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              {item.label}
            </div>
            <ChevronRight size={16} className={abaAtiva === item.id ? "opacity-100" : "opacity-0"} />
          </button>
        ))}
      </aside>

      {/* Área de Conteúdo Exaustiva */}
      <div className="flex-1 bg-white rounded-[3.5rem] p-16 shadow-2xl shadow-gray-200/50 border border-purple-50 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-purple-100">
        {abaAtiva === "termos" && <TermosConteudo />}
        {abaAtiva === "capacidades" && <CapacidadesConteudo />}
        {abaAtiva === "metodologia" && <MetodologiaConteudo />}
        {abaAtiva === "cognitivo" && <CognitivoConteudo />}
        {abaAtiva === "privacidade" && <PrivacidadeConteudo />}
        {abaAtiva === "cookies" && <CookiesConteudo />}
      </div>
    </div>
  );
}

function TermosConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex items-center gap-4 text-[#2D1B69] border-b border-gray-100 pb-8">
        <FileText size={40} className="text-[#F5C542]" />
        <h1 className="text-4xl font-black tracking-tight">Termos e Condições de Uso</h1>
      </div>

      <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
        <section>
          <h2 className="text-[#2D1B69] font-black text-xl mb-4 uppercase tracking-tight">1. Foco e Objetivo Institucional</h2>
          <p>
            A Kaslee possui o foco e objetivo, com suas plataformas <strong>Luma e Nova</strong>, de auxiliar o aluno a construir um pensamento crítico, lógico, estruturado, baseado nas atividades e matérias propostas pela escola e pela BNCC (Base Nacional Comum Curricular).
          </p>
        </section>

        <section className="bg-[#F4F1FB] p-10 rounded-[2.5rem] border border-purple-100 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
          <h2 className="text-[#2D1B69] font-black text-xl mb-4 flex items-center gap-2">
            <Eye size={24} className="text-[#F5C542]" /> 2. Dinâmica de Aula e Controle Docente
          </h2>
          <p className="relative z-10">
            A Luma é uma plataforma que auxilia o aluno <strong>durante o período de aula</strong>. Para acessá-la, o professor deve inserir previamente qual o conteúdo da aula apresentada no dia, e só é possível que o aluno acesse, após a liberação do professor em sala de aula.
          </p>
        </section>

        <section>
          <h2 className="text-[#2D1B69] font-black text-xl mb-4 uppercase tracking-tight">3. Engajamento e Elaboração de Conteúdo</h2>
          <p>
            A Luma engaja o pensamento crítico através de métodos científicos e cria questões com base no conteúdo apresentado pelo professor, seja através do livro didático ou do conteúdo apresentado por ele previamente. A Luma baseia as questões elaboradas estritamente com base no conteúdo inserido pelo professor e pelo livro didático usado no dia.
          </p>
        </section>

        <section className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-red-900">
          <h2 className="font-black text-xl mb-4 flex items-center gap-2">
            <ShieldAlert size={24} /> 4. Isenção de Responsabilidade
          </h2>
          <p className="font-medium italic">
            A Luma não se responsabiliza pelas opiniões dos professores, sejam elas religiosas, políticas, preferências, ou qualquer outra, atuando apenas como uma guia auxiliar do professor em sala de aula.
          </p>
        </section>
      </div>
    </div>
  );
}

function CapacidadesConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="flex items-center gap-4 text-[#2D1B69] border-b border-gray-100 pb-8">
        <Presentation size={40} className="text-[#F5C542]" />
        <h1 className="text-4xl font-black tracking-tight">Capacidades da Luma</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {[
          { t: "Mapeamento de Dados Cognitivos", d: "Capacidade de apresentar mapeamento de dados para entender se o aluno está absorvendo o conteúdo de forma efetiva." },
          { t: "Estratégias de Estudo Customizadas", d: "Auxiliar o professor a montar estratégias de estudo específicas para garantir a melhor absorção do conteúdo pela turma." },
          { t: "Interconexão Luma & Nova", d: "Capacidade de enviar as matérias estudadas para a plataforma Nova, para auxiliar na revisão contínua do conteúdo." },
          { t: "Engajamento por Questionamento", d: "Engajar perguntas profundas sobre a matéria apresentada, estimulando a curiosidade intelectual." },
          { t: "Automação Metodológica", d: "Escolher a melhor metodologia automaticamente, ou junto com o professor, para estimular e engajar o aluno quanto à matéria." },
          { t: "Identificação de Evolução", d: "Identificar a evolução e melhoria do aluno, ou ainda, alguma dificuldade em temas específicos, e sinalizar ao professor através das métricas apresentadas em forma de gráficos." },
          { t: "Estímulo Extra-Classe", d: "Estimular a curiosidade e o aprendizado contínuo para além da sala de aula, orientando os professores a fazerem estudos, experimentos, atividades extracurriculares, atividades externas como passeios, visita a museus, etc." }
        ].map((item, i) => (
          <div key={i} className="flex gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-purple-100 transition-all group">
            <div className="bg-[#2D1B69] text-[#F5C542] p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-black text-lg text-gray-800 mb-2">{item.t}</h4>
              <p className="text-gray-500 leading-relaxed font-medium">{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetodologiaConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="flex items-center gap-4 text-[#2D1B69] border-b border-gray-100 pb-8">
        <Brain size={40} className="text-[#F5C542]" />
        <h1 className="text-4xl font-black tracking-tight">Metodologias Utilizadas</h1>
      </div>
      
      <div className="space-y-8">
        <div className="p-10 border border-purple-100 rounded-[2.5rem] bg-[#FDFCFE] shadow-sm">
          <h3 className="font-black text-2xl text-[#2D1B69] mb-4">1. Pensamento Socrático (Maiêutica)</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Método baseado no diálogo e na dialética, onde a Luma não fornece respostas prontas. Através de uma sequência de perguntas reflexivas, ela conduz o aluno a confrontar suas próprias ideias, eliminando contradições e permitindo que ele "dê à luz" (maiêutica) ao conhecimento lógico por esforço próprio.
          </p>
        </div>

        <div className="p-10 border border-purple-100 rounded-[2.5rem] bg-[#FDFCFE] shadow-sm">
          <h3 className="font-black text-2xl text-[#2D1B69] mb-4">2. Método Científico e Pensamento Lógico</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            A Luma é programada para formar um pensamento lógico baseado em métodos científicos comprovados. Ela guia o aluno na formulação de hipóteses e na análise crítica do conteúdo, combatendo o aprendizado superficial e fragmentado.
          </p>
        </div>

        <div className="p-10 border border-purple-100 rounded-[2.5rem] bg-[#FDFCFE] shadow-sm">
          <h3 className="font-black text-2xl text-[#2D1B69] mb-4">3. Aprendizagem Baseada em Problemas (PBL)</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            A plataforma utiliza os problemas contidos no livro didático ou inseridos pelo professor para criar cenários de desafio, onde o aluno precisa aplicar a teoria em situações práticas para consolidar a absorção.
          </p>
        </div>
      </div>
    </div>
  );
}

function CognitivoConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="flex items-center gap-4 text-[#2D1B69] border-b border-gray-100 pb-8">
        <Activity size={40} className="text-[#F5C542]" />
        <h1 className="text-4xl font-black tracking-tight">Neurociência e Concentração</h1>
      </div>
      
      <div className="bg-[#1a0f3d] text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-10"><Brain size={300} /></div>
        <h3 className="text-[#F5C542] font-black text-2xl mb-6 uppercase tracking-wider">O Combate à Dopamina Rápida</h3>
        <p className="text-xl font-light leading-relaxed relative z-10">
          Não queremos apenas as respostas prontas, os vídeos de 15 segundos do TikTok ou a perda de concentração. Pelo contrário:
        </p>
        <p className="text-2xl font-black mt-6 text-white relative z-10 leading-tight">
          O principal objetivo é aumentar o tempo de concentração em termos mais complexos e longos, estimulando as áreas do cérebro responsáveis por equilibrar a dopamina.
        </p>
        <p className="mt-8 text-lg opacity-80 relative z-10">
          Trabalhamos para que a satisfação do aluno venha do esforço cognitivo prolongado, evitando que o vício em dopamina rápida das redes sociais prejudique a capacidade de aprendizado e foco estruturado.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 border border-gray-100 rounded-[2rem] bg-gray-50 flex gap-4">
          <Timer size={32} className="text-[#2D1B69]" />
          <div>
            <h4 className="font-black text-lg text-gray-800 mb-2">Resiliência de Atenção</h4>
            <p className="text-gray-500 font-medium">Treinamos o cérebro do aluno para sustentar o foco em conteúdos que exigem profundidade, combatendo a fragmentação da atenção digital.</p>
          </div>
        </div>
        <div className="p-8 border border-gray-100 rounded-[2rem] bg-gray-50 flex gap-4">
          <Target size={32} className="text-[#2D1B69]" />
          <div>
            <h4 className="font-black text-lg text-gray-800 mb-2">Equilíbrio Neuroquímico</h4>
            <p className="text-gray-500 font-medium">Ao utilizar métodos socráticos, o sistema exige esforço antes da recompensa, promovendo um ciclo saudável de aprendizado.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacidadeConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="flex items-center gap-4 text-green-700 border-b border-gray-100 pb-8">
        <ShieldCheck size={40} />
        <h1 className="text-4xl font-black tracking-tight text-gray-800">Privacidade e Ética</h1>
      </div>
      
      <div className="space-y-8 text-gray-700 text-lg leading-relaxed font-medium">
        <p>
          A Luma tem um papel de facilitadora e intermediadora. Seguindo rigorosamente o **ECA**, o **ECA Digital** e a **LGPD (Art. 14)**:
        </p>
        
        <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100">
          <h3 className="text-red-900 font-black mb-4">Barreiras de Proteção Invioláveis</h3>
          <p className="text-red-800">
            A Luma não poderá nunca: expor dados, gerar conteúdo sensível, gerar conteúdo violento, de nenhuma natureza, ou qualquer conteúdo que possa prejudicar fisicamente, emocionalmente ou psicologicamente o aluno.
          </p>
        </div>

        <p className="p-8 bg-gray-50 rounded-3xl border-l-8 border-[#2D1B69]">
          Sempre que houver tentativa de acesso a conteúdos inadequados, seja através de <strong>prompt de comando</strong>, pelo <strong>conteúdo inserido</strong> ou demandado via <strong>chat</strong>, o sistema será impedido de responder e a ação será bloqueada imediatamente.
        </p>
      </div>
    </div>
  );
}

function CookiesConteudo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="flex items-center gap-4 text-blue-600 border-b border-gray-100 pb-8">
        <Lock size={40} />
        <h1 className="text-4xl font-black tracking-tight text-gray-800">Cookies de Segurança</h1>
      </div>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-600 font-medium">A Kaslee utiliza exclusivamente cookies técnicos para garantir a segurança da infraestrutura educacional:</p>
        {[
          { t: "Segurança de Acesso", d: "Essencial para autenticar professores e alunos em sala de aula, impedindo invasões." },
          { t: "Logs de Auditoria", d: "Necessários para monitorar o cumprimento das políticas de segurança e integridade de dados." },
          { t: "Sessão Persistente", d: "Mantém a conexão estável entre a Luma e a Nova durante o ciclo de estudo." }
        ].map((c, i) => (
          <div key={i} className="p-6 border border-gray-100 rounded-2xl bg-white flex items-center gap-6 shadow-sm">
             <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Lock size={20} /></div>
             <div>
               <h4 className="font-black text-[#2D1B69] text-sm uppercase">{c.t}</h4>
               <p className="text-sm text-gray-500 m-0">{c.d}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}