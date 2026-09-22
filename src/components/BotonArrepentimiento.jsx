import { useState } from 'react';

/**
 * BotonArrepentimiento
 *
 * Implementa el derecho del consumidor a revocar la aceptación de una compra
 * según el Art. 34 de la Ley N° 24.240 (Defensa del Consumidor) y la
 * Res. 424/2020 de la Secretaría de Comercio Interior, que obliga a los
 * comercios electrónicos a disponer de un mecanismo visible y accesible.
 *
 * Plazo legal: 10 días corridos desde la entrega del bien o la firma del contrato.
 */
export default function BotonArrepentimiento({ ultimaOrden }) {
  const [paso, setPaso] = useState('idle'); // idle | formulario | confirmado | fuera-de-plazo

  // Simula verificar si la orden está dentro del plazo de 10 días
  const verificarPlazo = (numeroOrden) => {
    // En producción esto se consulta al backend con la fecha real de la orden
    return true; // Para la demo siempre dentro de plazo
  };

  const handleAbrir = () => {
    if (!ultimaOrden) {
      setPaso('sin-compra');
      return;
    }
    if (verificarPlazo(ultimaOrden.numeroOrden)) {
      setPaso('formulario');
    } else {
      setPaso('fuera-de-plazo');
    }
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    setPaso('confirmado');
  };

  const handleCerrar = () => setPaso('idle');

  return (
    <>
      {/* ── Botón flotante ─────────────────────────────────────── */}
      <button
        id="btn-arrepentimiento"
        className="arrepentimiento-fab"
        onClick={handleAbrir}
        title="Botón de arrepentimiento — Ley 24.240"
        aria-label="Ejercer derecho de arrepentimiento"
      >
        <span className="arrepentimiento-fab-icon">↩</span>
        <span className="arrepentimiento-fab-label">Arrepentimiento</span>
      </button>

      {/* ── Modal ──────────────────────────────────────────────── */}
      {paso !== 'idle' && (
        <div className="modal-overlay arrepentimiento-overlay" id="arrepentimiento-overlay" role="dialog" aria-modal="true" aria-labelledby="arrepentimiento-titulo">
          <div className="arrepentimiento-modal">

            {/* ── Sin compra previa ── */}
            {paso === 'sin-compra' && (
              <div className="arrepentimiento-estado">
                <div className="arrepentimiento-icono arrepentimiento-icono--info">ℹ️</div>
                <h2 id="arrepentimiento-titulo">Sin compra registrada</h2>
                <p>No tenés ninguna compra reciente en esta sesión para revocar.</p>
                <button className="arrepentimiento-btn-cerrar" onClick={handleCerrar} id="arrepentimiento-cerrar-sincompra">Cerrar</button>
              </div>
            )}

            {/* ── Formulario ── */}
            {paso === 'formulario' && (
              <>
                <div className="arrepentimiento-header">
                  <span className="arrepentimiento-badge">Ley N° 24.240 — Art. 34</span>
                  <h2 id="arrepentimiento-titulo">Derecho de Arrepentimiento</h2>
                  <p className="arrepentimiento-descripcion">
                    Podés revocar tu compra dentro de los <strong>10 días corridos</strong> desde
                    la fecha de entrega, sin necesidad de dar ningún motivo y sin costo adicional.
                  </p>
                </div>

                {ultimaOrden && (
                  <div className="arrepentimiento-orden">
                    <span>Orden <strong>#{ultimaOrden.numeroOrden}</strong></span>
                    <span>Fecha: <strong>{ultimaOrden.fecha}</strong></span>
                    <span>Total: <strong>${ultimaOrden.total?.toLocaleString('es-AR')}</strong></span>
                  </div>
                )}

                <form className="arrepentimiento-form" onSubmit={handleEnviar} id="arrepentimiento-form">
                  <div className="arrepentimiento-field">
                    <label htmlFor="arrepentimiento-nombre">Nombre y apellido *</label>
                    <input id="arrepentimiento-nombre" type="text" required placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="arrepentimiento-field">
                    <label htmlFor="arrepentimiento-email">Email de contacto *</label>
                    <input id="arrepentimiento-email" type="email" required placeholder="tu@email.com" />
                  </div>
                  <div className="arrepentimiento-field">
                    <label htmlFor="arrepentimiento-motivo">Motivo (opcional)</label>
                    <textarea
                      id="arrepentimiento-motivo"
                      rows={3}
                      placeholder="Podés indicar el motivo, aunque no es obligatorio según la ley."
                    />
                  </div>

                  <div className="arrepentimiento-legal">
                    <p>
                      Al enviar este formulario ejercés tu derecho consagrado en el
                      <strong> Art. 34 de la Ley 24.240</strong>. Recibirás una confirmación
                      por email en un plazo máximo de <strong>24 hs hábiles</strong>.
                      El reintegro del dinero se realizará por el mismo medio de pago
                      utilizado, dentro de los <strong>10 días hábiles</strong> posteriores.
                    </p>
                  </div>

                  <div className="arrepentimiento-acciones">
                    <button type="submit" className="arrepentimiento-btn-confirmar" id="arrepentimiento-submit">
                      Confirmar arrepentimiento
                    </button>
                    <button type="button" className="arrepentimiento-btn-cancelar" onClick={handleCerrar} id="arrepentimiento-cancelar">
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ── Confirmado ── */}
            {paso === 'confirmado' && (
              <div className="arrepentimiento-estado">
                <div className="arrepentimiento-icono arrepentimiento-icono--ok">✅</div>
                <h2 id="arrepentimiento-titulo">Solicitud registrada</h2>
                <p>
                  Tu solicitud de arrepentimiento fue recibida correctamente.<br />
                  Te enviaremos la confirmación por email dentro de las <strong>24 hs hábiles</strong>.<br />
                  El reintegro se acreditará en un plazo de <strong>10 días hábiles</strong>.
                </p>
                <p className="arrepentimiento-ley-nota">
                  Derecho garantizado por el <strong>Art. 34, Ley N° 24.240</strong> y la
                  Res. 424/2020 de la Secretaría de Comercio Interior.
                </p>
                <button className="arrepentimiento-btn-cerrar" onClick={handleCerrar} id="arrepentimiento-cerrar-ok">
                  Cerrar
                </button>
              </div>
            )}

            {/* ── Fuera de plazo ── */}
            {paso === 'fuera-de-plazo' && (
              <div className="arrepentimiento-estado">
                <div className="arrepentimiento-icono arrepentimiento-icono--warn">⚠️</div>
                <h2 id="arrepentimiento-titulo">Plazo vencido</h2>
                <p>
                  Lamentablemente ya transcurrieron más de <strong>10 días corridos</strong>
                  desde la entrega, por lo que el plazo legal de arrepentimiento ha expirado.
                </p>
                <p>Si tenés un problema con el producto, podés contactar a nuestro soporte.</p>
                <button className="arrepentimiento-btn-cerrar" onClick={handleCerrar} id="arrepentimiento-cerrar-fuera">
                  Cerrar
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
