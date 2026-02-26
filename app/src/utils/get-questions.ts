const questions = [
  {
    category: "Ticker",
    categories: [
      {
        name: "Eficiência e Rentabilidade",
        description:
          "Esta categoria mede se a empresa é uma máquina de gerar dinheiro ou apenas 'troca seis por meia dúzia'.",
        questions: [
          "Rentabilidade Real (ROE): O ROE é historicamente maior que 10% e superior à Selic atual?",
          "Retorno sobre Capital (ROIC): O ROIC é maior que 10% e consistentemente superior ao custo da dívida?",
          "Margem de Segurança (Líquida): A Margem Líquida é superior a 10% de forma constante (sem oscilações bruscas)?",
          "Eficiência Operacional (EBIT): A Margem EBIT é superior a 15% (indicando forte poder de preço e controle de custos)?",
          "Histórico de Crescimento: A Receita ou o Lucro Líquido cresceram, em média, mais de 5% ao ano nos últimos 5 anos?",
        ],
      },
      {
        name: "Segurança Financeira e Resiliência",
        description:
          "Esta categoria garante que a empresa não vá à falência na próxima crise.",
        questions: [
          "Endividamento Saudável: A relação Dívida Líquida/EBITDA é menor que 2 (a empresa quita a dívida em menos de 2 anos de geração de caixa) / Índice de Basileia (>12%).?",
          "Poder de Sobrevivência: A empresa tem mais de 30 anos de fundação (provou que sobrevive a diferentes ciclos econômicos)?",
          "Perenidade do Setor: O setor de atuação existe há mais de 100 anos (baixo risco de ser substituído por uma tecnologia disruptiva amanhã)?",
          "Combate à Obsolescência: A empresa investe ativamente em Pesquisa, Desenvolvimento e Inovação para não ficar para trás?",
        ],
      },
      {
        name: "Governança e Estrutura",
        description:
          "Esta categoria avalia quem manda e se os interesses estão alinhados com os seus.",
        questions: [
          "Dominância de Mercado: A empresa é a líder absoluta (1ª colocada) em seu setor de atuação nacional ou mundial?",
          "Independência de Gestão: A empresa é livre de controle estatal e não depende de um único cliente para mais de 20% da sua receita?",
          "Integridade Corporativa: A gestão possui ficha limpa, sem qualquer histórico ou envolvimento em casos de corrupção?",
          "Robustez de Mercado (Blue Chip): A empresa é considerada uma 'Blue Chip' (grande capitalização, alta liquidez e presença no índice IBOVESPA)?",
        ],
      },
      {
        name: "Política de Proventos",
        description: "Esta categoria foca em como você será remunerado.",
        questions: [
          "Cultura de Dividendos: Existe um histórico ininterrupto e sólido de pagamento de dividendos aos acionistas?",
          "Sustentabilidade do Payout: O Payout (porcentagem do lucro distribuído) está entre 20% e 70%, garantindo que sobra dinheiro para a empresa crescer?",
        ],
      },
    ],
  },
  {
    category: "Fii",
    categories: [
      {
        name: "Qualidade e Lastro",
        description:
          "Avalia o que sustenta o dinheiro: a qualidade física dos imóveis ou o risco de crédito das dívidas.",
        questions: [
          "Qualidade do Ativo/Crédito: No Tijolo, os imóveis são Classe A? No Papel/Infra, o rating médio é Investment Grade (A ou superior)?",
          "Diversificação de Risco: O fundo possui mais de 10 ativos (prédios ou contratos de dívida) e não é monoativo/monoinquilino?",
          "Localização e Setor: Os imóveis estão em regiões nobres (eixos comerciais) ou as dívidas são de setores perenes/vitais?",
          "Baixa Concentração: Nenhum inquilino ou devedor (CRI/Debênture) representa mais de 20% da receita total do fundo?",
        ],
      },
      {
        name: "Gestão e Governança",
        description:
          "Analisa quem pilota o fundo e o respeito ao patrimônio do cotista minoritário.",
        questions: [
          "Experiência e Alinhamento: A gestora tem mais de 10 anos de mercado e possui participação relevante no próprio fundo?",
          "Histórico de Emissões: As últimas emissões foram feitas acima ou no Valor Patrimonial (evitando a diluição injusta do cotista)?",
          "Transparência: Os relatórios mensais são detalhados, frequentes e fáceis de entender para um investidor comum?",
          "Liquidez de Mercado: O volume médio de negociação diária é superior a R$ 1 milhão (garante saída em caso de emergência)?",
        ],
      },
      {
        name: "Estrutura Financeira",
        description:
          "Mede o preço justo, a eficiência operacional e o controle de dívidas internas.",
        questions: [
          "Preço Justo (P/VPA): O fundo está sendo negociado em patamar aceitável? (Papel/Infra < 1,05; Tijolo próximo ao custo de reposição)?",
          "Controle de Alavancagem: A dívida interna do fundo (se houver) é inferior a 20% do patrimônio e tem prazos confortáveis?",
          "Taxas de Administração: O custo total (Adm + Gestão) é competitivo e menor que 1,2% ao ano?",
          "Proteção Real: Os contratos (Tijolo) ou ativos (Papel/Infra) possuem indexadores que protegem contra a inflação (IPCA/IGP-M)?",
        ],
      },
      {
        name: "Resiliência e Escudo",
        description:
          "Foca na previsibilidade de longo prazo e na capacidade de resistir a crises.",
        questions: [
          "Histórico de Vacância/Inadimplência: A vacância física (Tijolo) ou atrasos nos pagamentos (Papel) são historicamente menores que 10%?",
          "Duração dos Contratos (Duration): O prazo médio dos contratos de aluguel ou vencimento das dívidas é superior a 5 anos?",
          "Consistência de Dividendos: O fundo manteve pagamentos regulares mesmo em períodos de estresse econômico ou pandemia?",
        ],
      },
    ],
  },
  {
    category: "Stock",
    categories: [
      {
        name: "Dominância e Fosso Econômico (Moat)",
        description:
          "Avalia se a empresa possui uma vantagem competitiva inalcançável e escala global.",
        questions: [
          "Liderança Global: A empresa é líder ou top 3 em seu segmento em escala mundial?",
          "Fosso Econômico (Moat): A empresa possui marca forte, patentes ou efeito de rede que impede a entrada de concorrentes?",
          "Receita Diversificada: A receita provém de múltiplos países, não dependendo exclusivamente da economia americana?",
          "Poder de Preço (Pricing Power): A empresa consegue repassar a inflação para seus preços sem perder volume de vendas?",
        ],
      },
      {
        name: "Eficiência e Geração de Caixa",
        description:
          "Foca no padrão ouro de rentabilidade americana e no fluxo de caixa livre.",
        questions: [
          "Free Cash Flow (FCF): A empresa é uma máquina de gerar caixa livre (caixa operacional menos investimentos) positivo e crescente?",
          "Retorno sobre Capital (ROIC): O ROIC é consistentemente superior a 15% (padrão de excelência global)?",
          "Margens Robustas: A Margem Líquida é superior a 10% e estável mesmo com o aumento de custos de produção?",
          "Crescimento Histórico: A Receita (Revenue) e o Lucro por Ação (EPS) cresceram em média mais de 7% ao ano nos últimos 5 anos?",
        ],
      },
      {
        name: "Saúde Financeira e Alinhamento",
        description:
          "Mede o risco de crédito e como a empresa devolve valor ao acionista.",
        questions: [
          "Relação Dívida/EBITDA: A dívida líquida é inferior a 2,5x o EBITDA (ou o Net Debt/FCF é saudável)?",
          "Recompra de Ações (Buybacks): A empresa possui um histórico de recomprar e cancelar ações, aumentando sua participação como sócio?",
          "Cultura de Dividendos: Se paga dividendos, o histórico é crescente (Dividend Aristocrats) e o Payout é sustentável?",
          "Qualidade da Gestão: O CEO e a diretoria possuem histórico de boa alocação de capital e transparência com o mercado?",
        ],
      },
      {
        name: "Resiliência e Perenidade",
        description:
          "O escudo contra a obsolescência tecnológica e crises globais.",
        questions: [
          "P&D e Inovação: A empresa investe uma porcentagem relevante da receita em Pesquisa e Desenvolvimento para evitar a obsolescência?",
          "Sobrevivência a Ciclos: A empresa passou por crises globais (2000, 2008, 2020) sem comprometer sua estrutura de capital?",
          "Risco Regulatório/Antitruste: A empresa possui baixo risco de ser desmembrada ou severamente multada por órgãos reguladores?",
        ],
      },
    ],
  },
];

export function getQuestions(category: string) {
  return questions.find((q) => q.category === category);
}
