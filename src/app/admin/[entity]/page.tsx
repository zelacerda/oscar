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

function buildLabel(item: Record<string, unknown>, labelField: string | string[]): string {
  const fields = Array.isArray(labelField) ? labelField : [labelField];
  return fields.map((f) => getNestedValue(item, f)).join(" — ");
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

  const [relationOptions, setRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

  useEffect(() => {
    const relationFields = fields.filter((f) => f.type === "relation" && f.relation);
    Promise.all(
      relationFields.map(async (f) => {
        const res = await fetch(f.relation!.apiPath);
        const data: Record<string, unknown>[] = await res.json();
        return {
          name: f.name,
          options: data.map((item) => ({
            value: item.id as string,
            label: buildLabel(item, f.relation!.labelField),
          })),
        };
      })
    ).then((results) => {
      const opts: Record<string, { value: string; label: string }[]> = {};
      results.forEach((r) => {
        opts[r.name] = r.options;
      });
      setRelationOptions(opts);
    });
  }, [fields]);

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

  function renderField(field: FieldConfig) {
    if (field.type === "select") {
      return (
        <select
          value={formData[field.name]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
          }
          className="admin-input"
          required={field.required}
        >
          <option value="">Selecione...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "relation") {
      const options = relationOptions[field.name] ?? [];
      return (
        <select
          value={formData[field.name]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
          }
          className="admin-input"
          required={field.required}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        value={formData[field.name]}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
        }
        className="admin-input"
        required={field.required}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="admin-card p-6 w-full max-w-md mx-4">
        <h3 className="admin-heading text-lg mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-oscar-text-primary mb-1">
                {field.label}
              </label>
              {renderField(field)}
              {field.helpText && (
                <p className="text-xs text-oscar-text-muted mt-1">{field.helpText}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
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
    const res = await fetch(config.apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(`Eita, deu ruim ao criar: ${err?.error || res.statusText}`);
      return;
    }
    setShowForm(false);
    fetchItems();
  }

  async function handleUpdate(data: Record<string, unknown>) {
    const res = await fetch(`${config.apiPath}/${editingItem?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(`Eita, deu ruim ao atualizar: ${err?.error || res.statusText}`);
      return;
    }
    setEditingItem(null);
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que quer apagar isso? Não tem volta!")) return;
    await fetch(`${config.apiPath}/${id}`, { method: "DELETE" });
    fetchItems();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="admin-heading text-2xl">{config.name}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="admin-btn-primary"
        >
          + Novo
        </button>
      </div>
      <p className="text-oscar-text-secondary text-sm mb-6">{config.description}</p>

      {loading ? (
        <p className="text-oscar-text-muted">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-oscar-text-muted">Nenhum registro encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                {config.columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id as string}>
                  <td className="font-mono text-oscar-text-muted">
                    {(item.id as string).slice(0, 8)}...
                  </td>
                  {config.columns.map((col) => (
                    <td key={col}>{getNestedValue(item, col)}</td>
                  ))}
                  <td className="text-right space-x-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-sm text-oscar-gold-dark hover:text-oscar-gold font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id as string)}
                      className="text-sm text-oscar-danger hover:text-oscar-danger/80 font-medium"
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
