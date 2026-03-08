export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "datetime-local" | "relation";
  options?: { value: string; label: string }[];
  required?: boolean;
  relation?: {
    apiPath: string;
    labelField: string | string[];
  };
};

export type EntityConfig = {
  name: string;
  apiPath: string;
  fields: FieldConfig[];
  columns: string[];
};

export const entityConfigs: Record<string, EntityConfig> = {
  users: {
    name: "Users",
    apiPath: "/api/users",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "password", label: "Senha", type: "password", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: [
          { value: "USER", label: "User" },
          { value: "ADMIN", label: "Admin" },
        ],
      },
    ],
    columns: ["name", "email", "role", "createdAt"],
  },
  pools: {
    name: "Pools",
    apiPath: "/api/pools",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "year", label: "Ano", type: "number", required: true },
      { name: "lockDate", label: "Data de Bloqueio", type: "datetime-local", required: true },
      {
        name: "adminId",
        label: "Admin",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/users", labelField: ["name", "email"] },
      },
    ],
    columns: ["name", "year", "lockDate", "admin.name"],
  },
  "pool-members": {
    name: "Pool Members",
    apiPath: "/api/pool-members",
    fields: [
      {
        name: "poolId",
        label: "Pool",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/pools", labelField: "name" },
      },
      {
        name: "userId",
        label: "User",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/users", labelField: ["name", "email"] },
      },
    ],
    columns: ["pool.name", "user.name", "createdAt"],
  },
  categories: {
    name: "Categories",
    apiPath: "/api/categories",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      {
        name: "tier",
        label: "Tier",
        type: "select",
        required: true,
        options: [
          { value: "GOLD", label: "Ouro (10 pts)" },
          { value: "SILVER", label: "Prata (5 pts)" },
          { value: "BRONZE", label: "Bronze (3 pts)" },
          { value: "BASE", label: "Base (1 pt)" },
        ],
      },
      { name: "year", label: "Ano", type: "number", required: true },
    ],
    columns: ["name", "tier", "year"],
  },
  nominees: {
    name: "Nominees",
    apiPath: "/api/nominees",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "movie", label: "Filme", type: "text", required: true },
      { name: "year", label: "Ano", type: "number", required: true },
      {
        name: "categoryId",
        label: "Categoria",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/categories", labelField: "name" },
      },
    ],
    columns: ["name", "movie", "year", "category.name"],
  },
  bets: {
    name: "Bets",
    apiPath: "/api/bets",
    fields: [
      {
        name: "poolMemberId",
        label: "Membro do Bolão",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/pool-members", labelField: ["user.name", "pool.name"] },
      },
      {
        name: "categoryId",
        label: "Categoria",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/categories", labelField: "name" },
      },
      {
        name: "nomineeId",
        label: "Indicado",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/nominees", labelField: ["name", "movie"] },
      },
    ],
    columns: ["poolMember.user.name", "category.name", "nominee.name", "createdAt"],
  },
  results: {
    name: "Results",
    apiPath: "/api/results",
    fields: [
      { name: "year", label: "Ano", type: "number", required: true },
      {
        name: "categoryId",
        label: "Categoria",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/categories", labelField: "name" },
      },
      {
        name: "winnerNomineeId",
        label: "Vencedor",
        type: "relation",
        required: true,
        relation: { apiPath: "/api/nominees", labelField: ["name", "movie"] },
      },
    ],
    columns: ["category.name", "winnerNominee.name", "year"],
  },
};
