import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import Card from "@/shared/components/Card/Card";
import { API_CONFIG, buildApiUrl } from "@/config/api";
import "./docentes.scss";

type Docente = {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  institucion_id?: number | null;
  institucion?: { nombre?: string } | null;
  estado?: boolean;
};

export default function Docentes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const userType = localStorage.getItem("userType");
  const isAdmin = userType === "admin";

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [institucionesMap, setInstitucionesMap] = useState<Record<number, string>>({});
  const [institucionFilter, setInstitucionFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    institucion_id: ""
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  const [editForm, setEditForm] = useState<Docente | null>(null);
  const [editingError, setEditingError] = useState<string | null>(null);
  const [editingSaving, setEditingSaving] = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/tipo-usuario");
      return;
    }

    const loadInstituciones = async () => {
      try {
        const instResp = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES));
        if (!instResp.ok) return;
        const instData = await instResp.json();
        const list: Array<{ id: number; nombre: string }> =
          instData?.data?.instituciones || instData?.data || [];
        const map: Record<number, string> = {};
        list.forEach((i) => (map[i.id] = i.nombre));
        setInstitucionesMap(map);
      } catch {
        // ignore
      }
    };

    const fetchDocentes = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          institucionFilter ? `/usuarios/docentes?institucion_id=${encodeURIComponent(institucionFilter)}` : "/usuarios/docentes";
        const resp = await fetch(buildApiUrl(endpoint), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Error al cargar docentes");
        }
        const json = await resp.json();
        const list: Docente[] = json?.data?.docentes || [];
        setDocentes(list);
      } catch (e: any) {
        setError(e?.message || "Error al cargar docentes");
      } finally {
        setLoading(false);
      }
    };

    loadInstituciones();
    fetchDocentes();
  }, [navigate, token, isAdmin, institucionFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return docentes;
    return docentes.filter((d) => `${d.nombre} ${d.correo}`.toLowerCase().includes(q));
  }, [docentes, search]);

  const handleBack = () => navigate("/perfil/admin");

  const handleCreate = async () => {
    setCreateError(null);
    setCreating(true);
    try {
      const resp = await fetch(buildApiUrl("/usuarios/docentes"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: createForm.nombre,
          correo: createForm.correo,
          contrasena: createForm.contrasena,
          institucion_id: Number(createForm.institucion_id),
        }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al crear docente");
      const json = JSON.parse(text);
      const docenteCreado: Docente | null = json?.data || null;
      if (docenteCreado) setDocentes((prev) => [docenteCreado, ...prev]);
      setShowCreate(false);
      setCreateForm({ nombre: "", correo: "", contrasena: "", institucion_id: "" });
    } catch (e: any) {
      setCreateError(e?.message || "Error al crear docente");
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (docente: Docente) => {
    setEditingDocente(docente);
    setEditForm({ ...docente });
    setEditingError(null);
  };

  const handleEditFormChange = (field: keyof Docente, value: any) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      [field]: value,
    });
  };

  const handleEditConfirm = () => setConfirmingSave(true);

  const handleEditSave = async () => {
    if (!editingDocente || !editForm) return;
    setEditingSaving(true);
    setEditingError(null);
    try {
      const resp = await fetch(buildApiUrl(`/usuarios/${editingDocente.id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editForm.nombre,
          correo: editForm.correo,
          institucion_id: editForm.institucion_id,
          estado: editForm.estado,
        }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al actualizar docente");
      const json = JSON.parse(text);
      const actualizado: Docente | null = json?.data || null;
      setDocentes((prev) =>
        prev.map((d) => (d.id === editingDocente.id ? (actualizado || editForm) : d))
      );
      setEditingDocente(null);
      setEditForm(null);
      setConfirmingSave(false);
    } catch (e: any) {
      setEditingError(e?.message || "Error al guardar cambios");
    } finally {
      setEditingSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditingDocente(null);
    setEditForm(null);
    setEditingError(null);
    setConfirmingSave(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteError(null);
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId == null) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const resp = await fetch(buildApiUrl(`/usuarios/${deletingId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al eliminar docente");
      setDocentes((prev) => prev.filter((d) => d.id !== deletingId));
      setDeletingId(null);
    } catch (e: any) {
      setDeleteError(e?.message || "Error al eliminar docente");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="docentes-page">
      <Header />
      <div className="docentes-container">
        <button className="docentes-back-btn" onClick={handleBack}>
          ← Volver
        </button>

        <Card className="docentes-card">
          <div className="docentes-header">
            <h2 className="docentes-title">Listado de Docentes</h2>
            <div className="docentes-actions">
              <button className="docentes-btn" onClick={() => setShowFilters((v) => !v)}>
                {showFilters ? "Ocultar filtros" : "Filtros"}
              </button>
              <button className="docentes-btn docentes-btn--primary" onClick={() => setShowCreate(true)}>
                + Añadir docente
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="docentes-filters">
              <input
                className="docentes-search"
                placeholder="Buscar por nombre o correo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="docentes-select"
                value={institucionFilter}
                onChange={(e) => setInstitucionFilter(e.target.value)}
              >
                <option value="">Todas las instituciones</option>
                {Object.entries(institucionesMap).map(([id, nombre]) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && <p>Cargando docentes...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="docentes-list">
              {filtered.length === 0 && <p>No hay docentes registrados.</p>}
              {filtered.length > 0 && (
                <table className="docentes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Institución</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <tr key={d.id}>
                        <td data-label="ID">{d.id}</td>
                        <td data-label="Nombre">{d.nombre}</td>
                        <td data-label="Correo">{d.correo}</td>
                        <td data-label="Institución">{d.institucion?.nombre ?? (d.institucion_id ? (institucionesMap[d.institucion_id] ?? "-") : "-")}</td>
                        <td data-label="Estado">{d.estado ? "Activo" : "Inactivo"}</td>
                        <td data-label="Acciones">
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-edit-icon"
                              onClick={() => handleEditClick(d)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon btn-delete-icon"
                              onClick={() => handleDeleteClick(d.id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
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
                <h3>Crear Docente</h3>
                {createError && <p className="error">{createError}</p>}

                <div className="create-form">
                  <label>Nombre</label>
                  <input
                    value={createForm.nombre}
                    onChange={(e) => setCreateForm((p) => ({ ...p, nombre: e.target.value }))}
                    className="docentes-input"
                  />
                  <label>Correo</label>
                  <input
                    type="email"
                    value={createForm.correo}
                    onChange={(e) => setCreateForm((p) => ({ ...p, correo: e.target.value }))}
                    className="docentes-input"
                  />
                  <label>Contraseña temporal</label>
                  <input
                    type="text"
                    value={createForm.contrasena}
                    onChange={(e) => setCreateForm((p) => ({ ...p, contrasena: e.target.value }))}
                    className="docentes-input"
                  />
                  <label>Institución</label>
                  <select
                    value={createForm.institucion_id}
                    onChange={(e) => setCreateForm((p) => ({ ...p, institucion_id: e.target.value }))}
                    className="docentes-select"
                  >
                    <option value="">Selecciona institución</option>
                    {Object.entries(institucionesMap).map(([id, nombre]) => (
                      <option key={id} value={id}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button className="docentes-btn docentes-btn--primary" onClick={handleCreate} disabled={creating}>
                    {creating ? "Creando..." : "Crear"}
                  </button>
                  <button className="docentes-btn" onClick={() => setShowCreate(false)} disabled={creating}>
                    Cancelar
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {editingDocente && editForm && (
          <div className="modal-overlay" onClick={handleEditCancel}>
            <div onClick={(e) => e.stopPropagation()}>
              <Card className="modal-content">
                <h3>Editar Docente</h3>
                {editingError && <p className="error">{editingError}</p>}
                <div className="create-form">
                  <label>Nombre</label>
                  <input
                    className="docentes-input"
                    value={editForm.nombre}
                    onChange={(e) => handleEditFormChange("nombre", e.target.value)}
                  />
                  <label>Correo</label>
                  <input
                    className="docentes-input"
                    type="email"
                    value={editForm.correo}
                    onChange={(e) => handleEditFormChange("correo", e.target.value)}
                  />
                  <label>Institución</label>
                  <select
                    className="docentes-select"
                    value={editForm.institucion_id ?? ""}
                    onChange={(e) =>
                      handleEditFormChange("institucion_id", e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">Selecciona institución</option>
                    {Object.entries(institucionesMap).map(([id, nombre]) => (
                      <option key={id} value={id}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                  <label>Estado</label>
                  <select
                    className="docentes-select"
                    value={editForm.estado ? "1" : "0"}
                    onChange={(e) => handleEditFormChange("estado", e.target.value === "1")}
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    className="docentes-btn docentes-btn--primary"
                    onClick={handleEditConfirm}
                    disabled={editingSaving}
                  >
                    Guardar cambios
                  </button>
                  <button className="docentes-btn" onClick={handleEditCancel} disabled={editingSaving}>
                    Cancelar
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {confirmingSave && editForm && editingDocente && (
          <div className="modal-overlay" onClick={() => setConfirmingSave(false)}>
            <Card className="modal-content modal-confirm" onClick={() => {}}>
              <div onClick={(e) => e.stopPropagation()}>
                <h3>¿Confirmar cambios?</h3>
                <p>
                  ¿Estás seguro de que deseas guardar los cambios para{" "}
                  <strong>{editForm.nombre}</strong>?
                </p>
                <div className="modal-actions">
                  <button
                    className="docentes-btn docentes-btn--primary"
                    onClick={handleEditSave}
                    disabled={editingSaving}
                  >
                    {editingSaving ? "Guardando..." : "Sí, guardar"}
                  </button>
                  <button
                    className="docentes-btn"
                    onClick={() => setConfirmingSave(false)}
                    disabled={editingSaving}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {deletingId !== null && (
          <div className="modal-overlay" onClick={handleDeleteCancel}>
            <Card className="modal-content modal-confirm" onClick={() => {}}>
              <div onClick={(e) => e.stopPropagation()}>
                <h3>⚠️ Eliminar Docente</h3>
                <p>¿Estás seguro de que deseas eliminar este docente? Esta acción no se puede deshacer.</p>
                {deleteError && <p className="error">{deleteError}</p>}
                <div className="modal-actions">
                  <button
                    className="docentes-btn docentes-btn--primary"
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Eliminando..." : "Sí, eliminar"}
                  </button>
                  <button
                    className="docentes-btn"
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

