import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownUp, ArrowLeft, ArrowRight, BadgeCheck, Bell, Building2,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Copy, CreditCard, Download, Ellipsis, Eye, EyeOff, FileText, Filter,
  Fingerprint, Globe2, Grid2X2, KeyRound, LayoutDashboard, LockKeyhole,
  LogOut, Mail, Menu, MoreHorizontal, MoreVertical, Search, Settings, Shield,
  ShieldAlert, ShieldCheck, Smartphone, SlidersHorizontal, Sparkles, User,
  UserCheck, UserCog, UserRound, Users, X, Zap
} from 'lucide-react';
import Orders, {initialOrders} from './Orders.jsx';
import Operations, {Overview, OverviewRail} from './Operations.jsx';
import {navigation,seed,additionalPermissions} from './data/modules';
import PermissionButton from './components/PermissionButton.jsx';
import { Package, Truck } from 'lucide-react';
import { api } from './services/api';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const money = (n) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(n);

function IconButton({ children, label, onClick, className = '' }) {
  return <button className={cx('icon-button', className)} aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

function Avatar({ initials, color = 'blue', small = false }) {
  return <div className={cx('avatar', `avatar-${color}`, small && 'avatar-small')}>{initials}</div>;
}

function StatusPill({ status }) {
  const map = { Active: 'success', Deactivated: 'muted', Suspended: 'danger' };
  return <span className={cx('status-pill', `status-${map[status] || 'muted'}`)}><i />{status}</span>;
}

function MetricCard({ icon: Icon, label, value, change, tone, footnote }) {
  return <section className="metric-card">
    <div className="metric-top"><span className={cx('metric-icon', `tone-${tone}`)}><Icon size={17} /></span><span className="metric-kicker">{label}</span><MoreHorizontal size={17} className="muted-icon" /></div>
    <div className="metric-value-row"><strong>{value}</strong>{change && <span className="metric-change">{change}</span>}</div>
    <div className="metric-foot">{footnote}</div>
  </section>;
}

function BrandMark() {
  return <div className="brand-mark" aria-label="RUNR"><span>R</span><i /></div>;
}

function Sidebar({ page, setPage, openProfile }) {
  const primary = navigation.map(([id,label,icon])=>({id,label,icon}));
  return <aside className="sidebar">
    <div className="sidebar-brand"><BrandMark /></div>
    <div className="sidebar-nav-label">WORKSPACE</div>
    <nav className="sidebar-nav">
      {primary.map(({ id, label, icon: Icon }) => <button key={id} title={label} aria-label={label} onClick={() => setPage(id)} className={cx('nav-button', page === id && 'nav-active')}>
        <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
      </button>)}
    </nav>
    <div className="sidebar-bottom">
      <button className="nav-button" title="Help centre" onClick={() => window.alert('Help centre is not connected in this preview.')}><CircleHelp size={19} /><span>Help centre</span></button>
      <button className="sidebar-user" onClick={openProfile} title="Open admin profile"><span className="sidebar-avatar">RA</span><span className="sidebar-user-text"><b>RUNR Admin</b><small>Administrator</small></span><ChevronRight size={15} /></button>
    </div>
  </aside>;
}

function Header({ query, setQuery, roleFilter, setRoleFilter, statusFilter, setStatusFilter, roles, pageLabel, onNotifications, unread, onProfile, isUsers }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const hasFilter = roleFilter !== 'All roles' || statusFilter !== 'All statuses';
  return <header className="topbar">
    <div className="breadcrumb"><span>RUNR</span><span className="crumb-slash">/</span><b>{pageLabel}</b></div>
    <div className="topbar-actions">
      {isUsers && <><div className="global-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone or ID" aria-label="Search users" /><kbd>⌘ K</kbd></div>
      <div className="filter-wrap">
        <button className={cx('filter-button', (filterOpen || hasFilter) && 'filter-button-active')} onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={15} /> Filters{hasFilter && <span className="filter-dot" />}<ChevronDown size={14} /></button>
        {filterOpen && <div className="filter-popover">
          <div className="popover-heading"><b>Filter users</b><button onClick={() => { setRoleFilter('All roles'); setStatusFilter('All statuses'); }} className="text-action">Reset</button></div>
          <label>Role<select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><option>All roles</option>{roles.map((r) => <option key={r.id}>{r.label}</option>)}</select></label>
          <label>Status<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>Deactivated</option><option>Suspended</option></select></label>
          <button className="button button-primary button-full" onClick={() => setFilterOpen(false)}>Apply filters</button>
        </div>}
      </div>
      </>}<span className="topbar-divider" />
      <IconButton label="Notifications" onClick={onNotifications}><Bell size={18} />{unread>0&&<span className="op-bell-count">{unread}</span>}</IconButton>
      <button className="topbar-profile" title="Admin profile" onClick={onProfile}><span>RA</span><ChevronDown size={13} /></button>
    </div>
  </header>;
}

function PreviewFlag() {
  return <span className="preview-flag"><span /> PREVIEW DATA</span>;
}

function UserTable({ users, onSelect, page, setPage, total, pageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return <section className="table-card">
    <div className="table-toolbar">
      <div><h2>User directory</h2><p>Search, review and manage accounts across RUNR.</p></div>
      <div className="table-actions"><span className="result-count">{total.toLocaleString()} accounts</span><button className="button button-light button-sm" onClick={() => window.alert('CSV export will be connected when the users endpoint is confirmed.')}><Download size={15} /> Export</button></div>
    </div>
    <div className="mobile-user-list">
      {users.map((u) => <button className="mobile-user-card" key={u.id} onClick={() => onSelect(u)}>
        <div className="mobile-user-top"><Avatar initials={u.initials} color={u.color} /><span><b>{u.name}</b><small>{u.id}</small></span><StatusPill status={u.status} /><ChevronRight size={16}/></div>
        <div className="mobile-user-meta"><span>{u.email}</span><span>{u.role}</span></div>
      </button>)}
      {users.length === 0 && <div className="empty-state"><span className="empty-icon"><Search size={21}/></span><b>No users found</b><p>Try another search term or clear your filters.</p></div>}
    </div>
    <div className="table-scroll">
      <table className="users-table">
        <thead><tr><th>USER</th><th>CONTACT</th><th>ROLE</th><th>STATUS</th><th>JOINED</th><th><span className="sr-only">Open user</span></th></tr></thead>
        <tbody>
          {users.map((u) => <tr key={u.id} onClick={() => onSelect(u)} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onSelect(u)}>
            <td><div className="user-cell"><Avatar initials={u.initials} color={u.color} /><span><b>{u.name}</b><small>{u.id}</small></span></div></td>
            <td><span className="contact-primary">{u.email}</span><small className="contact-secondary">{u.phone || 'No phone added'}</small></td>
            <td><span className="role-label">{u.role}</span></td>
            <td><StatusPill status={u.status} /></td>
            <td><span className="joined-date">{u.joined}</span></td>
            <td><ChevronRight size={17} className="row-chevron" /></td>
          </tr>)}
          {users.length === 0 && <tr><td colSpan="6"><div className="empty-state"><span className="empty-icon"><Search size={21} /></span><b>No users found</b><p>Try another search term or clear your filters.</p></div></td></tr>}
        </tbody>
      </table>
    </div>
    <div className="pagination"><span>Showing <b>{total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}</b> of <b>{total}</b> users</span><div className="pagination-controls"><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button><span>Page <b>{page}</b> of <b>{pages}</b></span><button aria-label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button></div></div>
  </section>;
}

function RightRail({ admin, onProfile, onSetup2FA }) {
  return <aside className="right-rail">
    <section className="rail-card admin-card">
      <div className="rail-card-top"><span className="rail-eyebrow">ADMINISTRATOR</span><button className="subtle-icon" onClick={onProfile} aria-label="Edit profile"><MoreHorizontal size={18} /></button></div>
      <div className="admin-identity"><div className="admin-avatar">RA</div><div><b>Welcome back, Admin</b><span>Your workspace is looking good.</span></div></div>
      <div className="admin-meta"><span>Current role</span><b><ShieldCheck size={14} /> {admin.role}</b></div>
      <div className="rail-separator" />
      <div className="rail-section-title"><b>Security check</b><span className="secure-tag"><i /> Protected</span></div>
      <div className="security-row"><span className="security-icon"><Fingerprint size={17} /></span><span><b>Two-factor authentication</b><small>Extra layer for your account</small></span><span className="on-pill">ON</span></div>
      <button className="rail-link" onClick={onSetup2FA}>Manage security <ArrowRight size={14} /></button>
    </section>
    <section className="rail-card activity-card">
      <div className="rail-section-title"><div><span className="rail-eyebrow">LIVE FEED</span><h3>Recent activity</h3></div><span className="live-pulse">LIVE</span></div>
      <div className="activity-list">
        <div className="activity-item"><span className="activity-mark activity-blue"><UserCheck size={14} /></span><span><b>Account verified</b><small>Ama Serwaa Mensah</small><time>12 min ago</time></span></div>
        <div className="activity-item"><span className="activity-mark activity-orange"><ShieldAlert size={14} /></span><span><b>Account suspended</b><small>Yaw Asante</small><time>48 min ago</time></span></div>
        <div className="activity-item"><span className="activity-mark activity-violet"><UserCog size={14} /></span><span><b>Role updated</b><small>Kojo Nyarko · Rider</small><time>2 hours ago</time></span></div>
      </div>
      <div className="rail-note"><InfoMark /> Activity shown here is sample content until the activity endpoint is confirmed.</div>
    </section>
    <section className="rail-tip"><div className="tip-icon"><Sparkles size={16} /></div><div><b>Admin tip</b><p>Role changes take effect on a user’s next sign-in or token refresh.</p></div></section>
    <div className="rail-footer"><span>RUNR ADMIN PORTAL</span><span>SPRINT 17 · BUILD 0.1</span></div>
  </aside>;
}

function InfoMark() { return <span className="info-mark">i</span>; }

function isForbidden(error) { return error?.status === 403 || error?.response?.status === 403; }
function PermissionError({ message = 'You do not have permission to do this. Contact your administrator to request access.', onDismiss }) {
  return <div className="permission-error" role="alert"><ShieldAlert size={19}/><div><b>Permission denied</b><p>{message}</p></div>{onDismiss && <button type="button" aria-label="Dismiss error" onClick={onDismiss}><X size={16}/></button>}</div>;
}

function UserDetail({ user, onClose, onRole, onStatus, onRecovery, onVerify, permissions, onDenied, navigate }) {
  if (!user) return null;
  return <div className="detail-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <aside className="detail-panel">
      <div className="detail-header"><div><span className="eyebrow">USER RECORD</span><h2>Account details</h2></div><IconButton label="Close details" onClick={onClose}><X size={18} /></IconButton></div>
      <div className="detail-profile"><Avatar initials={user.initials} color={user.color} /><div><h3>{user.name}</h3><span>{user.id}</span></div><StatusPill status={user.status} /></div>
      <div className="detail-actions">
        <PermissionButton onDenied={onDenied} allowed={permissions.changeRole} action="change roles" onClick={() => onRole(user)}> <UserCog size={15} /> Change role</PermissionButton>
        <PermissionButton onDenied={onDenied} allowed={permissions.changeStatus} action="change account status" onClick={() => onStatus(user)}> <Shield size={15} /> Change status</PermissionButton>
      </div>
      <div className="detail-section"><div className="section-heading"><b>Profile information</b><span className="detail-edit-label">READ ONLY</span></div>
        <DetailField icon={Mail} label="Email address" value={user.email} />
        <DetailField icon={Smartphone} label="Phone number" value={user.phone || 'Not provided'} />
        <DetailField icon={Globe2} label="Location" value={user.location} />
        <DetailField icon={Clock3} label="Joined" value={user.joined} />
      </div>
      <div className="detail-section"><div className="section-heading"><b>Account access</b></div>
        <div className="access-info-row"><span>Assigned role</span><b>{user.role}</b></div>
        <div className="access-info-row"><span>Account status</span><StatusPill status={user.status} /></div>
        <div className="access-info-row"><span>Verification</span><span className={cx('verification-label', user.verified ? 'verified' : 'pending')}>{user.verified ? <><BadgeCheck size={14} /> Verified</> : <><Clock3 size={14} /> Pending</>}</span></div>
        {!user.verified && <PermissionButton onDenied={onDenied} allowed={permissions.verifyUser} action="verify accounts" className="verify-button" onClick={() => onVerify(user)}> <BadgeCheck size={15} /> Verify account</PermissionButton>}
      </div>
      <div className="detail-section"><div className="section-heading"><b>Recent activity</b><span className="small-muted">Latest first</span></div>
        <div className="detail-timeline">{user.activity.slice(0, 4).map(([name, time], i) => <div className="timeline-row" key={`${name}-${i}`}><span className="timeline-dot" /><div><b>{name}</b><small>{time}</small></div></div>)}</div>
      </div>
      <div className="detail-section related-section"><div className="section-heading"><b>Related records</b></div><div className="related-links"><button onClick={()=>navigate("orders","customer:"+user.name)}><FileText size={15} /> Orders <ChevronRight size={13}/></button><button onClick={()=>navigate("payments","customer:"+user.name)}><CreditCard size={15} /> Payments <ChevronRight size={13}/></button></div></div>
      <div className="detail-footer"><PermissionButton onDenied={onDenied} className="button button-light" allowed={permissions.recoverAccount} action="start account recovery" onClick={() => onRecovery(user)}><KeyRound size={15} /> Start account recovery</PermissionButton></div>
    </aside>
  </div>;
}

function DetailField({ icon: Icon, label, value }) {
  return <div className="detail-field"><span className="field-icon"><Icon size={15} /></span><span><small>{label}</small><b>{value}</b></span></div>;
}

function Modal({ title, subtitle, children, onClose, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className={cx('modal', wide && 'modal-wide')} role="dialog" aria-modal="true"><div className="modal-header"><div><span className="eyebrow">RUNR ADMIN</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><IconButton label="Close dialog" onClick={onClose}><X size={18} /></IconButton></div>{children}</section></div>;
}

function RoleDialog({ user, roles, onClose, onConfirm }) {
  const [role, setRole] = useState(user.role);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const isRiderPromotion = role === 'Rider' && user.role !== 'Rider';
  async function submit() { if (!reason.trim()) return; setBusy(true); setError(null); try { await onConfirm(role, reason.trim()); } catch(e) { setError(e); } finally { setBusy(false); } }
  return <Modal title="Change user role" subtitle={`Update the access role assigned to ${user.name}.`} onClose={onClose}>
    <div className="modal-user-summary"><Avatar initials={user.initials} color={user.color} small /><span><b>{user.name}</b><small>{user.id} · Current role: {user.role}</small></span></div>
    <label className="form-label">New role<select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>{roles.map((r) => <option key={r.id} value={r.label}>{r.label}</option>)}</select></label>
    {isRiderPromotion && <div className="warning-box"><ShieldAlert size={17} /><span><b>Rider onboarding still applies</b><small>Changing this role does not bypass rider onboarding or driver approval.</small></span></div>}
    <label className="form-label">Reason for change <span className="required">*</span><textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Add a short reason for the audit record…" rows="3" /></label>
    <div className="info-box"><InfoMark /> The new role takes effect at the user’s next sign-in or token refresh.</div>
    {error && (isForbidden(error) ? <PermissionError onDismiss={() => setError(null)}/> : <div className="error-box" role="alert">Unable to complete the action. Please try again.</div>)}<div className="modal-actions"><button className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={submit} disabled={!reason.trim() || role === user.role || busy}>{busy ? 'Saving…' : 'Confirm role change'}</button></div>
  </Modal>;
}

function StatusDialog({ user, onClose, onConfirm }) {
  const [status, setStatus] = useState(user.status);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const descriptions = {
    Active: 'Allow the account to use RUNR services, subject to its assigned role.',
    Deactivated: 'Turn off account access until an administrator reactivates it.',
    Suspended: 'Restrict account access while the account is under review.'
  };
  async function submit() { if (!reason.trim()) return; setBusy(true); setError(null); try { await onConfirm(status, reason.trim()); } catch(e) { setError(e); } finally { setBusy(false); } }
  return <Modal title="Change account status" subtitle={`Choose how this account should be allowed to access RUNR.`} onClose={onClose}>
    <div className="status-options">{['Active', 'Deactivated', 'Suspended'].map((item) => <button key={item} onClick={() => setStatus(item)} className={cx('status-option', status === item && 'status-option-selected')}><span className={cx('status-radio', status === item && 'checked')} /> <span><b>{item}</b><small>{descriptions[item]}</small></span></button>)}</div>
    <label className="form-label">Reason for status change <span className="required">*</span><textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this status is being applied…" rows="3" /></label>
    {error && (isForbidden(error) ? <PermissionError onDismiss={() => setError(null)}/> : <div className="error-box" role="alert">Unable to complete the action. Please try again.</div>)}<div className="modal-actions"><button className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={submit} disabled={!reason.trim() || status === user.status || busy}>{busy ? 'Saving…' : 'Confirm status change'}</button></div>
    <p className="micro-copy">Status descriptions are draft interface copy and should be confirmed with Product before release.</p>
  </Modal>;
}

function RecoveryDialog({ user, onClose, onSend, initialSent = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(initialSent);
  const [previewRateLimited, setPreviewRateLimited] = useState(false);
  const verifiedEmail = Boolean(user.verifiedEmail && user.email);
  const verifiedPhone = Boolean(user.verifiedPhone && user.phone);
  const hasVerifiedContact = verifiedEmail || verifiedPhone;
  async function submit() { setBusy(true); setError(null); try { await onSend(user); setSent(true); } catch(e) { setError(e); } finally { setBusy(false); } }
  const mask = (value) => {
    if (!value) return 'Not available';
    if (value.includes('@')) { const [a, d] = value.split('@'); return `${a.slice(0, 2)}••••@${d}`; }
    return `${value.slice(0, 5)}••••${value.slice(-2)}`;
  };
  return <Modal title={sent ? 'Recovery request sent' : 'Start account recovery'} subtitle={sent ? 'The recovery request was accepted by the preview service.' : 'A secure reset will be sent to the user’s own verified contact.'} onClose={onClose}>
    {sent ? <div className="success-state"><span><CheckCircle2 size={27} /></span><h3>Recovery message queued</h3><p>The user will receive instructions at their verified contact. The administrator never sees or sets a password.</p><button className="button button-primary button-full" onClick={onClose}>Done</button></div> : <>
      <div className="recovery-person"><Avatar initials={user.initials} color={user.color} /><span><b>{user.name}</b><small>{user.id}</small></span></div>
      {hasVerifiedContact ? <div className="masked-contact">{verifiedEmail && <><span><Mail size={16} /> Verified email</span><b>{mask(user.email)}</b></>}{verifiedPhone && <><span><Smartphone size={16} /> Verified phone</span><b>{mask(user.phone)}</b></>}</div> : <div className="error-box"><ShieldAlert size={17} /><span><b>No verified contact available</b><small>This account has no verified phone or email. Recovery cannot be started until a contact is verified.</small></span></div>}
      {previewRateLimited && <div className="error-box"><ShieldAlert size={17}/><span><b>Too many recovery attempts</b><small>For security, wait before trying account recovery again.</small></span></div>}
      <div className="info-box"><LockKeyhole size={15} /> RUNR admins cannot view, create or set a user’s password.</div>
      {error && (isForbidden(error) ? <PermissionError onDismiss={() => setError(null)}/> : <div className="error-box" role="alert">Unable to complete the action. Please try again.</div>)}<div className="modal-actions"><button className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={!hasVerifiedContact || busy || previewRateLimited} onClick={submit}>{busy ? 'Sending…' : 'Send recovery instructions'}</button></div>
      {hasVerifiedContact && <button className="preview-state-link" onClick={() => setPreviewRateLimited((v) => !v)}>{previewRateLimited ? 'Hide' : 'Preview'} rate-limit state</button>}
      <p className="micro-copy">Rate limiting and delivery confirmation require the confirmed recovery endpoint.</p>
    </>}
  </Modal>;
}

function TwoFactorDialog({ mode, onClose, onSuccess, onDisable }) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const secret = 'RUNR-7YQ8-4K2M-P9XT';
  function confirm() {
    if (code.trim() !== '000000') { setError('That code does not match. Try the demo code 000000.'); return; }
    onSuccess();
  }
  if (mode === 'disable') return <Modal title="Turn off two-factor authentication?" subtitle="This removes the extra sign-in check from this administrator account." onClose={onClose}>
    <div className="warning-box"><ShieldAlert size={17} /><span><b>Your account will have less protection</b><small>You can set up two-factor authentication again at any time.</small></span></div>
    <div className="modal-actions"><button className="button button-light" onClick={onClose}>Keep it on</button><button className="button button-danger" onClick={onDisable}>Turn off 2FA</button></div>
  </Modal>;
  return <Modal title="Set up two-factor authentication" subtitle="Use an authenticator app to add a second layer of protection." onClose={onClose}>
    <div className="setup-steps"><span className="step active"><i>1</i> Scan or copy</span><span className="step-line" /><span className="step active"><i>2</i> Confirm code</span></div>
    <div className="qr-layout"><div className="fake-qr" aria-label="Illustrative QR code"><div className="qr-finder qr-one"/><div className="qr-finder qr-two"/><div className="qr-finder qr-three"/><div className="qr-noise"/></div><div className="qr-copy"><b>Can’t scan the code?</b><p>Enter this setup key manually in your authenticator app.</p><div className="secret-key">{secret}<button onClick={() => { navigator.clipboard?.writeText(secret); setCopied(true); }} aria-label="Copy secret key"><Copy size={14} /></button></div><small>{copied ? 'Copied to clipboard' : 'Demo setup key — not a live credential'}</small></div></div>
    <label className="form-label">Enter the 6-digit code <span className="required">*</span><input className="form-control code-input" inputMode="numeric" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} placeholder="000000" /></label>
    {error && <p className="inline-error">{error}</p>}
    <div className="info-box"><InfoMark /> For this front-end demo only, use <b>000000</b>. Connect the real 2FA endpoint before release.</div>
    <div className="modal-actions"><button className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={confirm} disabled={code.length !== 6}>Confirm and enable</button></div>
  </Modal>;
}

function SessionDialog({ onClose, onLogin, allDevices = false }) {
  return <Modal title={allDevices ? 'Sign out of all devices?' : 'Your session has expired'} subtitle={allDevices ? 'This will end every active administrator session.' : 'For your security, you have been signed out. Sign in again to continue.'} onClose={onClose}>
    <div className="session-illustration"><div><LockKeyhole size={24} /></div><span>SECURE SESSION</span></div>
    <p className="session-copy">{allDevices ? 'You will need to sign in again on every device.' : 'After signing in, you can return to the page you were working on.'}</p>
    <div className="modal-actions"><button className="button button-light" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={onLogin}>{allDevices ? 'Sign out all devices' : 'Back to sign in'}</button></div>
  </Modal>;
}

function ProfilePage({ admin, twoFactor, onTwoFactor, onSession, onLogoutAll, onLogout }) {
  return <div className="profile-page">
    <div className="page-heading"><div><span className="eyebrow">ACCOUNT SETTINGS</span><h1>My profile</h1><p>Manage your administrator profile, security and active sessions.</p></div><span className="header-chip"><ShieldCheck size={14} /> Admin workspace</span></div>
    <div className="profile-grid">
      <section className="content-card profile-main"><div className="profile-hero"><div className="profile-avatar">RA</div><div><h2>{admin.name}</h2><p>{admin.email}</p><span className="role-chip"><ShieldCheck size={13} /> {admin.role}</span></div><button className="button button-light button-sm" onClick={() => window.alert('Profile editing is not included in the Sprint 17 source scope.')}>Edit profile</button></div>
        <div className="card-divider"/><div className="section-heading"><b>Personal information</b><span className="detail-edit-label">READ ONLY</span></div><div className="profile-fields"><DetailField icon={User} label="Full name" value={admin.name} /><DetailField icon={Mail} label="Email address" value={admin.email} /><DetailField icon={ShieldCheck} label="Administrator role" value={admin.role} /></div>
      </section>
      <section className="content-card"><div className="section-heading"><div><span className="eyebrow">ACCOUNT SECURITY</span><h2>Two-factor authentication</h2></div><span className={cx('security-status', twoFactor ? 'good' : 'needs-setup')}>{twoFactor ? 'Enabled' : 'Not enabled'}</span></div><p className="card-description">Protect administrator sign-in with a verification code from your authenticator app.</p><div className="security-feature"><span className="security-feature-icon"><Fingerprint size={20}/></span><span><b>Authenticator app</b><small>{twoFactor ? 'A second verification step is active.' : 'Add a second verification step to protect your account.'}</small></span></div><button className={cx('button', twoFactor ? 'button-light' : 'button-primary', 'button-full')} onClick={onTwoFactor}>{twoFactor ? 'Manage two-factor authentication' : 'Set up two-factor authentication'}</button></section>
      <section className="content-card sessions-card"><div className="section-heading"><div><span className="eyebrow">DEVICE MANAGEMENT</span><h2>Active sessions</h2></div><span className="session-count">{(admin.sessions || []).filter((session) => session.active).length} devices</span></div><p className="card-description">Review where your administrator account is signed in.</p>{(admin.sessions || []).filter((session) => session.active).map((session) => <div className="session-row" key={session.device}><span className="session-device">{session.device.toLowerCase().includes('iphone') ? <Smartphone size={18}/> : <LaptopIcon/>}</span><span><b>{session.device}</b><small>{session.detail}</small></span>{session.current ? <span className="current-session"><i/> Current</span> : <button className="text-action" onClick={() => onSession(session)}>Sign out</button>}</div>)}{(admin.sessions || []).filter((session) => session.active).length === 0 && <div className="empty-sessions">No other active sessions.</div>}<div className="session-bottom"><span>Last activity updates when a session is refreshed.</span><button className="button button-light button-sm" onClick={onLogout}><LogOut size={14} /> Sign out this device</button><button className="button button-light button-sm" onClick={onLogoutAll}><LogOut size={14} /> Sign out all devices</button></div></section>
    </div>
  </div>;
}

function LaptopIcon() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="16" height="12" rx="1.5"/><path d="M2 20h20l-1.2-3H3.2L2 20Z"/></svg>; }

