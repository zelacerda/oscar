export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "select" | "datetime-local" | "relation";
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
  dependsOn?: {
    field: string;
    queryParam: string;
  };
  relation?: {
    apiPath: string;
    labelField: string | string[];
  };
};

export type ColumnConfig = {
  key: string;
  label: string;
};

export type EntityConfig = {
  name: string;
  description: string;
  apiPath: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
};

export const entityConfigs: Record<string, EntityConfig> = {
  users: {
    name: "Galera",
    description: "Todo mundo que participa dos bolões. Aqui você cadastra, edita e gerencia os usuários.",
    apiPath: "/api/users",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true, helpText: "Nome completo da pessoa" },
      { name: "email", label: "Email", type: "email", required: true, helpText: "Email pra login — tem que ser único" },
      {
        name: "role",
        label: "Papel",
        type: "select",
        helpText: "Admin pode gerenciar tudo, participante só aposta",
        options: [
          { value: "USER", label: "Participante" },
          { value: "ADMIN", label: "Administrador" },
        ],
      },
    ],
    columns: [
      { key: "name", label: "Nome" },
      { key: "email", label: "Email" },
      { key: "role", label: "Papel" },
      { key: "createdAt", label: "Criado em" },
    ],
  },
  pools: {
    name: "Bolões",
    description: "Os bolões do Oscar! Cada bolão tem um dono e uma data limite pra apostar.",
    apiPath: "/api/pools",
    fields: [
      { name: "name", label: "Nome do Bolão", type: "text", required: true, helpText: "Dá um nome criativo pro bolão!" },
      { name: "lockDate", label: "Fecha quando?", type: "datetime-local", required: true, helpText: "Depois dessa data ninguém mais consegue apostar" },
      {
        name: "adminId",
        label: "Dono do Bolão",
        type: "relation",
        required: true,
        helpText: "Quem manda nesse bolão",
        relation: { apiPath: "/api/users", labelField: ["name", "email"] },
      },
    ],
    columns: [
      { key: "name", label: "Nome" },
      { key: "lockDate", label: "Fecha em" },
      { key: "admin.name", label: "Dono" },
    ],
  },
  "pool-members": {
    name: "Membros",
    description: "Quem tá participando de qual bolão. Adicione pessoas aos bolões por aqui.",
    apiPath: "/api/pool-members",
    fields: [
      {
        name: "poolId",
        label: "Bolão",
        type: "relation",
        required: true,
        helpText: "Escolhe o bolão",
        relation: { apiPath: "/api/pools", labelField: "name" },
      },
      {
        name: "userId",
        label: "Participante",
        type: "relation",
        required: true,
        helpText: "Quem vai entrar no bolão",
        relation: { apiPath: "/api/users", labelField: ["name", "email"] },
      },
    ],
    columns: [
      { key: "pool.name", label: "Bolão" },
      { key: "user.name", label: "Participante" },
      { key: "createdAt", label: "Entrou em" },
    ],
  },
  categories: {
    name: "Categorias",
    description: "As categorias do Oscar desse ano. Cada uma tem um nível de importância que define a pontuação.",
    apiPath: "/api/categories",
    fields: [
      { name: "name", label: "Nome da Categoria", type: "text", required: true, helpText: "Ex: Melhor Filme, Melhor Diretor..." },
      {
        name: "tier",
        label: "Importância",
        type: "select",
        required: true,
        helpText: "Quanto mais importante, mais pontos vale o acerto",
        options: [
          { value: "GOLD", label: "Ouro (10 pts)" },
          { value: "SILVER", label: "Prata (5 pts)" },
          { value: "BRONZE", label: "Bronze (3 pts)" },
          { value: "BASE", label: "Base (1 pt)" },
        ],
      },
    ],
    columns: [
      { key: "name", label: "Categoria" },
      { key: "tier", label: "Importância" },
    ],
  },
  bets: {
    name: "Apostas",
    description: "As apostas de cada participante. Cada pessoa escolhe um indicado por categoria.",
    apiPath: "/api/bets",
    fields: [
      {
        name: "poolMemberId",
        label: "Quem apostou",
        type: "relation",
        required: true,
        helpText: "Membro do bolão que tá fazendo a aposta",
        relation: { apiPath: "/api/pool-members", labelField: ["user.name", "pool.name"] },
      },
      {
        name: "categoryId",
        label: "Categoria",
        type: "relation",
        required: true,
        helpText: "Categoria do Oscar",
        relation: { apiPath: "/api/categories", labelField: "name" },
      },
      {
        name: "nomineeId",
        label: "Aposta em quem?",
        type: "relation",
        required: true,
        helpText: "Indicado que essa pessoa acha que vai ganhar",
        dependsOn: { field: "categoryId", queryParam: "categoryId" },
        relation: { apiPath: "/api/nominees", labelField: ["name", "movie"] },
      },
    ],
    columns: [
      { key: "poolMember.user.name", label: "Quem" },
      { key: "category.name", label: "Categoria" },
      { key: "nominee.name", label: "Aposta" },
      { key: "createdAt", label: "Quando" },
    ],
  },
  results: {
    name: "Resultados",
    description: "Os vencedores de cada categoria. Atualize conforme os prêmios forem anunciados!",
    apiPath: "/api/results",
    fields: [
      {
        name: "categoryId",
        label: "Categoria",
        type: "relation",
        required: true,
        helpText: "Categoria que já foi anunciada",
        relation: { apiPath: "/api/categories", labelField: "name" },
      },
      {
        name: "winnerNomineeId",
        label: "E o Oscar vai pra...",
        type: "relation",
        required: true,
        helpText: "Quem levou a estatueta nessa categoria",
        dependsOn: { field: "categoryId", queryParam: "categoryId" },
        relation: { apiPath: "/api/nominees", labelField: ["name", "movie"] },
      },
    ],
    columns: [
      { key: "category.name", label: "Categoria" },
      { key: "winnerNominee.name", label: "Vencedor" },
    ],
  },
};
