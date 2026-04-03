import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import Card from "@/shared/components/Card/Card";
import { buildApiUrl } from "@/config/api";
import "./instituciones.scss";

type Institucion = {
  id: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  estado?: boolean;
};

export default function Instituciones() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const userType = localStorage.getItem("userType");
  const isAdmin = userType === "admin";

  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    estado: "1",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<Institucion | null>(null);
  const [editForm, setEditForm] = useState<Institucion | null>(null);
  const [editingError, setEditingError] = useState<string | null>(null);
  const [editingSaving, setEditingSaving] = useState(false);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/tipo-usuario");
      return;
    }

    const fetchInstituciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(buildApiUrl("/instituciones-admin"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Error al cargar instituciones");
        }
        const json = await resp.json();
        const list: Institucion[] = json?.data?.instituciones || json?.data || [];
        setInstituciones(list);
      } catch (e: any) {
        setError(e?.message || "Error al cargar instituciones");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituciones();
  }, [navigate, token, isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return instituciones;
    return instituciones.filter((i) =>
      `${i.nombre} ${i.correo || ""}`.toLowerCase().includes(q)
    );
  }, [instituciones, search]);

  const handleBack = () => navigate("/perfil/admin");

  const handleCreate = async () => {
    setCreateError(null);
    setCreating(true);
    try {
      const resp = await fetch(buildApiUrl("/instituciones-admin"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: createForm.nombre,
          direccion: createForm.direccion || null,
          telefono: createForm.telefono || null,
          correo: createForm.correo || null,
          estado: createForm.estado === "1",
        }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al crear institución");
      const json = JSON.parse(text);
      const nueva: Institucion | null = json?.data || null;
      if (nueva) setInstituciones((prev) => [nueva, ...prev]);
      setShowCreate(false);
      setCreateForm({ nombre: "", direccion: "", telefono: "", correo: "", estado: "1" });
    } catch (e: any) {
      setCreateError(e?.message || "Error al crear institución");
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (inst: Institucion) => {
    setEditing(inst);
    setEditForm({ ...inst });
    setEditingError(null);
  };

  const handleEditSave = async () => {
    if (!editing || !editForm) return;
    setEditingSaving(true);
    setEditingError(null);
    try {
      const resp = await fetch(buildApiUrl(`/instituciones-admin/${editing.id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editForm.nombre,
          direccion: editForm.direccion,
          telefono: editForm.telefono,
          correo: editForm.correo,
          estado: editForm.estado,
        }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al actualizar institución");
      const json = JSON.parse(text);
      const actualizada: Institucion | null = json?.data || null;
      setInstituciones((prev) =>
        prev.map((i) => (i.id === editing.id ? (actualizada || editForm) : i))
      );
      setEditing(null);
      setEditForm(null);
    } catch (e: any) {
      setEditingError(e?.message || "Error al actualizar institución");
    } finally {
      setEditingSaving(false);
    }
  };

  return (
    <div className="instituciones-page">
      <Header />
      <div className="instituciones-container">
        <button className="instituciones-back-btn" onClick={handleBack}>
          ← Volver
        </button>

        <Card className="instituciones-card">
          <div className="instituciones-header">
            <h2 className="instituciones-title">Instituciones</h2>
            <div className="instituciones-actions">
              <input
                className="instituciones-search"
                placeholder="Buscar por nombre o correo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="instituciones-btn instituciones-btn--primary"
                onClick={() => setShowCreate(true)}
              >
                + Añadir institución
              </button>
            </div>
          </div>

          {loading && <p>Cargando instituciones...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="instituciones-list">
              {filtered.length === 0 && <p>No hay instituciones registradas.</p>}
              {filtered.length > 0 && (
                <table className="instituciones-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((i) => (
                      <tr key={i.id}>
                        <td>{i.id}</td>
                        <td>{i.nombre}</td>
                        <td>{i.direccion ?? "-"}</td>
                        <td>{i.telefono ?? "-"}</td>
                        <td>{i.correo ?? "-"}</td>
                        <td>{i.estado ? "Activa" : "Inactiva"}</td>
                        <td>
                          <button
                            className="instituciones-btn"
                            onClick={() => handleEditClick(i)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </Card>

        {showCreate && (
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <Card className="modal-content">
                <h3>Crear Institución</h3>
                {createError && <p className="error">{createError}</p>}
                <div className="create-form">
                  <label>Nombre</label>
                  <input
                    className="instituciones-input"
                    value={createForm.nombre}
                    onChange={(e) => setCreateForm((p) => ({ ...p, nombre: e.target.value }))}
                  />
                  <label>Dirección</label>
                  <input
                    className="instituciones-input"
                    value={createForm.direccion}
                    onChange={(e) => setCreateForm((p) => ({ ...p, direccion: e.target.value }))}
                  />
                  <label>Teléfono</label>
                  <input
                    className="instituciones-input"
                    value={createForm.telefono}
                    onChange={(e) => setCreateForm((p) => ({ ...p, telefono: e.target.value }))}
                  />
                  <label>Correo</label>
                  <input
                    className="instituciones-input"
                    value={createForm.correo}
                    onChange={(e) => setCreateForm((p) => ({ ...p, correo: e.target.value }))}
                  />
                  <label>Estado</label>
                  <select
                    className="instituciones-select"
                    value={createForm.estado}
                    onChange={(e) => setCreateForm((p) => ({ ...p, estado: e.target.value }))}
                  >
                    <option value="1">Activa</option>
                    <option value="0">Inactiva</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    className="instituciones-btn instituciones-btn--primary"
                    onClick={handleCreate}
                    disabled={creating}
                  >
                    {creating ? "Creando..." : "Crear"}
                  </button>
                  <button
                    className="instituciones-btn"
                    onClick={() => setShowCreate(false)}
                    disabled={creating}
                  >
                    Cancelar
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {editing && editForm && (
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <Card className="modal-content">
                <h3>Editar Institución</h3>
                {editingError && <p className="error">{editingError}</p>}
                <div className="create-form">
                  <label>Nombre</label>
                  <input
                    className="instituciones-input"
                    value={editForm.nombre}
                    onChange={(e) =>
                      setEditForm((p) => (p ? { ...p, nombre: e.target.value } : p))
                    }
                  />
                  <label>Dirección</label>
                  <input
                    className="instituciones-input"
                    value={editForm.direccion ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => (p ? { ...p, direccion: e.target.value } : p))
                    }
                  />
                  <label>Teléfono</label>
                  <input
                    className="instituciones-input"
                    value={editForm.telefono ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => (p ? { ...p, telefono: e.target.value } : p))
                    }
                  />
                  <label>Correo</label>
                  <input
                    className="instituciones-input"
                    value={editForm.correo ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => (p ? { ...p, correo: e.target.value } : p))
                    }
                  />
                  <label>Estado</label>
                  <select
                    className="instituciones-select"
                    value={editForm.estado ? "1" : "0"}
                    onChange={(e) =>
                      setEditForm((p) =>
                        p ? { ...p, estado: e.target.value === "1" } : p
                      )
                    }
                  >
                    <option value="1">Activa</option>
                    <option value="0">Inactiva</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    className="instituciones-btn instituciones-btn--primary"
                    onClick={handleEditSave}
                    disabled={editingSaving}
                  >
                    {editingSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    className="instituciones-btn"
                    onClick={() => setEditing(null)}
                    disabled={editingSaving}
                  >
                    Cancelar
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

