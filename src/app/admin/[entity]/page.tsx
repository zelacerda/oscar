"use client";

import { use, useCallback, useEffect, useState } from "react";
import { entityConfigs, type FieldConfig } from "./entity-config";
import { notFound } from "next/navigation";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  if (value instanceof Date) return value.toLocaleString("pt-BR");
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/))
    return new Date(value).toLocaleString("pt-BR");
  return String(value ?? "—");
}

type FormModalProps = {
  fields: FieldConfig[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onClose: () => void;
  title: string;
};

function FormModal({ fields, initialData, onSubmit, onClose, title }: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      let val = initialData?.[f.name];
      if (f.type === "datetime-local" && typeof val === "string") {
        val = val.slice(0, 16);
      }
      data[f.name] = val != null ? String(val) : "";
    });
    return data;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed: Record<string, unknown> = {};
    fields.forEach((f) => {
      const val = formData[f.name];
      if (f.type === "number") parsed[f.name] = parseInt(val);
      else parsed[f.name] = val;
    });
    onSubmit(parsed);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  required={field.required}
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EntityPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = use(params);
  const config = entityConfigs[entity];

  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch(config.apiPath);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, [config.apiPath]);

  useEffect(() => {
    if (config) fetchItems();
  }, [config, fetchItems]);

  if (!config) return notFound();

  async function handleCreate(data: Record<string, unknown>) {
    await fetch(config.apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchItems();
  }

  async function handleUpdate(data: Record<string, unknown>) {
    await fetch(`${config.apiPath}/${editingItem?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingItem(null);
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await fetch(`${config.apiPath}/${id}`, { method: "DELETE" });
    fetchItems();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{config.name}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Novo
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Nenhum registro encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">ID</th>
                {config.columns.map((col) => (
                  <th key={col} className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    {col}
                  </th>
                ))}
                <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id as string} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-500 font-mono">
                    {(item.id as string).slice(0, 8)}...
                  </td>
                  {config.columns.map((col) => (
                    <td key={col} className="px-4 py-2 text-sm">
                      {getNestedValue(item, col)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id as string)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <FormModal
          title={`Novo ${config.name}`}
          fields={config.fields}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingItem && (
        <FormModal
          title={`Editar ${config.name}`}
          fields={config.fields}
          initialData={editingItem}
          onSubmit={handleUpdate}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
