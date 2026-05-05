import { useNavigate } from "react-router-dom";
import "./terminosCondiciones.scss";

export default function TerminosCondiciones() {
  const navigate = useNavigate();

  return (
    <div className="terminos">
      <div className="terminos__container">
        <header className="terminos__header">
          <div className="terminos__logo">⚖️</div>
          <h1 className="terminos__title">Términos y Condiciones de Uso</h1>
          <p className="terminos__subtitle">Plataforma Educativa NeuroKids</p>
          <p className="terminos__date">Última actualización: Mayo de 2025</p>
        </header>

        <nav className="terminos__toc">
          <h2 className="terminos__toc-title">Tabla de Contenido</h2>
          <ol className="terminos__toc-list">
            <li><a href="#definiciones">1. Definiciones y Naturaleza del Servicio</a></li>
            <li><a href="#alcance">2. Alcance y Limitaciones de la Plataforma</a></li>
            <li><a href="#no-diagnostico">3. Declaración de No Diagnóstico</a></li>
            <li><a href="#menores">4. Protección de Datos de Menores de Edad</a></li>
            <li><a href="#datos-padres">5. Tratamiento de Datos de Padres y Tutores</a></li>
            <li><a href="#derechos-arco">6. Derechos ARCO y Procedimiento de Ejercicio</a></li>
            <li><a href="#continuidad">7. Continuidad y Disponibilidad del Servicio</a></li>
            <li><a href="#seguridad">8. Seguridad de la Información</a></li>
            <li><a href="#responsabilidades">9. Responsabilidades del Usuario</a></li>
            <li><a href="#modificaciones">10. Modificaciones a los Términos</a></li>
            <li><a href="#legislacion">11. Legislación Aplicable</a></li>
            <li><a href="#contacto">12. Contacto y Atención al Usuario</a></li>
          </ol>
        </nav>

        <main className="terminos__content">

          <section id="definiciones" className="terminos__section">
            <h2 className="terminos__section-title">1. Definiciones y Naturaleza del Servicio</h2>
            <p>
              <strong>NeuroKids</strong> es una plataforma educativa digital diseñada para apoyar el aprendizaje
              de niños, niñas y adolescentes con necesidades educativas especiales, particularmente en el desarrollo
              de habilidades de lectura, escritura y comunicación. La plataforma es operada por el equipo de desarrollo
              de NeuroKids (en adelante, "el Equipo" o "los Responsables").
            </p>
            <p>
              Para efectos de los presentes términos, se entenderá por:
            </p>
            <ul className="terminos__list">
              <li><strong>Plataforma:</strong> El conjunto de herramientas, juegos, lecturas y actividades accesibles a través de la aplicación web NeuroKids.</li>
              <li><strong>Usuario:</strong> Toda persona, natural o jurídica, que acceda, use o consulte la plataforma, incluyendo estudiantes, padres, tutores, docentes y administradores.</li>
              <li><strong>Menor de Edad:</strong> Persona que no ha cumplido los dieciocho (18) años de edad, conforme a la legislación colombiana.</li>
              <li><strong>Titular de los Datos:</strong> La persona natural cuyos datos personales son objeto de tratamiento.</li>
              <li><strong>Responsable del Tratamiento:</strong> El Equipo NeuroKids, en calidad de responsable del tratamiento de los datos personales recopilados a través de la plataforma.</li>
            </ul>
          </section>

          <section id="alcance" className="terminos__section">
            <h2 className="terminos__section-title">2. Alcance y Limitaciones de la Plataforma</h2>
            <p>
              NeuroKids es una herramienta educativa de apoyo y acompañamiento. Su propósito es ofrecer
              actividades lúdicas y pedagógicas que estimulen el aprendizaje de niños con dificultades
              en el procesamiento del lenguaje y la lectura. La plataforma <strong>no sustituye</strong> en
              ningún caso la labor de profesionales de la educación, la salud o el bienestar del menor.
            </p>
            <p>
              NeuroKids <strong>no reemplaza ni pretende reemplazar</strong> a:
            </p>
            <ul className="terminos__list">
              <li>Docentes titulados y profesionales de la educación especial</li>
              <li>Terapeutas del lenguaje y fonoaudiólogos</li>
              <li>Psicólogos, neuropsicólogos y psicopedagogos</li>
              <li>Médicos, pediatras o cualquier profesional del área de la salud</li>
              <li>Orientadores escolares o consejeros educativos</li>
            </ul>
            <p>
              El uso de la plataforma debe considerarse como un complemento a la intervención
              profesional y al proceso educativo formal del menor, nunca como un sustituto de estos.
            </p>
          </section>

          <section id="no-diagnostico" className="terminos__section terminos__section--warning">
            <h2 className="terminos__section-title">3. Declaración de No Diagnóstico</h2>
            <div className="terminos__alert">
              <span className="terminos__alert-icon">⚠️</span>
              <div>
                <p>
                  <strong>NeuroKids NO es una herramienta de diagnóstico clínico.</strong>
                </p>
                <p>
                  La plataforma y sus resultados, informes, estadísticas, niveles de avance o cualquier
                  otro indicador generado por el sistema <strong>no constituyen, no representan y no deben
                  interpretarse como un diagnóstico médico, psicológico, neurológico o educativo</strong> de
                  ningún tipo de condición, trastorno o dificultad del desarrollo del lenguaje, la lectura,
                  la escritura, el aprendizaje o cualquier otra área del neurodesarrollo.
                </p>
                <p>
                  Los resultados obtenidos en la plataforma son indicadores pedagógicos de desempeño en
                  actividades específicas dentro del entorno digital. <strong>Ningún resultado de NeuroKids
                  puede ser utilizado como soporte, evidencia o base para emitir, confirmar, descartar o
                  sugerir un diagnóstico de dislexia, trastorno del lenguaje, trastorno del espectro autista,
                  TDAH, u otras condiciones del neurodesarrollo.</strong>
                </p>
                <p>
                  Si el padre, madre, tutor o docente tiene inquietudes sobre el desarrollo del menor,
                  debe consultar a un profesional de salud o educación debidamente titulado y habilitado
                  para realizar evaluaciones diagnósticas.
                </p>
              </div>
            </div>
          </section>

          <section id="menores" className="terminos__section">
            <h2 className="terminos__section-title">4. Protección de Datos de Menores de Edad</h2>
            <p>
              De conformidad con la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales),
              el <strong>Decreto 1377 de 2013</strong> y la <strong>Ley 1098 de 2006</strong> (Código de la
              Infancia y la Adolescencia), NeuroKids adopta medidas reforzadas para la protección de los
              datos personales de los menores de edad.
            </p>
            <h3 className="terminos__subsection-title">4.1 Datos recopilados de menores</h3>
            <ul className="terminos__list">
              <li>Nombre y apellido del estudiante</li>
              <li>Edad (cuando es aportada por el padre, madre o tutor)</li>
              <li>Número de documento de identidad (cuando el registro es acompañado por un adulto)</li>
              <li>Institución educativa a la que pertenece</li>
              <li>Datos de progreso y desempeño dentro de las actividades de la plataforma</li>
            </ul>
            <h3 className="terminos__subsection-title">4.2 Finalidad del tratamiento</h3>
            <p>Los datos del menor son tratados exclusivamente para:</p>
            <ul className="terminos__list">
              <li>Personalizar la experiencia educativa dentro de la plataforma</li>
              <li>Generar reportes de progreso para docentes y padres o tutores autorizados</li>
              <li>Identificar al usuario dentro del sistema de forma segura</li>
              <li>Mejorar las funcionalidades pedagógicas de la plataforma</li>
            </ul>
            <h3 className="terminos__subsection-title">4.3 Autorización y representación</h3>
            <p>
              El registro de un menor de edad en la plataforma requiere la participación de un padre,
              madre o tutor legal cuando el menor desee asociar su cuenta a un correo electrónico de
              contacto o a su número de documento. Al completar el registro con datos del menor,
              el adulto acompañante declara ser el representante legal del menor y otorga su
              autorización informada para el tratamiento de los datos personales del niño, niña
              o adolescente, conforme al artículo 7 de la Ley 1581 de 2012.
            </p>
          </section>

          <section id="datos-padres" className="terminos__section">
            <h2 className="terminos__section-title">5. Tratamiento de Datos de Padres y Tutores</h2>
            <p>
              Cuando un padre, madre o tutor legal registra a un menor en la plataforma,
              NeuroKids recopila los siguientes datos del adulto responsable:
            </p>
            <ul className="terminos__list">
              <li>Correo electrónico de contacto</li>
            </ul>
            <h3 className="terminos__subsection-title">5.1 Finalidad</h3>
            <p>El correo electrónico del padre, madre o tutor se utiliza para:</p>
            <ul className="terminos__list">
              <li>Enviar información sobre el progreso del menor en la plataforma</li>
              <li>Notificaciones importantes relacionadas con el servicio</li>
              <li>Atender solicitudes relacionadas con el ejercicio de derechos sobre los datos personales</li>
            </ul>
            <h3 className="terminos__subsection-title">5.2 Bases legales del tratamiento</h3>
            <p>
              El tratamiento de los datos del padre, madre o tutor se realiza con base en el
              consentimiento libre, previo e informado otorgado al aceptar los presentes términos,
              conforme a los artículos 9 y 10 de la Ley 1581 de 2012.
            </p>
            <h3 className="terminos__subsection-title">5.3 Transferencia a terceros</h3>
            <p>
              NeuroKids no venderá, alquilará ni compartirá los datos personales de padres, madres,
              tutores o menores con terceros con fines comerciales. Los datos podrán ser compartidos
              únicamente con las instituciones educativas vinculadas a la plataforma, en la medida
              en que sea necesario para la prestación del servicio educativo.
            </p>
          </section>

          <section id="derechos-arco" className="terminos__section">
            <h2 className="terminos__section-title">6. Derechos ARCO y Procedimiento de Ejercicio</h2>
            <p>
              De conformidad con el artículo 8 de la Ley 1581 de 2012, el titular de los datos
              personales tiene los siguientes derechos:
            </p>
            <ul className="terminos__list">
              <li><strong>Acceso:</strong> Conocer los datos personales que NeuroKids tiene sobre usted o su hijo/a.</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Cancelación/Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recopilados.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos.</li>
              <li><strong>Revocación del consentimiento:</strong> Retirar el consentimiento otorgado para el tratamiento de datos.</li>
            </ul>
            <p>
              Para ejercer estos derechos, el titular o su representante legal puede dirigir una
              comunicación escrita al correo electrónico de contacto indicado en la sección 12
              de los presentes términos. NeuroKids dará respuesta dentro de los plazos
              establecidos en la legislación colombiana vigente.
            </p>
          </section>

          <section id="continuidad" className="terminos__section terminos__section--warning">
            <h2 className="terminos__section-title">7. Continuidad y Disponibilidad del Servicio</h2>
            <div className="terminos__alert terminos__alert--info">
              <span className="terminos__alert-icon">ℹ️</span>
              <div>
                <p>
                  <strong>NeuroKids es una plataforma en desarrollo continuo.</strong>
                  El usuario acepta y reconoce expresamente que:
                </p>
                <ul className="terminos__list">
                  <li>
                    <strong>La plataforma puede dejar de operar, total o parcialmente,</strong> en cualquier
                    momento, sin previo aviso, como resultado de una decisión voluntaria del equipo de
                    desarrollo, limitaciones técnicas, restricciones financieras, cambios en las
                    condiciones del servicio, o cualquier otro factor interno o externo que así lo determine.
                  </li>
                  <li>
                    <strong>No se garantiza la disponibilidad continua, ininterrumpida ni permanente</strong>
                    del servicio. La plataforma puede experimentar interrupciones planificadas o no planificadas,
                    periodos de mantenimiento, o cese definitivo de operaciones.
                  </li>
                  <li>
                    <strong>Los datos almacenados en la plataforma pueden ser eliminados</strong> en caso de
                    cierre definitivo del servicio. El equipo realizará esfuerzos razonables para notificar
                    a los usuarios con anticipación antes de un cierre definitivo, sin que esto constituya
                    una obligación de continuidad del servicio.
                  </li>
                  <li>
                    <strong>Factores externos</strong> como cambios en tecnologías de terceros, modificaciones
                    en la legislación, interrupciones en servicios de infraestructura tecnológica, o situaciones
                    de fuerza mayor pueden afectar la disponibilidad de la plataforma sin que ello genere
                    responsabilidad para el equipo de NeuroKids.
                  </li>
                </ul>
                <p>
                  El uso de la plataforma no genera ningún derecho a la continuidad indefinida del servicio.
                  NeuroKids no será responsable por perjuicios derivados de la interrupción o cese del servicio.
                </p>
              </div>
            </div>
          </section>

          <section id="seguridad" className="terminos__section">
            <h2 className="terminos__section-title">8. Seguridad de la Información</h2>
            <p>
              NeuroKids implementa medidas técnicas y organizativas razonables para proteger
              los datos personales contra el acceso no autorizado, la pérdida accidental, la
              alteración o la divulgación indebida. Sin embargo, ningún sistema de transmisión
              o almacenamiento de datos es completamente seguro.
            </p>
            <p>
              En caso de detectar una brecha de seguridad que afecte los datos personales de los
              usuarios, NeuroKids notificará a los afectados y a la Superintendencia de Industria
              y Comercio en los términos establecidos por la normativa colombiana vigente.
            </p>
          </section>

          <section id="responsabilidades" className="terminos__section">
            <h2 className="terminos__section-title">9. Responsabilidades del Usuario</h2>
            <p>Al utilizar la plataforma, el usuario se compromete a:</p>
            <ul className="terminos__list">
              <li>Proporcionar información veraz y actualizada al momento del registro.</li>
              <li>No compartir las credenciales de acceso con terceros no autorizados.</li>
              <li>Utilizar la plataforma exclusivamente para los fines educativos para los que fue creada.</li>
              <li>No intentar acceder a datos de otros usuarios o a áreas restringidas del sistema.</li>
              <li>Notificar al equipo de NeuroKids ante cualquier uso no autorizado de su cuenta.</li>
              <li>
                Cuando el registro corresponda a un menor, garantizar que la información proporcionada
                sea correcta y que se cuenta con la representación legal necesaria.
              </li>
            </ul>
          </section>

          <section id="modificaciones" className="terminos__section">
            <h2 className="terminos__section-title">10. Modificaciones a los Términos</h2>
            <p>
              NeuroKids se reserva el derecho de modificar los presentes términos y condiciones en
              cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en
              la plataforma. El uso continuado del servicio tras la publicación de los cambios
              implicará la aceptación de los nuevos términos.
            </p>
            <p>
              Para cambios sustanciales que afecten el tratamiento de datos personales de menores,
              NeuroKids notificará a los padres, madres o tutores registrados por correo electrónico,
              cuando esto sea técnicamente posible.
            </p>
          </section>

          <section id="legislacion" className="terminos__section">
            <h2 className="terminos__section-title">11. Legislación Aplicable</h2>
            <p>
              Los presentes términos se rigen por la legislación colombiana, en particular:
            </p>
            <ul className="terminos__list">
              <li><strong>Ley 1581 de 2012:</strong> Protección de Datos Personales.</li>
              <li><strong>Decreto 1377 de 2013:</strong> Reglamentación parcial de la Ley 1581 de 2012.</li>
              <li><strong>Ley 1098 de 2006:</strong> Código de la Infancia y la Adolescencia.</li>
              <li><strong>Ley 1273 de 2009:</strong> Delitos Informáticos.</li>
              <li><strong>Ley 527 de 1999:</strong> Comercio Electrónico y Firmas Digitales.</li>
            </ul>
            <p>
              Para cualquier controversia derivada de los presentes términos, las partes se
              someten a la jurisdicción de los jueces y tribunales competentes de la República
              de Colombia.
            </p>
          </section>

          <section id="contacto" className="terminos__section">
            <h2 className="terminos__section-title">12. Contacto y Atención al Usuario</h2>
            <p>
              Para consultas, solicitudes de ejercicio de derechos ARCO, reportes de incidentes
              de seguridad o cualquier inquietud relacionada con el tratamiento de datos personales,
              el usuario puede comunicarse con el equipo de NeuroKids a través de los siguientes medios:
            </p>
            <div className="terminos__contact">
              <div className="terminos__contact-item">
                <span className="terminos__contact-icon">📧</span>
                <div>
                  <strong>Correo Electrónico</strong>
                  <p>neurokids.educacion@gmail.com</p>
                </div>
              </div>
              <div className="terminos__contact-item">
                <span className="terminos__contact-icon">🏫</span>
                <div>
                  <strong>Equipo NeuroKids</strong>
                  <p>Plataforma Educativa para el Desarrollo del Lenguaje</p>
                  <p>República de Colombia</p>
                </div>
              </div>
            </div>
            <p className="terminos__sic-note">
              Para presentar quejas ante la autoridad de protección de datos personales, puede
              contactar a la <strong>Superintendencia de Industria y Comercio (SIC)</strong> en
              www.sic.gov.co — Delegatura para la Protección de Datos Personales.
            </p>
          </section>

        </main>

        <footer className="terminos__footer">
          <p>© 2025 NeuroKids — Plataforma Educativa. Todos los derechos reservados.</p>
          <p>Estos términos fueron elaborados conforme a la legislación colombiana vigente.</p>
          <button
            className="terminos__back-button"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </footer>
      </div>
    </div>
  );
}
