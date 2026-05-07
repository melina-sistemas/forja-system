const TEAM_MEMBERS = [
  "Ellen",
  "Luís",
  "Wesley",
  "Natália",
  "Yasmim",
  "Fabiano",
  "Ariadne",
  "Elaíse",
  "Gabriel Néris",
  "Roberto",
  "Virgínia",
  "Melina"
];

const READING_PLANS = [
  {
    userName: "Ellen",
    cycle: "short",
    title: "Nunca Divida a Conta",
    author: "Chris Voss",
    priority: "required",
    focus: "Negociação e condução",
    justification: "Desenvolve firmeza e controle em conversas sensíveis."
  },
  {
    userName: "Ellen",
    cycle: "short",
    title: "Sinceridade Radical",
    author: "Kim Scott",
    priority: "required",
    focus: "Comunicação direta",
    justification: "Ensina a ser clara sem comprometer relacionamento."
  },
  {
    userName: "Ellen",
    cycle: "medium",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação equilibrada",
    justification: "Mantém empatia com posicionamento firme."
  },
  {
    userName: "Ellen",
    cycle: "medium",
    title: "Conversas Difíceis",
    author: "Douglas Stone, Bruce Patton e Sheila Heen",
    priority: "required",
    focus: "Conversas críticas",
    justification: "Aumenta segurança em situações de tensão."
  },
  {
    userName: "Ellen",
    cycle: "long",
    title: "A Coragem de Não Agradar",
    author: "Ichiro Kishimi e Fumitake Koga",
    priority: "recommended",
    focus: "Independência emocional",
    justification: "Reduz necessidade de validação externa."
  },
  {
    userName: "Ellen",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Prioridade",
    justification: "Direciona energia para decisões mais estratégicas."
  },
  {
    userName: "Luís",
    cycle: "short",
    title: "Hábitos Atômicos",
    author: "James Clear",
    priority: "required",
    focus: "Disciplina",
    justification: "Cria consistência e rotina de evolução."
  },
  {
    userName: "Luís",
    cycle: "short",
    title: "Mindset",
    author: "Carol S. Dweck",
    priority: "required",
    focus: "Mentalidade de crescimento",
    justification: "Reduz insegurança e acelera aprendizado."
  },
  {
    userName: "Luís",
    cycle: "medium",
    title: "Rápido e Devagar: Duas Formas de Pensar",
    author: "Daniel Kahneman",
    priority: "required",
    focus: "Tomada de decisão",
    justification: "Desenvolve pensamento analítico."
  },
  {
    userName: "Luís",
    cycle: "medium",
    title: "Os 7 Hábitos das Pessoas Altamente Eficazes",
    author: "Stephen R. Covey",
    priority: "required",
    focus: "Maturidade profissional",
    justification: "Estrutura responsabilidade e visão de longo prazo."
  },
  {
    userName: "Luís",
    cycle: "long",
    title: "Trabalho Focado",
    author: "Cal Newport",
    priority: "recommended",
    focus: "Concentração",
    justification: "Aumenta profundidade e qualidade de entrega."
  },
  {
    userName: "Luís",
    cycle: "long",
    title: "As Primeiras 20 Horas",
    author: "Josh Kaufman",
    priority: "recommended",
    focus: "Aprendizado rápido",
    justification: "Acelera aquisição de habilidades técnicas."
  },
  {
    userName: "Wesley",
    cycle: "short",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "required",
    focus: "Priorização",
    justification: "Reduz excesso de detalhe e aumenta velocidade."
  },
  {
    userName: "Wesley",
    cycle: "short",
    title: "O Princípio 80/20",
    author: "Richard Koch",
    priority: "required",
    focus: "Eficiência",
    justification: "Foca no que realmente gera resultado."
  },
  {
    userName: "Wesley",
    cycle: "medium",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação estratégica",
    justification: "Ajusta assertividade sem gerar rigidez."
  },
  {
    userName: "Wesley",
    cycle: "medium",
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    priority: "required",
    focus: "Estratégia",
    justification: "Desenvolve tomada de decisão mais assertiva."
  },
  {
    userName: "Wesley",
    cycle: "long",
    title: "Extrema Responsabilidade",
    author: "Jocko Willink e Leif Babin",
    priority: "recommended",
    focus: "Liderança",
    justification: "Fortalece senso de dono e responsabilidade."
  },
  {
    userName: "Wesley",
    cycle: "long",
    title: "Modelos Mentais",
    author: "Peter Hollins",
    priority: "recommended",
    focus: "Raciocínio estratégico",
    justification: "Melhora análise e tomada de decisão."
  },
  {
    userName: "Natália",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação assertiva",
    justification: "Ajuda a se posicionar com clareza sem perder empatia."
  },
  {
    userName: "Natália",
    cycle: "short",
    title: "A Coragem de Ser Imperfeito",
    author: "Brené Brown",
    priority: "required",
    focus: "Autoconfiança",
    justification: "Reduz autocrítica e fortalece segurança emocional."
  },
  {
    userName: "Natália",
    cycle: "medium",
    title: "Mindset",
    author: "Carol S. Dweck",
    priority: "required",
    focus: "Desenvolvimento contínuo",
    justification: "Melhora relação com aprendizado e desafios."
  },
  {
    userName: "Natália",
    cycle: "medium",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    priority: "required",
    focus: "Relacionamento e influência",
    justification: "Aumenta segurança social e capacidade de interação."
  },
  {
    userName: "Natália",
    cycle: "long",
    title: "Agilidade Emocional",
    author: "Susan David",
    priority: "recommended",
    focus: "Gestão emocional",
    justification: "Desenvolve controle emocional em pressão."
  },
  {
    userName: "Natália",
    cycle: "long",
    title: "Estabeleça Limites, Encontre a Paz",
    author: "Nedra Glover Tawwab",
    priority: "recommended",
    focus: "Limites emocionais",
    justification: "Ajuda a não absorver problemas externos."
  },
  {
    userName: "Yasmim",
    cycle: "short",
    title: "Comunicação Assertiva",
    author: "Vera Martins",
    priority: "required",
    focus: "Posicionamento",
    justification: "Desenvolve segurança para se expressar com clareza e firmeza."
  },
  {
    userName: "Yasmim",
    cycle: "short",
    title: "A Coragem de Ser Imperfeito",
    author: "Brené Brown",
    priority: "required",
    focus: "Autoconfiança",
    justification: "Reduz medo de errar e excesso de autocobrança."
  },
  {
    userName: "Yasmim",
    cycle: "medium",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação equilibrada",
    justification: "Ajuda a manter empatia sem perder firmeza."
  },
  {
    userName: "Yasmim",
    cycle: "medium",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    priority: "required",
    focus: "Influência",
    justification: "Desenvolve capacidade de conduzir sem depender de validação."
  },
  {
    userName: "Yasmim",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Prioridade",
    justification: "Ajuda a não assumir demandas desnecessárias."
  },
  {
    userName: "Yasmim",
    cycle: "long",
    title: "Os 7 Hábitos das Pessoas Altamente Eficazes",
    author: "Stephen R. Covey",
    priority: "recommended",
    focus: "Maturidade profissional",
    justification: "Desenvolve responsabilidade e posicionamento profissional."
  },
  {
    userName: "Fabiano",
    cycle: "short",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    priority: "required",
    focus: "Relacionamento e influência",
    justification: "Desenvolve conexão e capacidade de influenciar pessoas."
  },
  {
    userName: "Fabiano",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação estratégica",
    justification: "Melhora abordagem em conversas com clientes e equipe."
  },
  {
    userName: "Fabiano",
    cycle: "medium",
    title: "Comece pelo Porquê",
    author: "Simon Sinek",
    priority: "required",
    focus: "Comunicação com propósito",
    justification: "Ajuda a comunicar com mais impacto e clareza estratégica."
  },
  {
    userName: "Fabiano",
    cycle: "medium",
    title: "Os 5 Desafios das Equipes",
    author: "Patrick Lencioni",
    priority: "required",
    focus: "Trabalho em equipe",
    justification: "Desenvolve liderança e gestão de relações dentro do time."
  },
  {
    userName: "Fabiano",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Prioridade e foco",
    justification: "Mantém alta performance com decisões mais estratégicas."
  },
  {
    userName: "Fabiano",
    cycle: "long",
    title: "A Regra é Não Ter Regras",
    author: "Reed Hastings e Erin Meyer",
    priority: "recommended",
    focus: "Cultura e liderança",
    justification: "Amplia visão de liderança moderna e autonomia."
  },
  {
    userName: "Ariadne",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação estratégica",
    justification: "Estrutura falas em cenários sensíveis e melhora alinhamentos."
  },
  {
    userName: "Ariadne",
    cycle: "short",
    title: "O Poder da Ação",
    author: "Paulo Vieira",
    priority: "required",
    focus: "Clareza e protagonismo",
    justification: "Desenvolve foco, decisão e senso de responsabilidade."
  },
  {
    userName: "Ariadne",
    cycle: "medium",
    title: "Você Pode Negociar Qualquer Coisa",
    author: "Eduardo Ferraz",
    priority: "required",
    focus: "Influência e negociação",
    justification: "Fortalece posicionamento em decisões e condução de clientes."
  },
  {
    userName: "Ariadne",
    cycle: "medium",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "required",
    focus: "Priorização",
    justification: "Ajuda a lidar com falta de clareza e definir foco."
  },
  {
    userName: "Ariadne",
    cycle: "long",
    title: "Customer Success: Como Encantar e Manter Clientes",
    author: "Lincoln Murphy",
    priority: "recommended",
    focus: "Customer Success",
    justification: "Consolida atuação estratégica com clientes."
  },
  {
    userName: "Ariadne",
    cycle: "long",
    title: "Treine a Sua Equipe para Vender",
    author: "Sandro Magaldi",
    priority: "recommended",
    focus: "Treinamento e desenvolvimento",
    justification: "Fortalece papel educador e influência no time."
  },
  {
    userName: "Elaíse",
    cycle: "short",
    title: "Comunicação Assertiva",
    author: "Vera Martins",
    priority: "required",
    focus: "Comunicação e posicionamento",
    justification: "Fortalece argumentação e segurança ao explicar conteúdos técnicos."
  },
  {
    userName: "Elaíse",
    cycle: "short",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "required",
    focus: "Foco e prioridade",
    justification: "Reduz dispersão e direciona energia para o que gera resultado."
  },
  {
    userName: "Elaíse",
    cycle: "medium",
    title: "Gerenciamento da Rotina do Trabalho do Dia a Dia",
    author: "Vicente Falconi",
    priority: "required",
    focus: "Base técnica",
    justification: "Aumenta profundidade e consistência nos conteúdos."
  },
  {
    userName: "Elaíse",
    cycle: "medium",
    title: "O Código da Inteligência",
    author: "Augusto Cury",
    priority: "required",
    focus: "Gestão emocional",
    justification: "Ajuda a controlar ansiedade e intensidade emocional."
  },
  {
    userName: "Elaíse",
    cycle: "long",
    title: "Didática do Ensino Superior",
    author: "Celso Antunes",
    priority: "recommended",
    focus: "Estrutura de ensino",
    justification: "Eleva qualidade e método nos treinamentos."
  },
  {
    userName: "Elaíse",
    cycle: "long",
    title: "Educação Corporativa",
    author: "Marisa Eboli",
    priority: "recommended",
    focus: "Treinamento estratégico",
    justification: "Conecta treinamento com estratégia organizacional."
  },
  {
    userName: "Gabriel Néris",
    cycle: "short",
    title: "Nunca Divida a Conta",
    author: "Chris Voss",
    priority: "required",
    focus: "Negociação avançada",
    justification: "Desenvolve condução de clientes difíceis e cenários de retenção."
  },
  {
    userName: "Gabriel Néris",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação estratégica",
    justification: "Reduz atrito emocional e melhora conexão."
  },
  {
    userName: "Gabriel Néris",
    cycle: "medium",
    title: "SPIN Selling",
    author: "Neil Rackham",
    priority: "required",
    focus: "Condução consultiva",
    justification: "Fortalece construção de valor e quebra de objeções."
  },
  {
    userName: "Gabriel Néris",
    cycle: "medium",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    priority: "required",
    focus: "Influência",
    justification: "Equilibra firmeza com conexão e empatia."
  },
  {
    userName: "Gabriel Néris",
    cycle: "long",
    title: "Os 7 Hábitos das Pessoas Altamente Eficazes",
    author: "Stephen R. Covey",
    priority: "recommended",
    focus: "Liderança",
    justification: "Consolida maturidade para evolução de carreira."
  },
  {
    userName: "Gabriel Néris",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Foco estratégico",
    justification: "Mantém alta performance com priorização inteligente."
  },
  {
    userName: "Roberto",
    cycle: "short",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "required",
    focus: "Prioridade e foco",
    justification: "Reduz sobrecarga e melhora clareza nas decisões."
  },
  {
    userName: "Roberto",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação em conflito",
    justification: "Ajuda a lidar com desalinhamentos sem desgaste."
  },
  {
    userName: "Roberto",
    cycle: "medium",
    title: "O Cliente no Centro do Negócio",
    author: "Ricardo Peña",
    priority: "required",
    focus: "Customer Success",
    justification: "Fortalece visão estratégica de jornada e valor."
  },
  {
    userName: "Roberto",
    cycle: "medium",
    title: "A Arte da Estratégia",
    author: "Avinash Dixit e Barry Nalebuff",
    priority: "required",
    focus: "Pensamento estratégico",
    justification: "Estrutura raciocínio e tomada de decisão."
  },
  {
    userName: "Roberto",
    cycle: "long",
    title: "Gestão da Experiência do Cliente",
    author: "Gianesi e Corrêa",
    priority: "recommended",
    focus: "Jornada do cliente",
    justification: "Aprofunda visão sistêmica e melhoria contínua."
  },
  {
    userName: "Roberto",
    cycle: "long",
    title: "Inteligência Emocional",
    author: "Daniel Goleman",
    priority: "recommended",
    focus: "Gestão emocional",
    justification: "Desenvolve controle emocional e maturidade."
  },
  {
    userName: "Virgínia",
    cycle: "short",
    title: "O Monge e o Executivo",
    author: "James C. Hunter",
    priority: "required",
    focus: "Postura e influência",
    justification: "Desenvolve liderança sem confronto e melhora condução do cliente."
  },
  {
    userName: "Virgínia",
    cycle: "short",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    priority: "required",
    focus: "Relacionamento e influência",
    justification: "Ajuda a gerar engajamento sem desgaste emocional."
  },
  {
    userName: "Virgínia",
    cycle: "medium",
    title: "Encantamento",
    author: "Guy Kawasaki",
    priority: "required",
    focus: "Persuasão leve",
    justification: "Ensina a engajar clientes sem precisar cobrar."
  },
  {
    userName: "Virgínia",
    cycle: "medium",
    title: "A Venda Desafiadora",
    author: "Matthew Dixon e Brent Adamson",
    priority: "required",
    focus: "Comunicação consultiva",
    justification: "Desenvolve firmeza e direcionamento estratégico."
  },
  {
    userName: "Virgínia",
    cycle: "long",
    title: "Customer Success",
    author: "Dan Steinman, Lincoln Murphy e Nick Mehta",
    priority: "recommended",
    focus: "Gestão de cliente",
    justification: "Estrutura visão de responsabilidade compartilhada."
  },
  {
    userName: "Virgínia",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Foco e limites",
    justification: "Ajuda a reduzir envolvimento excessivo e desgaste."
  },
  {
    userName: "Melina",
    cycle: "short",
    title: "Comunicação Não Violenta",
    author: "Marshall B. Rosenberg",
    priority: "required",
    focus: "Comunicação sob pressão",
    justification: "Reduz reatividade e melhora clareza emocional."
  },
  {
    userName: "Melina",
    cycle: "short",
    title: "A Arte de Ouvir",
    author: "Michael P. Nichols",
    priority: "required",
    focus: "Escuta estratégica",
    justification: "Desenvolve capacidade de ouvir sem interromper ou reagir."
  },
  {
    userName: "Melina",
    cycle: "medium",
    title: "Conversas Difíceis",
    author: "Douglas Stone, Bruce Patton e Sheila Heen",
    priority: "required",
    focus: "Conflitos",
    justification: "Ensina a conduzir situações difíceis sem desgaste emocional."
  },
  {
    userName: "Melina",
    cycle: "medium",
    title: "Inteligência Emocional",
    author: "Daniel Goleman",
    priority: "required",
    focus: "Regulação emocional",
    justification: "Desenvolve controle emocional e autoconsciência."
  },
  {
    userName: "Melina",
    cycle: "long",
    title: "Essencialismo",
    author: "Greg McKeown",
    priority: "recommended",
    focus: "Gestão de energia",
    justification: "Ajuda a parar de absorver problemas desnecessários."
  },
  {
    userName: "Melina",
    cycle: "long",
    title: "Os 5 Desafios das Equipes",
    author: "Patrick Lencioni",
    priority: "recommended",
    focus: "Gestão de time",
    justification: "Consolida liderança com base mais madura."
  }
];

