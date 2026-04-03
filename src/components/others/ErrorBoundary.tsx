import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const msg = this.state.error.message || "Error inesperado";
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: '"OpenDyslexic"',
            background: "linear-gradient(to bottom right, #f3e8ff, #dbeafe)",
            color: "#1e293b",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Algo salió mal al cargar esta pantalla
          </h1>
          <p style={{ maxWidth: "28rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
            Puedes intentar recargar la página o volver al inicio. Si el problema continúa,
            revisa la consola del navegador (F12) para más detalle.
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              maxWidth: "32rem",
              wordBreak: "break-word",
              marginBottom: "1.5rem",
            }}
          >
            {msg}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#7c3aed",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Recargar página
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.5rem",
                border: "1px solid #94a3b8",
                background: "#fff",
                color: "#334155",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ir al inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
