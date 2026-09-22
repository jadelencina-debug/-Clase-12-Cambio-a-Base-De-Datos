import { useState } from 'react';

const API = 'http://localhost:8000';

/**
 * ModalAuth
 *
 * Demuestra el flujo completo de autenticación y la implementación
 * de la Ley 25.326 (Protección de Datos Personales).
 *
 * Pasos que muestra:
 *  - Registro con acepto_tratamiento = false  → 422 (rechazado por la ley)
 *  - Registro con acepto_tratamiento = true   → 201 (cuenta creada)
 *  - Login                                    → token JWT
 *  - GET /auth/me                             → datos del usuario autenticado
 */
export default function ModalAuth({ onClose }) {
  const [tab, setTab] = useState('register'); // 'register' | 'login' | 'me'

  // ── Registro ──────────────────────────────────────────────────────────────
  const [regForm, setRegForm] = useState({
    nombre: '', email: '', password: '', acepto_tratamiento: false,
  });
  const [regResult, setRegResult] = useState(null); // { ok, status, body }
  const [regLoading, setRegLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegResult(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const body = await res.json();
      setRegResult({ ok: res.ok, status: res.status, body });
    } catch (err) {
      setRegResult({ ok: false, status: 0, body: { detail: 'Error de red: ' + err.message } });
    } finally {
      setRegLoading(false);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginResult, setLoginResult] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginResult(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', loginForm.username);
      formData.append('password', loginForm.password);
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const body = await res.json();
      setLoginResult({ ok: res.ok, status: res.status, body });
      if (res.ok && body.access_token) setToken(body.access_token);
    } catch (err) {
      setLoginResult({ ok: false, status: 0, body: { detail: 'Error de red: ' + err.message } });
    } finally {
      setLoginLoading(false);
    }
  };

  // ── /auth/me ──────────────────────────────────────────────────────────────
  const [meResult, setMeResult] = useState(null);
  const [meLoading, setMeLoading] = useState(false);

  const handleMe = async () => {
    setMeLoading(true);
    setMeResult(null);
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const body = await res.json();
      setMeResult({ ok: res.ok, status: res.status, body });
    } catch (err) {
      setMeResult({ ok: false, status: 0, body: { detail: 'Error de red: ' + err.message } });
    } finally {
      setMeLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const color =
      status >= 200 && status < 300 ? '#22c55e' :
      status === 401 ? '#f59e0b' :
      status === 403 ? '#f97316' :
      '#ef4444';
    return (
      <span style={{
        background: color, color: '#fff', borderRadius: 6,
        padding: '2px 10px', fontWeight: 700, fontSize: 13,
        letterSpacing: 1,
      }}>
        {status}
      </span>
    );
  };

  const JsonBox = ({ data }) => (
    <pre style={{
      background: '#0f172a', color: '#e2e8f0', borderRadius: 10,
      padding: '12px 14px', fontSize: 12.5, overflowX: 'auto',
      margin: '8px 0 0', lineHeight: 1.6, maxHeight: 180,
      border: '1px solid #1e293b',
    }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)', animation: 'popIn 0.3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1e1b4b 0%, #1e293b 100%)',
        borderRadius: 20, width: '100%', maxWidth: 520,
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.3)',
        overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif",
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          padding: '20px 24px 16px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
              🛡️ Demo interactiva
            </div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 }}>
              Sistema de Autenticación
            </h2>
            <p style={{ margin: '4px 0 0', color: '#ddd6fe', fontSize: 13 }}>
              Ley 25.326 · JWT · bcrypt · FastAPI
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 18, cursor: 'pointer', padding: '4px 10px',
            fontWeight: 700, lineHeight: 1,
          }}>✕</button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', background: '#0f172a', padding: '4px 16px 0' }}>
          {[
            { key: 'register', label: '📝 Registro', badge: 'Ley 25.326' },
            { key: 'login', label: '🔑 Login', badge: 'JWT' },
            { key: 'me', label: '👤 /auth/me', badge: 'Bearer' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 14px 8px', border: 'none', cursor: 'pointer',
              background: tab === t.key ? '#1e293b' : 'transparent',
              color: tab === t.key ? '#a78bfa' : '#64748b',
              borderBottom: tab === t.key ? '2px solid #7c3aed' : '2px solid transparent',
              fontWeight: 600, fontSize: 13, borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s',
            }}>
              {t.label}
              <span style={{
                marginLeft: 6, fontSize: 10, background: tab === t.key ? '#7c3aed' : '#1e293b',
                color: '#c4b5fd', padding: '1px 6px', borderRadius: 20,
              }}>{t.badge}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {/* ══════════ REGISTRO ══════════ */}
          {tab === 'register' && (
            <>
              {/* Explicación legal */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))',
                border: '1px solid rgba(124,58,237,0.35)', borderRadius: 12,
                padding: '12px 16px', marginBottom: 18,
              }}>
                <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: 13, marginBottom: 6 }}>
                  📋 ¿Qué demuestra esta sección?
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 13, lineHeight: 1.8 }}>
                  <li>Con <code style={codeStyle}>acepto_tratamiento: false</code> → el backend devuelve <strong style={{ color: '#ef4444' }}>422</strong></li>
                  <li>Con <code style={codeStyle}>acepto_tratamiento: true</code> → el backend devuelve <strong style={{ color: '#22c55e' }}>201</strong></li>
                  <li>La contraseña <strong>nunca se guarda</strong> en texto plano (bcrypt hash)</li>
                </ul>
              </div>

              <form onSubmit={handleRegister}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Nombre</label>
                  <input style={inputStyle} type="text" required placeholder="Juan Pérez"
                    value={regForm.nombre}
                    onChange={e => setRegForm(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" required placeholder="juan@ejemplo.com"
                    value={regForm.email}
                    onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Contraseña</label>
                  <input style={inputStyle} type="password" required placeholder="mínimo 1 caracter"
                    value={regForm.password}
                    onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} />
                </div>

                {/* El checkbox clave de la Ley 25.326 */}
                <div style={{
                  background: regForm.acepto_tratamiento ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${regForm.acepto_tratamiento ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: 10, padding: '12px 14px', marginBottom: 16, transition: 'all 0.3s',
                }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input type="checkbox" checked={regForm.acepto_tratamiento}
                      onChange={e => setRegForm(p => ({ ...p, acepto_tratamiento: e.target.checked }))}
                      style={{ width: 16, height: 16, marginTop: 2, accentColor: '#7c3aed', flexShrink: 0 }} />
                    <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5 }}>
                      Acepto el tratamiento de mis datos personales según la{' '}
                      <strong style={{ color: '#a78bfa' }}>Ley 25.326</strong>{' '}
                      (Protección de Datos Personales).{' '}
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>
                        {!regForm.acepto_tratamiento && '← REQUERIDO — el backend rechazará el registro'}
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: 700 }}>
                        {regForm.acepto_tratamiento && '← Aceptado ✓'}
                      </span>
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={regLoading} style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  opacity: regLoading ? 0.7 : 1,
                }}>
                  {regLoading ? '⏳ Enviando...' : '📝 Registrarse'}
                </button>
              </form>

              {regResult && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Respuesta:</span>
                    <StatusBadge status={regResult.status} />
                    <span style={{ fontSize: 13, color: regResult.ok ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                      {regResult.ok ? '✅ Usuario creado' : '❌ Rechazado por el servidor'}
                    </span>
                  </div>
                  <JsonBox data={regResult.body} />
                  {regResult.status === 422 && (
                    <div style={{ marginTop: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13 }}>
                      💡 El <strong>422 Unprocessable Entity</strong> viene del validador de Pydantic en <code style={codeStyle}>schemas/usuario.py</code>. La Ley 25.326 impide el registro sin consentimiento.
                    </div>
                  )}
                  {regResult.status === 201 && (
                    <div style={{ marginTop: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', color: '#86efac', fontSize: 13 }}>
                      💡 Fijate en <code style={codeStyle}>hashed_password</code>: empieza con <code style={codeStyle}>$2b$</code> → es bcrypt. Nunca se guarda la contraseña real. Andá a la pestaña <strong>Login</strong> para continuar →
                    </div>
                  )}
                  {regResult.status === 409 && (
                    <div style={{ marginTop: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '10px 14px', color: '#fcd34d', fontSize: 13 }}>
                      ⚠️ <strong>409 Conflict</strong>: ese email ya está registrado. Probá con otro email.
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══════════ LOGIN ══════════ */}
          {tab === 'login' && (
            <>
              <div style={{
                background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(16,185,129,0.08))',
                border: '1px solid rgba(79,70,229,0.35)', borderRadius: 12,
                padding: '12px 16px', marginBottom: 18,
              }}>
                <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: 13, marginBottom: 6 }}>
                  🔑 ¿Qué demuestra esta sección?
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 13, lineHeight: 1.8 }}>
                  <li>El formulario usa <code style={codeStyle}>username</code> (pero ahí va el email)</li>
                  <li>Respuesta exitosa: <strong style={{ color: '#22c55e' }}>access_token</strong> + <strong style={{ color: '#22c55e' }}>refresh_token</strong></li>
                  <li>Error de credenciales: <strong style={{ color: '#f59e0b' }}>401</strong> sin decir si falló el email o la clave</li>
                </ul>
              </div>

              <form onSubmit={handleLogin}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email <span style={{ color: '#64748b', fontSize: 11 }}>(campo "username" del form)</span></label>
                  <input style={inputStyle} type="email" required placeholder="juan@ejemplo.com"
                    value={loginForm.username}
                    onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Contraseña</label>
                  <input style={inputStyle} type="password" required placeholder="tu contraseña"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <button type="submit" disabled={loginLoading} style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  opacity: loginLoading ? 0.7 : 1,
                }}>
                  {loginLoading ? '⏳ Autenticando...' : '🔑 Iniciar sesión'}
                </button>
              </form>

              {loginResult && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Respuesta:</span>
                    <StatusBadge status={loginResult.status} />
                    <span style={{ fontSize: 13, color: loginResult.ok ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                      {loginResult.ok ? '✅ Tokens generados' : '❌ Credenciales inválidas'}
                    </span>
                  </div>
                  <JsonBox data={loginResult.ok
                    ? { ...loginResult.body, access_token: loginResult.body.access_token?.slice(0, 40) + '…', refresh_token: loginResult.body.refresh_token?.slice(0, 40) + '…' }
                    : loginResult.body} />
                  {loginResult.ok && (
                    <div style={{ marginTop: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', color: '#86efac', fontSize: 13 }}>
                      💡 Los tokens están guardados. Andá a <strong>/auth/me</strong> para ver tus datos. También podés pegar el <code style={codeStyle}>access_token</code> completo en <a href="https://jwt.io" target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>jwt.io</a> y ver el payload (sub, rol, tipo).
                    </div>
                  )}
                  {loginResult.status === 401 && (
                    <div style={{ marginTop: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13 }}>
                      💡 El backend devuelve <strong>"Credenciales inválidas"</strong> sin revelar si falló el email o la contraseña. Esto es intencional: evita ataques de enumeración de usuarios.
                    </div>
                  )}
                </div>
              )}

              {token && (
                <div style={{ marginTop: 16, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🎟️ Token guardado en memoria</div>
                  <code style={{ fontSize: 11, color: '#c4b5fd', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    {token.slice(0, 60)}…
                  </code>
                </div>
              )}
            </>
          )}

          {/* ══════════ /auth/me ══════════ */}
          {tab === 'me' && (
            <>
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(79,70,229,0.08))',
                border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12,
                padding: '12px 16px', marginBottom: 18,
              }}>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: 13, marginBottom: 6 }}>
                  👤 ¿Qué demuestra esta sección?
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 13, lineHeight: 1.8 }}>
                  <li>Sin token → <strong style={{ color: '#f59e0b' }}>401 No autenticado</strong></li>
                  <li>Con token → tus datos <strong>sin el hash</strong> de la contraseña</li>
                  <li>El token viaja en el header <code style={codeStyle}>Authorization: Bearer ...</code></li>
                </ul>
              </div>

              <div style={{ marginBottom: 16, background: '#0f172a', borderRadius: 10, padding: '10px 14px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Header que se envía:</div>
                <code style={{ fontSize: 12, color: token ? '#86efac' : '#ef4444' }}>
                  {token
                    ? `Authorization: Bearer ${token.slice(0, 35)}…`
                    : '(sin token — hacé login primero)'}
                </code>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                <button onClick={handleMe} disabled={meLoading} style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                  opacity: meLoading ? 0.7 : 1, flex: 1,
                }}>
                  {meLoading ? '⏳ Consultando...' : '👤 GET /auth/me (con token)'}
                </button>
                <button onClick={async () => {
                  setMeLoading(true);
                  setMeResult(null);
                  try {
                    const res = await fetch(`${API}/auth/me`);
                    const body = await res.json();
                    setMeResult({ ok: res.ok, status: res.status, body });
                  } finally { setMeLoading(false); }
                }} disabled={meLoading} style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  opacity: meLoading ? 0.7 : 1, flex: 1,
                }}>
                  🚫 Sin token (→ 401)
                </button>
              </div>

              {meResult && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Respuesta:</span>
                    <StatusBadge status={meResult.status} />
                    <span style={{ fontSize: 13, color: meResult.ok ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                      {meResult.ok ? '✅ Usuario identificado' : '❌ No autenticado'}
                    </span>
                  </div>
                  <JsonBox data={meResult.body} />
                  {meResult.ok && (
                    <div style={{ marginTop: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 14px', color: '#86efac', fontSize: 13 }}>
                      💡 La respuesta incluye <code style={codeStyle}>acepto_tratamiento</code> y <code style={codeStyle}>fecha_consentimiento</code>. El campo <code style={codeStyle}>hashed_password</code> nunca se expone (queda fuera del schema <code style={codeStyle}>UsuarioOut</code>).
                    </div>
                  )}
                  {meResult.status === 401 && (
                    <div style={{ marginTop: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13 }}>
                      💡 <strong>401</strong> = "no sé quién sos". El backend no puede identificarte sin un token válido. Hacé login primero y el token quedará guardado para esta pestaña.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '12px 24px', background: '#0f172a', borderTop: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            🔗 API en <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>localhost:8000/docs</a>
          </span>
          <span style={{ fontSize: 11, color: '#334155' }}>
            Ley 25.326 · JWT HS256 · bcrypt $2b$
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Estilos inline reutilizables ──────────────────────────────────────────────
const fieldStyle = { marginBottom: 12 };
const labelStyle = { display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 5 };
const inputStyle = {
  width: '100%', padding: '9px 12px', background: '#0f172a',
  border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0',
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const btnStyle = {
  width: '100%', padding: '11px', border: 'none', borderRadius: 10,
  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  transition: 'all 0.2s', letterSpacing: 0.5,
};
const codeStyle = {
  background: 'rgba(139,92,246,0.15)', color: '#c4b5fd',
  padding: '1px 5px', borderRadius: 4, fontSize: '0.9em',
};