function AccessPage({ admin, onToggle }) {
  const permissions = [
    ['Change user roles', admin.permissions.changeRole, 'Assign a role returned by the roles API.'],
    ['Change account status', admin.permissions.changeStatus, 'Activate, deactivate or suspend a user account.'],
    ['Verify accounts', admin.permissions.verifyUser, 'Update a user’s verification state.'],
    ['Start account recovery', admin.permissions.recoverAccount, 'Send a reset to the user’s own verified contact.'], ...[['assignRider','Assign riders'],['retryMatching','Retry matching'],['updateOrderStatus','Update order status'],['cancelOrder','Cancel orders'],['overrideCancellation','Override cancellation'],['bookParcel','Book parcels']].map(([key,label])=>[label,admin.permissions[key],'Parcel operations permission']), ...Object.keys(additionalPermissions).map(key=>[key.replace(/([A-Z])/g,' $1'),admin.permissions[key],'Operational permission'])
  ];
  return <div className="page-content"><div className="page-heading"><div><span className="eyebrow">ADMIN GOVERNANCE</span><h1>Access & permissions</h1><p>Understand the actions available to your administrator account.</p></div><span className="header-chip"><LockKeyhole size={14}/> Permission-aware UI</span></div>
    <button className="button button-light" onClick={onToggle}>Toggle restricted permissions (demo)</button><div className="access-banner"><div className="access-banner-icon"><ShieldCheck size={23}/></div><div><b>Permissions are checked per action</b><p>Controls should be hidden or disabled when the signed-in administrator lacks the relevant permission. The values below are preview data.</p></div><PreviewFlag /></div>
    <section className="content-card permission-card"><div className="section-heading"><div><span className="eyebrow">CURRENT ADMIN</span><h2>{admin.role}</h2></div><span className="security-status good">Preview permissions</span></div><div className="permission-list">{permissions.map(([name, enabled, desc]) => <div className="permission-row" key={name}><span className={cx('permission-icon', enabled ? 'permission-yes' : 'permission-no')}>{enabled ? <Check size={16}/> : <LockKeyhole size={15}/>}</span><span><b>{name}</b><small>{desc}</small></span><span className={cx('permission-state', enabled ? 'permission-granted' : 'permission-denied')}>{enabled ? 'Granted' : 'Not granted'}</span></div>)}</div><div className="permission-foot"><InfoMark/> Permissions should be sourced from the administrator context/permissions contract; proposed permissions endpoint is mocked for now.</div></section>
    <section className="content-card roles-note"><div className="section-heading"><div><span className="eyebrow">ROLE MANAGEMENT</span><h2>Dynamic role options</h2></div><span className="endpoint-tag proposed">PROPOSED ENDPOINT</span></div><p className="card-description">The role selector on a user record is populated by the roles service response. The interface does not assume a permanent list of role names.</p><div className="role-chips"><span>Customer</span><span>Rider</span><span>Partner staff</span><span>Administrator</span></div><small className="micro-copy">The chips above are sample values returned by the local mock service only.</small></section>
  </div>;
}

