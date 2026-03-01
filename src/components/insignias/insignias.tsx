import React from 'react';
import { type Insignia } from '../../services/insigniaService';

interface InsigniaModalProps {
    isOpen: boolean;
    onClose: () => void;
    insignia: Insignia;
}

export const InsigniaModal: React.FC<InsigniaModalProps> = ({ isOpen, onClose, insignia }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="insignia-celebration">
                    <h2>¡Felicitaciones!</h2>
                    <div className="insignia-display">
                        <img 
                            src={insignia.icono} 
                            alt={insignia.nombre}
                            className="insignia-icon"
                            style={{ borderColor: insignia.color_hex }}
                        />
                        <h3>{insignia.nombre}</h3>
                        <p>{insignia.descripcion}</p>
                        {insignia.puntos_otorgados > 0 && (
                            <div className="puntos">
                                +{insignia.puntos_otorgados} puntos
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="btn-continuar">
                        ¡Continuar!
                    </button>
                </div>
            </div>
        </div>
    );
};