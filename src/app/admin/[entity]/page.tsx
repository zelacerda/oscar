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
  onSubmit: (data: Record<string, unknown>) => Promise<string | null>;
  onClose: () => void;
  title: string;
};

function FormModal({ fields, initialData, onSubmit, onClose, title }: FormModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const fetchRelationOptions = useCallback(
    async (field: FieldConfig, parentValue?: string) => {
      let url = field.relation!.apiPath;
      if (field.dependsOn && parentValue) {
        url += `?${field.dependsOn.queryParam}=${parentValue}`;
      }
      const res = await fetch(url);
      const data: Record<string, unknown>[] = await res.json();
      return data.map((item) => ({
        value: item.id as string,
        label: buildLabel(item, field.relation!.labelField),
      }));
    },
    []
  );

  useEffect(() => {
    const independentFields = fields.filter(
      (f) => f.type === "relation" && f.relation && !f.dependsOn
    );
    Promise.all(
      independentFields.map(async (f) => ({
        name: f.name,
        options: await fetchRelationOptions(f),
      }))
    ).then((results) => {
      const opts: Record<string, { value: string; label: string }[]> = {};
      results.forEach((r) => {
        opts[r.name] = r.options;
      });
      setRelationOptions((prev) => ({ ...prev, ...opts }));
    });
  }, [fields, fetchRelationOptions]);

  useEffect(() => {
    const dependentFields = fields.filter(
      (f) => f.type === "relation" && f.relation && f.dependsOn
    );
    dependentFields.forEach(async (f) => {
      const parentValue = formData[f.dependsOn!.field];
      if (!parentValue) {
        setRelationOptions((prev) => ({ ...prev, [f.name]: [] }));
        return;
      }
      const options = await fetchRelationOptions(f, parentValue);
      setRelationOptions((prev) => ({ ...prev, [f.name]: options }));
    });
  }, [fields, formData, fetchRelationOptions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const parsed: Record<string, unknown> = {};
    fields.forEach((f) => {
      const val = formData[f.name];
      if (f.type === "number") parsed[f.name] = parseInt(val);
      else parsed[f.name] = val;
    });
    const err = await onSubmit(parsed);
    setSubmitting(false);
    if (err) setError(err);
  }

  function handleFieldChange(fieldName: string, value: string) {
    const dependents = fields.filter((f) => f.dependsOn?.field === fieldName);
    const updates: Record<string, string> = { [fieldName]: value };
    dependents.forEach((f) => {
      updates[f.name] = "";
    });
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  function renderField(field: FieldConfig) {
    if (field.type === "select") {
      return (
        <select
          value={formData[field.name]}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
      const isDisabled = field.dependsOn && !formData[field.dependsOn.field];
      return (
        <select
          value={formData[field.name]}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="admin-input"
          required={field.required}
          disabled={!!isDisabled}
        >
          <option value="">
            {isDisabled ? "Primeiro selecione a categoria..." : "Selecione..."}
          </option>
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
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
          {error && (
            <div className="p-3 rounded-lg bg-oscar-danger-light text-oscar-danger text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Salvar"}
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

  async function handleCreate(data: Record<string, unknown>): Promise<string | null> {
    const res = await fetch(config.apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return `Eita, deu ruim ao criar: ${err?.error || res.statusText}`;
    }
    setShowForm(false);
    fetchItems();
    return null;
  }

  async function handleUpdate(data: Record<string, unknown>): Promise<string | null> {
    const res = await fetch(`${config.apiPath}/${editingItem?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return `Eita, deu ruim ao atualizar: ${err?.error || res.statusText}`;
    }
    setEditingItem(null);
    fetchItems();
    return null;
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