function LaptopChart() {
  return <div className="chart-wrap"><div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><svg viewBox="0 0 620 190" preserveAspectRatio="none" role="img" aria-label="Illustrative user activity trend"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3293e9" stopOpacity=".22"/><stop offset="100%" stopColor="#3293e9" stopOpacity="0"/></linearGradient></defs><path d="M0 147 C45 137 52 103 102 111 S166 147 210 106 S264 87 306 99 S357 128 405 69 S469 56 518 43 S578 53 620 24 L620 190 L0 190 Z" fill="url(#chartFill)"/><path d="M0 147 C45 137 52 103 102 111 S166 147 210 106 S264 87 306 99 S357 128 405 69 S469 56 518 43 S578 53 620 24" fill="none" stroke="#3293e9" strokeWidth="3" strokeLinecap="round"/><path d="M0 15H620M0 58H620M0 101H620M0 144H620M0 187H620" stroke="#e8edf5" strokeDasharray="4 5"/><circle cx="405" cy="69" r="5" fill="#fff" stroke="#3293e9" strokeWidth="3"/></svg><div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div>;
}

function OverviewPage({ users, setPage, onSelect }) {
  const active = users.filter((u) => u.status === 'Active').length;
  const pending = users.filter((u) => !u.verified).length;
  return <div className="page-content"><div className="page-heading"><div><span className="eyebrow">WORKSPACE OVERVIEW</span><h1>Good afternoon, Admin <span className="wave">✦</span></h1><p>Here’s what’s happening across your RUNR accounts today.</p></div><PreviewFlag /></div>
    <div className="metric-grid"><MetricCard icon={Users} label="Total accounts" value={users.length.toLocaleString()} change="Preview" tone="blue" footnote="Across all account roles"/><MetricCard icon={UserCheck} label="Active accounts" value={active.toLocaleString()} change="Preview" tone="green" footnote="Currently marked active"/><MetricCard icon={ShieldAlert} label="Needs attention" value={pending.toLocaleString()} change="Preview" tone="orange" footnote="Verification not complete"/></div>
    <div className="overview-grid"><section className="content-card chart-card"><div className="section-heading"><div><span className="eyebrow">ACCOUNT ACTIVITY</span><h2>Engagement overview</h2></div><span className="select-chip">Last 7 days <ChevronDown size={13}/></span></div><div className="chart-legend"><span><i/> Account activity</span><small>Illustrative trend · not live analytics</small></div><LaptopChart/></section><section className="content-card status-breakdown"><div className="section-heading"><div><span className="eyebrow">ACCOUNT HEALTH</span><h2>Status breakdown</h2></div><span className="mini-donut"><span/></span></div><div className="status-total"><b>{users.length}</b><small>Total users</small></div><div className="breakdown-list"><div><span><i className="dot-green"/> Active</span><b>{active}</b></div><div><span><i className="dot-grey"/> Deactivated</span><b>{users.filter((u) => u.status === 'Deactivated').length}</b></div><div><span><i className="dot-red"/> Suspended</span><b>{users.filter((u) => u.status === 'Suspended').length}</b></div></div><button className="rail-link" onClick={() => setPage('users')}>View user directory <ArrowRight size={14}/></button></section></div>
    <section className="content-card overview-users"><div className="section-heading"><div><span className="eyebrow">LATEST ACCOUNTS</span><h2>Recently joined</h2></div><button className="text-action" onClick={() => setPage('users')}>View all users <ArrowRight size={14}/></button></div><div className="recent-user-list">{users.slice(0, 4).map((u) => <button className="recent-user-row" key={u.id} onClick={() => onSelect(u)}><div className="user-cell"><Avatar initials={u.initials} color={u.color} small/><span><b>{u.name}</b><small>{u.id}</small></span></div><span className="recent-user-role">{u.role}</span><StatusPill status={u.status}/><span className="joined-date">{u.joined}</span><ChevronRight size={16}/></button>)}</div></section>
  </div>;
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@runr.app');
  const [password, setPassword] = useState('RunrDemo!');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState(false);
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); if (network) { setError('Network connection unavailable. Check your connection and try again.'); setBusy(false); return; } const response = await api.login({ email, password }); if (response.ok) onLogin(response); else setError(response.reason === 'suspended' ? 'This administrator account is suspended. Contact your organisation owner.' : 'Those sign-in details do not match an administrator account.'); setBusy(false); }
  return <main className="auth-screen"><div className="auth-ambient ambient-one"/><div className="auth-ambient ambient-two"/><div className="auth-card"><div className="auth-brand"><BrandMark/><span>RUNR <small>ADMIN</small></span></div><div className="auth-heading"><span className="eyebrow">SECURE ADMIN ACCESS</span><h1>Welcome back.</h1><p>Sign in to manage your RUNR workspace.</p></div><form onSubmit={submit} className="auth-form"><label className="form-label">Email address<input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required/></label><label className="form-label">Password<div className="password-wrap"><input className="form-control" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label><div className="auth-helper"><label className="checkbox-label"><input type="checkbox" defaultChecked/> Remember this device</label><button type="button" className="text-action" onClick={() => window.alert('Password recovery is handled through the verified contact flow.')}>Forgot password?</button></div>{error && <div className="auth-error"><ShieldAlert size={16}/>{error}</div>}<button className="button button-primary button-full auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'} <ArrowRight size={16}/></button></form><div className="auth-divider"><span/> <small>OR CONTINUE WITH</small><span/></div><div className="social-auth"><button onClick={() => setError('Google sign-in is a visual placeholder until the identity provider is configured.')}>G <span>Google</span></button><button onClick={() => setError('Facebook sign-in is a visual placeholder until the identity provider is configured.')}>f <span>Facebook</span></button><button onClick={() => setError('Apple sign-in is a visual placeholder until the identity provider is configured.')}>● <span>Apple</span></button></div><button className="network-toggle" onClick={() => {setNetwork(!network); setError('')}}>{network ? 'Switch off' : 'Simulate'} network error</button><div className="auth-bottom"><span><LockKeyhole size={13}/> Protected administrator access</span></div><div className="auth-demo"><b>Demo sign-in</b><span>admin@runr.app</span><span>RunrDemo!</span><small>Use code 000000 at the 2FA step.</small></div></div><div className="auth-footer">© 2026 RUNR · ADMINISTRATION PORTAL <span>SPRINT 17 PROTOTYPE</span></div></main>;
}