export function createDevelopmentPlanCatalog() {
  const users = TEAM_MEMBERS.map((name) => ({
    id: `user-${slugify(name)}`,
    name,
    email: `${slugify(name)}@equipe.local`,
    role: "staff",
    level: "bronze",
    readingScore: 0,
    activeLoanId: undefined,
    completedLoansCount: 0
  }));

  const bookMap = new Map();
  const recommendations = [];

  for (const item of READING_PLANS) {
    const userId = `user-${slugify(item.userName)}`;
    const bookId = `book-${slugify(`${item.title}-${item.author}`)}`;
    const recommendationId = `rec-${userId}-${bookId}`;

    if (!bookMap.has(bookId)) {
      bookMap.set(bookId, {
        id: bookId,
        title: item.title,
        author: item.author,
        category: item.focus,
        isbn: undefined,
        level: mapCycleToBookLevel(item.cycle),
        isPremium: false,
        totalCopies: 1,
        availableCopies: 1,
        isActive: true,
        _cycles: new Set([item.cycle]),
        _recommendationCount: 1
      });
    } else {
      const current = bookMap.get(bookId);
      current._cycles.add(item.cycle);
      current._recommendationCount += 1;
      current.category = current.category || item.focus;
    }

    recommendations.push({
      id: recommendationId,
      userId,
      bookId,
      cycle: item.cycle,
      priority: item.priority,
      mainFocus: item.focus,
      strategicJustification: item.justification
    });
  }

  const books = [...bookMap.values()].map((book) => {
    const cycles = [...book._cycles];
    const hasMixedCycles = cycles.length > 1;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      level: hasMixedCycles ? "medium" : book.level,
      isPremium: false,
      totalCopies: Math.min(4, Math.max(1, Math.ceil(book._recommendationCount / 3))),
      availableCopies: Math.min(4, Math.max(1, Math.ceil(book._recommendationCount / 3))),
      isActive: true
    };
  });

  return {
    users,
    books: books.sort((left, right) => left.title.localeCompare(right.title, "pt-BR")),
    recommendations
  };
}

function mapCycleToBookLevel(cycle) {
  switch (cycle) {
    case "short":
      return "easy";
    case "medium":
      return "medium";
    case "long":
      return "hard";
    default:
      return "medium";
  }
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
