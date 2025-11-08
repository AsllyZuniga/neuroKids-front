import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiExplosion } from "../../components/others/ConfettiExplosion";
import successMp3 from "../../assets/sounds/correcto.mp3";
import Button from "../../shared/components/Button/Button";
import Card from "../../shared/components/Card/Card";
import "./studentRegister.scss";
import { API_CONFIG, buildApiUrl } from "../../config/api";

interface Institucion {
  id: number;
  nombre: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    estudiante: {
      id: number;
      nombre: string;
      apellido: string;
      codigo_estudiante: string;
      edad: number;
      num_documento?: string;
      correo?: string;
      institucion_id: number;
      institucion: string;
      estado: boolean;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
}

interface InstitucionesResponse {
  success: boolean;
  data?: {
    instituciones: Institucion[];
  };
}

type RegistrationStep = 
  | 'welcome'
  | 'withParent'
  | 'studentName'
  | 'studentAge'
  | 'studentSchool'
  | 'parentDocument'
  | 'parentEmail'
  | 'confirm';

export default function StudentRegister() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('welcome');
  const [withParent, setWithParent] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    num_documento: "",
    correo: "",
    institucion_id: ""
  });
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const successSfx = useRef<HTMLAudioElement | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const navigate = useNavigate();

  // Soft synthesized click using Web Audio API (non-intrusive)
  const playClick = () => {
    try {
      if (!audioCtx.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx.current = new AC();
      }
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800; // gentle frequency
      gain.gain.setValueAtTime(0.05, ctx.currentTime); // very low volume
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignorar errores
    }
  };

  const playSuccess = () => {
    try {
      if (!successSfx.current) successSfx.current = new Audio(successMp3);
      successSfx.current.play().catch(() => {});
    } catch {
      // Ignorar errores de reproducción
    }
  };

  const fetchInstituciones = async () => {
    setLoadingInstituciones(true);
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("HTTP error status: " + response.status);
      }
      
      const data: InstitucionesResponse = await response.json();
      
      if (data.success && data.data) {
        setInstituciones(data.data.instituciones);
      } else {
        setError("Error al cargar las escuelas disponibles");
      }
    } catch (err) {
      console.error("Error al cargar instituciones:", err);
      setError("Error de conexión al cargar las escuelas.");
    } finally {
      setLoadingInstituciones(false);
    }
  };

  const handleParentChoice = (choice: boolean) => {
    playClick();
    setWithParent(choice);
    setError("");
    setCurrentStep('studentName');
  };

  const handleInputChange = (value: string, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'studentName':
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
          setError("Por favor ingresa nombre y apellido");
          return false;
        }
        break;
      case 'studentAge':
        // La edad es obligatoria solo si está con un adulto. Si está solo puede omitirla.
        if (withParent) {
          if (!formData.edad || parseInt(formData.edad) < 7 || parseInt(formData.edad) > 18) {
            setError("Por favor ingresa una edad válida (7-18 años)");
            return false;
          }
        } else if (formData.edad) {
          // Si la ingresó voluntariamente, validar rango
            if (parseInt(formData.edad) < 7 || parseInt(formData.edad) > 18) {
              setError("La edad debe estar entre 7 y 18 años o déjala en blanco si no la recuerdas");
              return false;
            }
        }
        break;
      case 'studentSchool':
        if (!formData.institucion_id) {
          setError("Por favor selecciona una escuela");
          return false;
        }
        break;
      case 'parentDocument':
        if (withParent && !formData.num_documento.trim()) {
          setError("Por favor ingresa el número de documento");
          return false;
        }
        break;
      case 'parentEmail':
        if (withParent && !formData.correo.trim()) {
          setError("Por favor ingresa el correo electrónico");
          return false;
        }
        if (withParent && formData.correo && !formData.correo.includes('@')) {
          setError("Por favor ingresa un correo válido");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    playClick();
    if (!validateCurrentStep()) return;

    const stepFlow: Record<RegistrationStep, RegistrationStep> = {
      welcome: 'withParent',
      withParent: 'studentName',
      studentName: 'studentAge',
      studentAge: 'studentSchool',
      studentSchool: withParent ? 'parentDocument' : 'confirm',
      parentDocument: 'parentEmail',
      parentEmail: 'confirm',
      confirm: 'confirm'
    };

    const nextStep = stepFlow[currentStep];
    
    if (nextStep === 'studentSchool' && instituciones.length === 0) {
      fetchInstituciones();
    }

    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    playClick();
    const backFlow: Record<RegistrationStep, RegistrationStep> = {
      welcome: 'welcome',
      withParent: 'welcome',
      studentName: 'withParent',
      studentAge: 'studentName',
      studentSchool: 'studentAge',
      parentDocument: 'studentSchool',
      parentEmail: 'parentDocument',
      confirm: withParent ? 'parentEmail' : 'studentSchool'
    };

    setCurrentStep(backFlow[currentStep]);
    setError("");
  };

  const handleSubmit = async () => {
    playClick();
    setLoading(true);
    setError("");


    try {
      // Solo enviar los campos requeridos por el backend

      // Enviar los campos en el orden esperado por el backend
      const requestData: Record<string, string | number | boolean> = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        institucion_id: parseInt(formData.institucion_id)
      };

      // Incluir edad solo si existe (estudiante solo puede omitirla)
      if (formData.edad) {
        requestData.edad = parseInt(formData.edad);
      }

      if (withParent) {
        requestData.con_padres = true; // necesario para que backend aplique required_if
        requestData.num_documento = formData.num_documento.trim();
        requestData.correo = formData.correo.trim();
      }

      console.log("Payload registro (keys)", Object.keys(requestData));
      console.log("Datos enviados al registro:", requestData);

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData)
      });

      let parsed: unknown = null;
      try {
        parsed = await response.json();
      } catch {
        // Si no es JSON, dejamos parsed como null
      }

      if (!response.ok) {
        // Manejo de errores 4xx/5xx
        let message: string | undefined;
        if (parsed && typeof parsed === 'object') {
          const p = parsed as { message?: string; errors?: Record<string, unknown>; error?: string };
          if (p.errors && typeof p.errors === 'object') {
            const values = Object.values(p.errors);
            const first = Array.isArray(values[0]) ? (values[0] as unknown[])[0] : values[0];
            message = (first as string) || p.message || p.error;
          } else {
            message = p.message || p.error;
          }
        }
        setError(message || `Error del servidor (${response.status}).`);
        setLoading(false);
        return;
      }

      const data = parsed as RegisterResponse;

      if (data?.success && data?.data) {
        // Celebrate!
        setShowConfetti(true);
        playSuccess();
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.estudiante));
        localStorage.setItem("userType", "estudiante");
        
        setTimeout(() => {
          navigate("/bienvenida/estudiante");
        }, 800);
      } else {
        setError(data?.message || "Error al crear la cuenta");
        setLoading(false);
      }
    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
      console.error("Error de registro:", err);
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    const steps: RegistrationStep[] = withParent 
      ? ['welcome', 'withParent', 'studentName', 'studentAge', 'studentSchool', 'parentDocument', 'parentEmail', 'confirm']
      : ['welcome', 'withParent', 'studentName', 'studentAge', 'studentSchool', 'confirm'];
    
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="student-register">
      {/* Floating decorative elements */}
      <div className="student-register__floating-elements">
        {['🎓', '📚', '✏️', '🌟', '🎨', '🚀', '💡', '🏆', '⭐', '🎯'].map((emoji, index) => (
          <motion.div
            key={index}
            className="student-register__floating-emoji"
            style={{
              left: `${(index * 10) + 5}%`,
              fontSize: index % 2 === 0 ? '2rem' : '2.5rem',
            }}
            animate={{
              y: ['0vh', '100vh'],
              rotate: [0, 360],
              x: [0, Math.sin(index) * 30, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: index * 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="student-register__container">
        <Card className="student-register__card">
          {showConfetti && (
            <div className="student-register__confetti">
              <ConfettiExplosion show={showConfetti} onComplete={() => setShowConfetti(false)} />
            </div>
          )}
          {currentStep !== 'welcome' && (
            <div className="student-register__progress">
              <div 
                className="student-register__progress-bar"
                style={{ width: getProgressPercentage() + "%" }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentStep === 'welcome' && (
              <motion.div 
                key="welcome" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="student-register__step"
              >
                <div className="student-register__icon">
                  <img src="/src/assets/img/cohete.svg" alt="Bienvenida" />
                </div>
                <h2 className="student-register__step-title">¡Bienvenido a NeuroKids!</h2>
                <p className="student-register__step-description">
                  Vamos a crear una cuenta paso a paso 🚀
                </p>
                <Button 
                  label="¡Comenzar!" 
                  variant="primary" 
                  size="large" 
                  onClick={() => setCurrentStep('withParent')} 
                  className="student-register__step-button" 
                />
                <Button 
                  label="← Volver al inicio de sesión" 
                  variant="text" 
                  size="medium" 
                  onClick={() => navigate("/estudiante/login")} 
                  className="student-register__back-link" 
                />
              </motion.div>
            )}

            {currentStep === 'withParent' && (
              <motion.div 
                key="withParent" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">¿Estás con tus padres?</h2>
                <p className="student-register__step-description">
                  Necesitamos saber si estás acompañado por tus padres.
                </p>
                <div className="student-register__choice-buttons">
                  <Button 
                    label="✅ Sí, estoy con mis padres" 
                    variant="primary" 
                    size="large" 
                    onClick={() => handleParentChoice(true)} 
                    className="student-register__choice-button student-register__choice-button--yes" 
                  />
                  <Button 
                    label="❌ No, estoy solo" 
                    variant="secondary" 
                    size="large" 
                    onClick={() => handleParentChoice(false)} 
                    className="student-register__choice-button student-register__choice-button--no" 
                  />
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <Button 
                  label="← Atrás" 
                  variant="text" 
                  size="small" 
                  onClick={handleBack} 
                  className="student-register__back-button" 
                />
              </motion.div>
            )}

            {currentStep === 'studentName' && (
              <motion.div 
                key="studentName" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">¿Cómo te llamas?</h2>
                <p className="student-register__step-description">
                  Cuéntanos tu nombre completo
                </p>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="nombre">Tu Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    value={formData.nombre} 
                    onChange={(e) => handleInputChange(e.target.value, 'nombre')} 
                    className="student-register__input" 
                    placeholder="Ej: María" 
                    maxLength={50} 
                    autoFocus 
                  />
                </div>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="apellido">Tu Apellido</label>
                  <input 
                    type="text" 
                    id="apellido" 
                    value={formData.apellido} 
                    onChange={(e) => handleInputChange(e.target.value, 'apellido')} 
                    className="student-register__input" 
                    placeholder="Ej: García" 
                    maxLength={50} 
                  />
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <div className="student-register__buttons">
                  <Button label="← Atrás" variant="secondary" size="medium" onClick={handleBack} />
                  <Button label="Siguiente →" variant="primary" size="medium" onClick={handleNext} />
                </div>
              </motion.div>
            )}

            {currentStep === 'studentAge' && (
              <motion.div 
                key="studentAge" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">¿Cuántos años tienes?</h2>
                <p className="student-register__step-description">
                  Dinos tu edad para personalizar tu experiencia. Si no la recuerdas puedes saltar este paso.
                </p>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="edad">Tu Edad</label>
                  <input 
                    type="number" 
                    id="edad" 
                    value={formData.edad} 
                    onChange={(e) => handleInputChange(e.target.value, 'edad')} 
                    className="student-register__input student-register__input--number" 
                    placeholder="Ej: 10" 
                    min={7} 
                    max={18} 
                    autoFocus 
                  />
                  <p className="student-register__hint">Entre 7 y 18 años {withParent ? '(obligatorio)' : '(opcional, puedes dejarlo vacío)'} </p>
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <div className="student-register__buttons">
                  <Button label="← Atrás" variant="secondary" size="medium" onClick={handleBack} />
                  {!withParent && (
                    <Button 
                      label="No la recuerdo →" 
                      variant="text" 
                      size="medium" 
                      onClick={() => { setFormData(prev => ({ ...prev, edad: '' })); setError(''); handleNext(); }} 
                    />
                  )}
                  <Button label="Siguiente →" variant="primary" size="medium" onClick={handleNext} />
                </div>
              </motion.div>
            )}

            {currentStep === 'studentSchool' && (
              <motion.div 
                key="studentSchool" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">¿A qué escuela vas?</h2>
                <p className="student-register__step-description">
                  Selecciona tu escuela de la lista
                </p>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="institucion_id">Tu Escuela</label>
                  <select 
                    id="institucion_id" 
                    value={formData.institucion_id} 
                    onChange={(e) => handleInputChange(e.target.value, 'institucion_id')} 
                    className="student-register__select" 
                    disabled={loadingInstituciones} 
                    autoFocus
                  >
                    <option value="">
                      {loadingInstituciones 
                        ? "Cargando escuelas..." 
                        : instituciones.length === 0 
                          ? "No hay escuelas disponibles" 
                          : "Selecciona tu escuela"}
                    </option>
                    {instituciones.map((institucion) => (
                      <option key={institucion.id} value={institucion.id}>
                        {institucion.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingInstituciones && (
                    <p className="student-register__hint">Cargando lista de escuelas...</p>
                  )}
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <div className="student-register__buttons">
                  <Button 
                    label="← Atrás" 
                    variant="secondary" 
                    size="medium" 
                    onClick={handleBack} 
                    disabled={loadingInstituciones} 
                  />
                  <Button 
                    label={withParent ? "Siguiente →" : "Confirmar →"} 
                    variant="primary" 
                    size="medium" 
                    onClick={handleNext} 
                    disabled={loadingInstituciones} 
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 'parentDocument' && (
              <motion.div 
                key="parentDocument" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">Documento del Estudiante</h2>
                <p className="student-register__step-description">
                  Ingresa el número de documento del estudiante (lo completa el adulto)
                </p>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="num_documento">
                    Número de Documento del Estudiante
                  </label>
                  <input 
                    type="text" 
                    id="num_documento" 
                    value={formData.num_documento} 
                    onChange={(e) => handleInputChange(e.target.value, 'num_documento')} 
                    className="student-register__input" 
                    placeholder="Ej: 12345678" 
                    maxLength={20} 
                    autoFocus 
                  />
                  <p className="student-register__hint">Documento de identidad del estudiante</p>
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <div className="student-register__buttons">
                  <Button label="← Atrás" variant="secondary" size="medium" onClick={handleBack} />
                  <Button label="Siguiente →" variant="primary" size="medium" onClick={handleNext} />
                </div>
              </motion.div>
            )}

            {currentStep === 'parentEmail' && (
              <motion.div 
                key="parentEmail" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">Correo de Contacto</h2>
                <p className="student-register__step-description">
                  Correo del adulto responsable para enviar información importante
                </p>
                <div className="student-register__field">
                  <label className="student-register__label" htmlFor="correo">
                    Correo del Adulto
                  </label>
                  <input 
                    type="email" 
                    id="correo" 
                    value={formData.correo} 
                    onChange={(e) => handleInputChange(e.target.value, 'correo')} 
                    className="student-register__input" 
                    placeholder="ejemplo@correo.com" 
                    maxLength={100} 
                    autoFocus 
                  />
                  <p className="student-register__hint">Correo del padre, madre o tutor</p>
                </div>
                {error && <div className="student-register__error">{error}</div>}
                <div className="student-register__buttons">
                  <Button label="← Atrás" variant="secondary" size="medium" onClick={handleBack} />
                  <Button label="Confirmar →" variant="primary" size="medium" onClick={handleNext} />
                </div>
              </motion.div>
            )}

            {currentStep === 'confirm' && (
              <motion.div 
                key="confirm" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                className="student-register__step"
              >
                <h2 className="student-register__step-title">¡Confirma tus datos!</h2>
                <p className="student-register__step-description">
                  Revisa que todo esté correcto antes de crear tu cuenta
                </p>
                <div className="student-register__summary">
                  <div className="student-register__summary-section">
                    <h3 className="student-register__summary-title">👤 Datos del Estudiante</h3>
                    <div className="student-register__summary-item">
                      <strong>Nombre:</strong> {formData.nombre} {formData.apellido}
                    </div>
                    <div className="student-register__summary-item">
                      <strong>Edad:</strong> {formData.edad ? formData.edad + ' años' : 'No registrada'}
                    </div>
                    <div className="student-register__summary-item">
                      <strong>Escuela:</strong>{' '}
                      {instituciones.find(i => i.id === parseInt(formData.institucion_id))?.nombre || 'No seleccionada'}
                    </div>
                  </div>
                  {withParent && (
                    <div className="student-register__summary-section">
                      <h3 className="student-register__summary-title">� Datos de Registro</h3>
                      <div className="student-register__summary-item">
                        <strong>Documento del Estudiante:</strong> {formData.num_documento}
                      </div>
                      <div className="student-register__summary-item">
                        <strong>Correo de Contacto:</strong> {formData.correo}
                      </div>
                    </div>
                  )}
                </div>
                {error && <div className="student-register__error">{error}</div>}
                {loading && (
                  <div className="student-register__success">
                    ✨ Creando tu cuenta... ¡Ya casi terminamos!
                  </div>
                )}
                <div className="student-register__buttons">
                  <Button 
                    label="← Atrás" 
                    variant="secondary" 
                    size="medium" 
                    onClick={handleBack} 
                    disabled={loading} 
                  />
                  <Button 
                    label={loading ? "Creando cuenta..." : "✅ ¡Crear mi cuenta!"} 
                    variant="primary" 
                    size="large" 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="student-register__submit-button" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
