import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Card from "../../shared/components/Card/Card";
import { API_CONFIG, buildApiUrl } from "../../config/api";
import "./estudiantes.scss";
import { div } from "framer-motion/m";

interface Usuario {
    id: number;
    nombre: string;
    apellido?: string;
    correo?: string;
    rol_id: number;
    institucion_id?: number;
    estado?: boolean;
    edad?: number | null;
}

export default function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [institucionesMap, setInstitucionesMap] = useState<Record<number, string>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const pageSize = 12;
    const navigate = useNavigate();
    const [edadFilter, setEdadFilter] = useState<string>("");
    const [institucionFilter, setInstitucionFilter] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);
    const [editingEstudiante, setEditingEstudiante] = useState<Usuario | null>(null);
    const [editForm, setEditForm] = useState<Usuario | null>(null);
    const [editingError, setEditingError] = useState<string | null>(null);
    const [editingSaving, setEditingSaving] = useState(false);
    const [confirmingSave, setConfirmingSave] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        const userType = localStorage.getItem("userType");
        const token = localStorage.getItem("token");
        if (userType !== "docente" || !token) {
            navigate("/tipo-usuario");
            return;
        }

        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null);
            try {
                // Obtener instituciones (endpoint público para estudiantes)
                try {
                    const instResp = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES));
                    if (instResp.ok) {
                        const instData = await instResp.json();
                        const list: Array<{ id: number; nombre: string }> = instData?.data?.instituciones || [];
                        const map: Record<number, string> = {};
                        list.forEach(i => (map[i.id] = i.nombre));
                        setInstitucionesMap(map);
                    }
                } catch (e) {
                    // No crítico: continuamos incluso si falla obtener instituciones
                    console.warn("No se pudieron cargar instituciones:", e);
                }

                const resp = await fetch(buildApiUrl("/usuarios"), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(text || "Error al obtener usuarios");
                }

                const data = await resp.json();
                const usuarios: Usuario[] = data?.data?.usuarios || [];
                // Filtrar solo estudiantes (rol_id === 3)
                const onlyStudents = usuarios.filter(u => u.rol_id === 3);
                setEstudiantes(onlyStudents);
            } catch (err: any) {
                console.error(err);
                setError(err?.message || "Error al cargar estudiantes");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [navigate]);

    const filtered = useMemo(() => {
        return estudiantes.filter((s) => {
            const fullName = `${s.nombre} ${s.apellido ?? ""}`.toLowerCase();

            const matchName =
                !searchTerm || fullName.includes(searchTerm.toLowerCase());

            const matchEdad =
                !edadFilter || String(s.edad ?? "").includes(edadFilter);

            const matchInstitucion =
                !institucionFilter || String(s.institucion_id) === institucionFilter;

            return matchName && matchEdad && matchInstitucion;
        });
    }, [estudiantes, searchTerm, edadFilter, institucionFilter]);


    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(Math.min(Math.max(1, newPage), totalPages));
    };


    const handleRefresh = () => {
        setPage(1);
        setSearchTerm("");
        setEdadFilter("");
        setInstitucionFilter("");

        // re-run effect by calling fetch inside (quick approach)
        setLoading(true);
        setTimeout(() => {
            // small delay to show loading
            window.location.reload();
        }, 200);
    };

    const handleEditClick = (estudiante: Usuario) => {
        setEditingEstudiante(estudiante);
        setEditForm(JSON.parse(JSON.stringify(estudiante))); // Deep copy
        setEditingError(null);
    };

    const handleEditFormChange = (field: keyof Usuario, value: any) => {
        if (editForm) {
            setEditForm({
                ...editForm,
                [field]: value
            });
        }
    };

    const handleEditSave = async () => {
        if (!editForm || !editingEstudiante) return;
        setEditingSaving(true);
        setEditingError(null);
        
        try {
            const resp = await fetch(buildApiUrl(`/usuarios/${editingEstudiante.id}`), {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: editForm.nombre,
                    apellido: editForm.apellido,
                    correo: editForm.correo,
                    edad: editForm.edad,
                    institucion_id: editForm.institucion_id
                })
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(text || "Error al actualizar estudiante");
            }

            // Actualizar lista local
            setEstudiantes(estudiantes.map(e => 
                e.id === editingEstudiante.id ? editForm : e
            ));

            setEditingEstudiante(null);
            setEditForm(null);
            setConfirmingSave(false);
        } catch (err: any) {
            console.error(err);
            setEditingError(err?.message || "Error al guardar cambios");
        } finally {
            setEditingSaving(false);
        }
    };

    const handleEditConfirm = () => {
        setConfirmingSave(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        setDeleteLoading(true);
        setDeleteError(null);

        try {
            const resp = await fetch(buildApiUrl(`/usuarios/${deletingId}`), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(text || "Error al eliminar estudiante");
            }

            // Actualizar lista local
            setEstudiantes(estudiantes.filter(e => e.id !== deletingId));
            setDeletingId(null);
        } catch (err: any) {
            console.error(err);
            setDeleteError(err?.message || "Error al eliminar estudiante");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeletingId(null);
        setDeleteError(null);
    };

    const handleEditCancel = () => {
        setEditingEstudiante(null);
        setEditForm(null);
        setEditingError(null);
    };

    return (
        <div className="estudiantes-page">
            <Header />
            <div className="estudiantes-container">
                <Card className="estudiantes-card">
                    <div className="estudiantes-header">
                        <h2 className="estudiantes-title">Listado de Estudiantes</h2>

                        <div className="estudiantes-toolbar">
                            <div className="estudiantes-total-bar">
                                Total <strong>{filtered.length}</strong> estudiantes
                            </div>

                            <div className="estudiantes-controls">
                                <input
                                    placeholder="Buscar por nombre"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="estudiantes-search"
                                />

                                <button
                                    className="estudiantes-refresh"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    {showFilters ? "Ocultar filtros" : "Filtros"}
                                </button>

                                <button onClick={handleRefresh} className="estudiantes-refresh">
                                    Refrescar
                                </button>
                            </div>
                        </div>
                    </div>



                    {showFilters && (
                        <div className="estudiantes-filters-panel">


                            <input
                                placeholder="Filtrar por edad"
                                value={edadFilter}
                                onChange={(e) => {
                                    setEdadFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="estudiantes-search"
                            />

                            <select
                                value={institucionFilter}
                                onChange={(e) => {
                                    setInstitucionFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="estudiantes-pagesize"
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

                    {loading && <p>Cargando estudiantes...</p>}
                    {error && <p className="error">{error}</p>}

                    {!loading && !error && (
                        <div className="estudiantes-list">
                            {filtered.length === 0 && <p>No hay estudiantes registrados.</p>}
                            {filtered.length > 0 && (
                                <>
                                    <table className="estudiantes-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Edad</th>
                                                <th>Institución</th>
                                                <th>Correo</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((s) => (
                                                <tr key={s.id}>
                                                    <td>{s.id}</td>
                                                    <td>{s.nombre} {s.apellido ?? ""}</td>
                                                    <td>{s.edad ?? "-"}</td>
                                                    <td>{s.institucion_id ? (institucionesMap[s.institucion_id] ?? s.institucion_id) : "-"}</td>
                                                    <td>{s.correo ?? "-"}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                className="btn-icon btn-edit-icon" 
                                                                onClick={() => handleEditClick(s)}
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button 
                                                                className="btn-icon btn-delete-icon" 
                                                                onClick={() => handleDeleteClick(s.id)}
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

                                    <div className="estudiantes-pagination">
                                        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                                            Anterior
                                        </button>
                                        <span> Página {page} / {totalPages} </span>
                                        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                                            Siguiente
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </Card>

                {editingEstudiante && editForm && (
                    <div className="modal-overlay" onClick={handleEditCancel}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Card className="modal-content">
                                <h3>Editar Estudiante</h3>
                                
                                {editingError && <p className="error">{editingError}</p>}

                                <div className="edit-form">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        value={editForm.nombre || ""}
                                        onChange={(e) => handleEditFormChange("nombre", e.target.value)}
                                    />

                                    <label>Apellido</label>
                                    <input
                                        type="text"
                                        value={editForm.apellido || ""}
                                        onChange={(e) => handleEditFormChange("apellido", e.target.value)}
                                    />

                                    <label>Correo</label>
                                    <input
                                        type="email"
                                        value={editForm.correo || ""}
                                        onChange={(e) => handleEditFormChange("correo", e.target.value)}
                                    />

                                    <label>Edad</label>
                                    <input
                                        type="number"
                                        value={editForm.edad || ""}
                                        onChange={(e) => handleEditFormChange("edad", e.target.value ? Number(e.target.value) : null)}
                                    />

                                    <label>Institución</label>
                                    <select
                                        value={editForm.institucion_id || ""}
                                        onChange={(e) => handleEditFormChange("institucion_id", e.target.value ? Number(e.target.value) : undefined)}
                                    >
                                        <option value="">Seleccionar institución</option>
                                        {Object.entries(institucionesMap).map(([id, nombre]) => (
                                            <option key={id} value={id}>
                                                {nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-actions">
                                    <button 
                                        className="btn-save" 
                                        onClick={handleEditConfirm} 
                                        disabled={editingSaving || confirmingSave}
                                    >
                                        {editingSaving ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button className="btn-cancel" onClick={handleEditCancel}>
                                        Cancelar
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {confirmingSave && editForm && editingEstudiante && (
                    <div className="modal-overlay" onClick={() => setConfirmingSave(false)}>
                        <Card className="modal-content modal-confirm" onClick={() => {}}>
                            <div onClick={(e) => e.stopPropagation()}>
                            <h3>¿Confirmar cambios?</h3>
                            <p>¿Estás seguro de que deseas guardar los cambios para <strong>{editForm.nombre} {editForm.apellido}</strong>?</p>
                            <div className="modal-actions">
                                <button 
                                    className="btn-save" 
                                    onClick={handleEditSave}
                                    disabled={editingSaving}
                                >
                                    {editingSaving ? "Guardando..." : "Sí, Guardar"}
                                </button>
                                <button 
                                    className="btn-cancel" 
                                    onClick={() => setConfirmingSave(false)}
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
                            <h3>⚠️ Eliminar Estudiante</h3>
                            <p>¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.</p>
                            {deleteError && <p className="error">{deleteError}</p>}
                            <div className="modal-actions">
                                <button 
                                    className="btn-delete" 
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? "Eliminando..." : "Sí, Eliminar"}
                                </button>
                                <button 
                                    className="btn-cancel" 
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