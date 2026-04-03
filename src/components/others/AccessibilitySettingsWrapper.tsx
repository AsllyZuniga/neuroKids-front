import { useState } from "react";
import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import {
  AccessibilityFontProvider,
  type AccessibilityFontSizeOption,
} from "@/contexts/AccessibilityFontContext";

type FontSizeOption = AccessibilityFontSizeOption;

const PASTEL_BACKGROUNDS: string[] = [
  "linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)", // crema suave
  "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", // azul pastel
  "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)", // verde pastel
  "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)", // lila pastel
  "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)", // amarillo muy suave
];

interface AccessibilitySettingsWrapperProps {
  children: ReactNode;
  /** Fondo por defecto del juego/lectura si el usuario no ha elegido otro */
  defaultBackground?: string;
}

export function AccessibilitySettingsWrapper({
  children,
  defaultBackground,
}: AccessibilitySettingsWrapperProps) {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>("base");
  const [background, setBackground] = useState<string>(
    defaultBackground || PASTEL_BACKGROUNDS[1]
  );

  return (
    <AccessibilityFontProvider value={{ fontSize }}>
    <div
      className="min-h-screen p-4 sm:p-6 relative overflow-hidden"
      style={{ background }}
    >
      {/* Botón + panel: alineado a la derecha, ~altura del AnimalGuide (debajo de header + barra de progreso) */}
      <div className="absolute top-36 right-4 z-40 flex flex-col items-end gap-2 sm:top-40 sm:right-6 md:top-44">
        <button
          type="button"
          aria-label="Configuración de accesibilidad"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-md border border-neutral-300 text-neutral-900 hover:bg-white hover:border-neutral-400 transition-colors shrink-0"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Settings
            className="w-5 h-5 shrink-0 text-neutral-900"
            strokeWidth={2}
            aria-hidden
          />
        </button>

        {open && (
        <div
          className="w-64 rounded-2xl bg-white/95 shadow-xl border border-purple-100 p-4 space-y-4"
          style={{ fontSize: 13 }}
        >
          <h2 className="font-semibold text-purple-700" style={{ fontSize: 13 }}>
            Ajustes para leer mejor
          </h2>

          {/* Tamaño de letra — controles en px para que no hereden el rem global */}
          <div className="space-y-2">
            <p className="text-gray-700" style={{ fontSize: 12 }}>
              Tamaño de letra
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFontSize("base")}
                className={`flex-1 py-1 rounded-full border transition-colors ${
                  fontSize === "base"
                    ? "bg-purple-100 border-purple-400 text-purple-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontSize: 12, padding: "0.25rem 0.5rem" }}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                className={`flex-1 py-1 rounded-full border transition-colors ${
                  fontSize === "large"
                    ? "bg-purple-100 border-purple-400 text-purple-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontSize: 12, padding: "0.25rem 0.5rem" }}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize("xlarge")}
                className={`flex-1 py-1 rounded-full border transition-colors ${
                  fontSize === "xlarge"
                    ? "bg-purple-100 border-purple-400 text-purple-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontSize: 12, padding: "0.25rem 0.5rem" }}
              >
                A++
              </button>
            </div>
          </div>

          {/* Fondos pastel */}
          <div className="space-y-2">
            <p className="text-gray-700" style={{ fontSize: 12 }}>
              Fondo para leer mejor
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {PASTEL_BACKGROUNDS.map((bg, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Fondo ${index + 1}`}
                  onClick={() => setBackground(bg)}
                  className={`h-7 rounded-full border transition-transform ${
                    background === bg
                      ? "border-purple-500 scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ background: bg }}
                />
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Solo aquí aplica el escalado tipográfico (.nk-a11y-scope); el panel y el botón quedan fuera */}
      <div
        className="relative z-10 nk-a11y-scope"
        data-a11y-font={fontSize}
      >
        {children}
      </div>
    </div>
    </AccessibilityFontProvider>
  );
}

