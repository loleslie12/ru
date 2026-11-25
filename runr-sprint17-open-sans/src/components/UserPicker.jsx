import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Search, UserPlus, X } from 'lucide-react';

/**
 * Reusable Sprint 17 user picker.
 * The create option is deliberately hidden unless allowCreate is true.
 */
export default function UserPicker({
  users = [],
  value = null,
  onChange,
  allowCreate = false,
  onCreate,
  placeholder = 'Search by name, phone or email',
  disabled = false,
  label = 'Choose a user'
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = users.find((user) => user.id === value) || null;
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users.slice(0, 6);
    return users.filter((user) => `${user.name} ${user.email} ${user.phone} ${user.id}`.toLowerCase().includes(term)).slice(0, 8);
  }, [users, query]);

  function choose(user) {
    onChange?.(user);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="user-picker">
      <label className="user-picker-label">{label}</label>
      <button type="button" className="user-picker-trigger" disabled={disabled} onClick={() => setOpen((current) => !current)}>
        <span>{selected ? <><b>{selected.name}</b><small>{selected.phone || selected.email}</small></> : <span className="user-picker-placeholder">{placeholder}</span>}</span>
        {selected ? <span className="user-picker-clear" role="button" tabIndex={0} aria-label="Clear selected user" onClick={(event) => { event.stopPropagation(); onChange?.(null); }}><X size={14}/></span> : <ChevronDown size={15}/>}
      </button>
      {open && <div className="user-picker-menu">
        <div className="user-picker-search"><Search size={14}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder}/></div>
        <div className="user-picker-results">
          {matches.map((user) => <button type="button" key={user.id} className="user-picker-result" onClick={() => choose(user)}>
            <span className="user-picker-initials">{user.initials || user.name?.slice(0, 2).toUpperCase()}</span>
            <span><b>{user.name}</b><small>{user.phone || user.email} · {user.role}</small></span>
            {value === user.id && <Check size={15}/>}
          </button>)}
          {matches.length === 0 && <p className="user-picker-empty">No matching users found.</p>}
        </div>
        {allowCreate && <button type="button" className="user-picker-create" onClick={() => { setOpen(false); onCreate?.(query); }}><UserPlus size={14}/> Create new user</button>}
      </div>}
    </div>
  );
}
