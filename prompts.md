# Registro de uso de IA · AlertaEnchente (Mobile)

> Global Solution 2026.2 · FIAP · Engenharia de Software (3º ano)
> Conforme os combinados da GS, a IA foi usada como **copiloto**: para aprender, estruturar e revisar. As decisões, os testes e a validação final foram da equipe, e todos os integrantes sabem explicar cada parte do código.

## Visão geral

| Item | Detalhe |
|---|---|
| Ferramenta | Claude (Anthropic) |
| Papel da IA | Apoio na estrutura das telas, na revisão de acessibilidade e no tratamento de erros |
| Papel da equipe | Definir o problema e o público, desenhar a jornada do morador, revisar cada trecho, testar no celular e validar a entrega |
| Dados usados nas conversas | Somente fictícios (regiões e níveis de córrego de demonstração). Nenhum dado pessoal real foi enviado à IA |
| IA dentro do produto | Não há: o app não chama nenhum modelo de IA em tempo de execução |

Como ler as tabelas: a coluna **Prompt** traz um resumo fiel do que foi pedido, e a coluna **Resultado e validação** mostra o que a equipe fez com a resposta.

---

## Etapa 1 · Desenvolvimento do app

| # | Objetivo | Prompt (resumo fiel) | Resultado e validação pela equipe |
|---|---|---|---|
| 1 | Planejar a estrutura do app | Análise dos requisitos da Global Solution e apoio na definição da estrutura inicial do aplicativo AlertaEnchente, considerando as telas necessárias, navegação e funcionalidades principais. | Estrutura inicial do projeto organizada, com definição das telas principais e separação dos componentes para facilitar o desenvolvimento. |
| 2 | Desenvolver as telas principais | Apoio na criação das telas de monitoramento de enchentes, seleção de regiões, visualização dos níveis dos córregos e apresentação das informações de risco ao morador. | Telas implementadas com componentes reutilizáveis e informações de demonstração para validar a apresentação dos dados. |
| 3 | Implementar navegação e funcionalidades | Orientação para implementar a navegação entre as telas, permitindo ao usuário selecionar uma região, consultar detalhes dos riscos e salvar informações para consulta posterior. | Fluxo de navegação desenvolvido e funcionalidades de consulta e salvamento integradas, com testes manuais da jornada do usuário. |
| 4 | Integrar API e armazenamento local | Apoio na implementação do consumo de uma API para obter informações das regiões e níveis dos córregos, além de armazenamento local para manter os registros salvos no Histórico. | Integração com a API e persistência local implementadas, com utilização de dados fictícios para demonstração e validação do funcionamento. |
| 5 | Melhorar experiência e acessibilidade | Revisão da experiência do usuário, com sugestões para melhorar mensagens de erro, estados de carregamento, acessibilidade dos componentes e facilidade de uso em situações de risco. | Ajustes de interface e acessibilidade realizados pela equipe, com revisão dos textos, componentes e comportamento das telas em diferentes cenários. |

---

## Etapa 2 · Revisão final antes da entrega (18/11/2026)

| # | Objetivo | Prompt (resumo fiel) | Resultado e validação pela equipe |
|---|---|---|---|
| 1 | Auditar a entrega | Avaliação do repositório contra os critérios de Mobile da GS: telas e navegação, consumo de dados, banco de dados, acessibilidade, aderência ao problema e vídeo. | Lista de pontos: API sem tempo limite (a tela podia ficar carregando para sempre), botão "Salvar" desabilitado sem explicar o motivo, telefones de emergência só como texto, "Como rodar" com passos errados, sobras do template do Expo e 3 erros de TypeScript. |
| 2 | Corrigir e melhorar | Pedido para corrigir todos os pontos encontrados e buscar a nota máxima, sem mudar a ideia original do app. | Correções revisadas pela equipe: timeout de 6 s e validação da resposta da API, mensagem dizendo exatamente o que falta preencher, confirmação de salvo com atalho para o Histórico, botões que ligam para 199, 193 e 192, tratamento de erro no Histórico, rótulos completos para leitores de tela e README refeito. |
| 3 | Comprovar | Execução real do app no navegador e testes da jornada completa do morador. | `npm run typecheck` sem erros, build web de todas as telas e jornada testada: trocar região, abrir detalhes, salvar sem preencher, salvar, ver no Histórico depois de recarregar e confirmar antes de apagar. Com a API fora do ar, o app caiu nos dados de demonstração e avisou na tela. |
| 4 | Planejar o vídeo | Roteiro de narração de até 3 minutos, com cada fala ligada a um critério da rubrica. | Roteiro de 20 falas; a narração foi gravada pela equipe e o vídeo conferido tela a tela. |

---

## Compromissos da equipe

- Nenhum código foi aceito sem leitura e entendimento por parte da equipe.
- Toda correção foi testada no app rodando antes de entrar no repositório.
- Nenhum dado pessoal real foi usado: nem nas conversas com a IA, nem nos testes, nem nos prints.
- O endereço da API fica no `.env` local, fora do Git (há um `.env.example` de modelo).