function TwoFactorLogin({ onVerify, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); if (code === '000000') onVerify(); else setError('The code is not valid. Please try again.'); }
  return <main className="auth-screen"><div className="auth-ambient ambient-one"/><div className="auth-card auth-card-short"><div className="auth-brand"><BrandMark/><span>RUNR <small>ADMIN</small></span></div><div className="auth-icon-large"><Fingerprint size={27}/></div><div className="auth-heading centered"><span className="eyebrow">SECOND STEP</span><h1>Verify it’s you.</h1><p>Enter the 6-digit code from your authenticator app.</p></div><form onSubmit={submit} className="auth-form"><label className="form-label">Authentication code<input className="form-control code-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => {setCode(e.target.value.replace(/\D/g,'').slice(0,6));setError('')}} placeholder="000000" required/></label>{error && <p className="inline-error">{error}</p>}<button className="button button-primary button-full auth-submit" disabled={code.length !== 6}>Verify and continue <ArrowRight size={16}/></button></form><div className="auth-bottom auth-bottom-centered"><button onClick={onBack}><ArrowLeft size={14}/> Back to sign in</button><span>Demo code: 000000</span></div></div><div className="auth-footer">© 2026 RUNR · SECURE ADMIN ACCESS</div></main>;
}

export default function App() {
  const [page, setPage] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders,setOrders]=useState(()=>structuredClone(initialOrders));
  const [ops,setOps]=useState(()=>structuredClone(seed));
  const [routeFilter,setRouteFilter]=useState('');
  const [routeVersion,setRouteVersion]=useState(0);
  function navigate(target,filter=''){const permission={audit:'readAudit',notifications:'readNotifications'}[target];if(permission&&!admin.permissions?.[permission]){setPermissionError('You do not have permission to do this.');return;}setRouteFilter(filter);setRouteVersion(v=>v+1);setPage(target);setSelectedUser(null);}
  function log(entry){setOps(prev=>({...prev,audit:[{id:crypto.randomUUID(),date:new Date().toISOString(),admin:admin.name,status:'Succeeded',...entry},...prev.audit]}));}

  const [roles, setRoles] = useState([]);
  const [admin, setAdmin] = useState({ name: 'RUNR Admin', role: 'Administrator', email: 'admin@runr.app', permissions: { changeRole: true, changeStatus: true, verifyUser: true, recoverAccount: true, assignRider: true, retryMatching: true, updateOrderStatus: true, cancelOrder: true, overrideCancellation: true, bookParcel: true, ...additionalPermissions } });
  const [twoFactor, setTwoFactor] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [loginStage, setLoginStage] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  function requirePermission(key) { if (!admin.permissions?.[key]) throw Object.assign(new Error('Forbidden'), {status:403}); }
  function togglePermissionPreview() { setAdmin(a => ({...a, permissions: Object.fromEntries(Object.keys(a.permissions).map(k => [k, Object.values(a.permissions).every(Boolean) ? k === "verifyUser" : true]))})); }
  const [pendingLogin, setPendingLogin] = useState(null);
  const [returnPage, setReturnPage] = useState('users');
  const pageSize = 5;

  useEffect(() => { (async () => { const [userResult, roleResult, me] = await Promise.all([api.getUsers(), api.getRoles(), api.getMe()]); setUsers(userResult.items); setRoles(roleResult); setAdmin({...me,permissions:{...me.permissions,...additionalPermissions}}); })(); }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3200); return () => clearTimeout(timer); }, [toast]);

  const filteredUsers = useMemo(() => users.filter((u) => {
    const haystack = `${u.name} ${u.email} ${u.phone} ${u.id}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (roleFilter === 'All roles' || u.role === roleFilter) && (statusFilter === 'All statuses' || u.status === statusFilter);
  }), [users, query, roleFilter, statusFilter]);
  const currentUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setCurrentPage(1); }, [query, roleFilter, statusFilter]);

  async function refreshUsers() { const result = await api.getUsers(); setUsers(result.items); if (selectedUser) setSelectedUser(result.items.find((u) => u.id === selectedUser.id) || null); }
  function closeModal() { setModal(null); }
  function notify(text) { setToast(text); }
  async function applyRole(role, reason) { requirePermission("changeRole"); const user = modal.user; await api.changeRole(user.id, role, reason); log({module:"users",action:"Change role",name:user.name,object:user.id,before:{role:user.role},after:{role},reason}); await refreshUsers(); setModal(null); notify(`Role updated to ${role}.`); }
  async function applyStatus(status, reason) { requirePermission("changeStatus"); const user = modal.user; await api.changeStatus(user.id, status, reason); log({module:"users",action:"Change status",name:user.name,object:user.id,before:{status:user.status},after:{status},reason}); await refreshUsers(); setModal(null); notify(`Account status changed to ${status}.`); }
  async function applyRecovery(user) { requirePermission("recoverAccount"); await api.sendRecovery(user.id); log({module:"users",action:"Account recovery",name:user.name,object:user.id,before:null,after:{request:"Simulated"},reason:"Account recovery"}); setModal({ type: 'recovery-sent', user }); }
  async function verifyUser(user) { try { requirePermission("verifyUser"); await api.verifyUser(user.id); log({module:"users",action:"Verify account",name:user.name,object:user.id,before:{verified:user.verified},after:{verified:true},reason:"Verification"}); } catch(e) { if(isForbidden(e)) setPermissionError("You do not have permission to do this. You cannot verify this account."); else notify("Verification failed. Try again."); return; } await refreshUsers(); setSelectedUser((current) => current ? { ...current, verified: true, activity: [['Account verified', 'Just now'], ...current.activity] } : current); notify('Account marked as verified in preview data.'); }
  function handleLogin(response) { setPendingLogin(response); if (response.requires2FA) setLoginStage('2fa'); else { setSignedIn(true); setLoginStage('dashboard'); } }
  function finishLogin() { setSignedIn(true); setLoginStage('dashboard'); setPage(returnPage); notify('You’re signed in to the RUNR admin preview.'); }
  function signOut() { setSignedIn(false); setLoginStage('login'); setModal(null); setSelectedUser(null); }
  const pageLabel = navigation.find(([id])=>id===page)?.[1]||'My profile';

  if (!signedIn) {
    if (loginStage === '2fa') return <TwoFactorLogin onVerify={finishLogin} onBack={() => setLoginStage('login')}/>;
    return <LoginScreen onLogin={handleLogin}/>;
  }

  return <div className="app-background">
    <div className="app-shell">
      <Sidebar page={page} setPage={navigate} openProfile={() => setPage('profile')}/>
      <div className="app-main">
        <Header query={query} setQuery={setQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} roles={roles} pageLabel={pageLabel} onNotifications={() => navigate('notifications')} unread={ops.notifications.filter(n=>n.status==='Unread').length} onProfile={()=>navigate('profile')} isUsers={page==='users'} />
        <div className={cx("workspace-grid",!["overview","users","orders","dispatch"].includes(page)&&"full-workspace")}>
          <div style={{display:['orders','dispatch'].includes(page)?'contents':'none'}}><Orders mode={page} admin={admin} onDenied={setPermissionError} orders={orders} setOrders={setOrders} filter={routeFilter} routeVersion={routeVersion} users={users} log={log} ops={ops}/></div>
          <main style={{display:['orders','dispatch'].includes(page)?'none':undefined}} className="workspace-content">
            {page === 'users' && <div className="page-content"><div className="page-heading"><div><span className="eyebrow">PEOPLE & ACCESS</span><h1>Manage your people.</h1><p>One place to keep every RUNR account in order.</p></div><PreviewFlag/></div>
              <div className="metric-grid"><MetricCard icon={Users} label="Total accounts" value={users.length.toLocaleString()} tone="blue" footnote="Across all account roles"/><MetricCard icon={UserCheck} label="Active accounts" value={users.filter((u) => u.status === 'Active').length.toLocaleString()} tone="green" footnote="Marked active in preview data"/><MetricCard icon={ShieldAlert} label="Needs attention" value={users.filter((u) => u.status !== 'Active' || !u.verified).length.toLocaleString()} tone="orange" footnote="Status or verification review"/></div>
              {(roleFilter !== 'All roles' || statusFilter !== 'All statuses') && <div className="active-filters"><span>Active filters</span>{roleFilter !== 'All roles' && <button onClick={() => setRoleFilter('All roles')}>{roleFilter} <X size={12}/></button>}{statusFilter !== 'All statuses' && <button onClick={() => setStatusFilter('All statuses')}>{statusFilter} <X size={12}/></button>}<button className="clear-filters" onClick={() => {setRoleFilter('All roles');setStatusFilter('All statuses')}}>Clear all</button></div>}
              <UserTable users={currentUsers} onSelect={setSelectedUser} page={currentPage} setPage={setCurrentPage} total={filteredUsers.length} pageSize={pageSize}/>
            </div>}
            {page === 'overview' && <Overview data={ops} orders={orders} navigate={navigate} admin={admin}/>}
            {['drivers','documents','payments','carriers','offices','notifications','audit'].includes(page)&&<Operations key={page+routeVersion} mode={page} filter={routeFilter} data={ops} setData={setOps} orders={orders} setOrders={setOrders} admin={admin} users={users} navigate={navigate} log={log} onDenied={setPermissionError} notify={notify}/>}
            {page === 'profile' && <ProfilePage admin={admin} twoFactor={twoFactor} onTwoFactor={() => setModal({type: twoFactor ? 'disable-2fa' : 'setup-2fa'})} onSession={(session) => {setAdmin((current) => ({...current, sessions: current.sessions.filter((item) => item.device !== session.device)}));notify(`${session.device} signed out in preview.`);}} onLogoutAll={() => setModal({type: 'logout-all'})} onLogout={()=>{setReturnPage(page);signOut()}}/>}
            {page === 'access' && <AccessPage admin={admin} onToggle={togglePermissionPreview}/>}
            <footer className="workspace-footer"><span>RUNR ADMIN <i>·</i> SPRINT 17 PROTOTYPE</span><span>Built for clarity. Designed for control.</span></footer>
          </main>
          {page === 'overview' && <OverviewRail data={ops} orders={orders} navigate={navigate} admin={admin}/>}
          {page === 'users' && <RightRail admin={admin} onProfile={() => setPage('profile')} onSetup2FA={() => setModal({type: twoFactor ? 'disable-2fa' : 'setup-2fa'})}/>}
        </div>
      </div>
    </div>
    {selectedUser && <UserDetail user={users.find((u) => u.id === selectedUser.id) || selectedUser} onClose={() => setSelectedUser(null)} onRole={(user) => setModal({type:'role', user})} onStatus={(user) => setModal({type:'status', user})} onRecovery={(user) => setModal({type:'recovery', user})} onVerify={verifyUser} permissions={admin.permissions} onDenied={setPermissionError} navigate={navigate}/>}
    {modal?.type === 'role' && <RoleDialog user={modal.user} roles={roles} onClose={closeModal} onConfirm={applyRole}/>}
    {modal?.type === 'status' && <StatusDialog user={modal.user} onClose={closeModal} onConfirm={applyStatus}/>}
    {modal?.type === 'recovery' && <RecoveryDialog user={modal.user} onClose={closeModal} onSend={applyRecovery}/>}
    {modal?.type === 'recovery-sent' && <RecoveryDialog user={modal.user} onClose={closeModal} onSend={applyRecovery} initialSent/>}
    {modal?.type === 'setup-2fa' && <TwoFactorDialog mode="setup" onClose={closeModal} onSuccess={async () => {await api.setTwoFactorEnabled(true);setTwoFactor(true);closeModal();notify('Two-factor authentication enabled in preview.')}}/>}
    {modal?.type === 'disable-2fa' && <TwoFactorDialog mode="disable" onClose={closeModal} onDisable={async () => {await api.setTwoFactorEnabled(false);setTwoFactor(false);closeModal();notify('Two-factor authentication disabled in preview.')}}/>}
    {modal?.type === 'logout-all' && <SessionDialog allDevices onClose={closeModal} onLogin={async () => {await api.logoutAll();signOut();}}/>}
    {permissionError && <div className="permission-toast"><PermissionError message={permissionError} onDismiss={() => setPermissionError(false)}/></div>}{toast && <div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={() => setToast('')}><X size={14}/></button></div>}
    <button className="simulate-session" onClick={() => {setReturnPage(page);setModal({type:'session-expired'});}}><Clock3 size={13}/> Simulate session expiry</button>
    {modal?.type === 'session-expired' && <SessionDialog onClose={closeModal} onLogin={() => {signOut();}}/>}
  </div>;
}
