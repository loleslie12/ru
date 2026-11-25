// Preview-only records. Replace these with responses from confirmed API endpoints.
export const initialUsers = [
  {
    id: 'USR-02841', name: 'Ama Serwaa Mensah', email: 'ama.mensah@example.com', phone: '+233 24 555 0194',
    role: 'Customer', status: 'Active', verified: true, verifiedEmail: true, verifiedPhone: true, joined: '18 Nov 2026', lastSeen: 'Today, 10:42 AM',
    location: 'Accra, Ghana', initials: 'AM', color: 'lilac', activity: [
      ['Signed in', 'Today · 10:42 AM'], ['Email verified', '12 Nov 2026 · 2:18 PM'], ['Account created', '18 Nov 2026 · 9:06 AM']
    ]
  },
  {
    id: 'USR-02840', name: 'Kofi Owusu', email: 'kofi.owusu@example.com', phone: '+233 20 318 4472',
    role: 'Rider', status: 'Active', verified: true, verifiedEmail: true, verifiedPhone: true, joined: '16 Nov 2026', lastSeen: 'Today, 9:17 AM',
    location: 'Tema, Ghana', initials: 'KO', color: 'mint', activity: [
      ['Profile updated', 'Today · 9:17 AM'], ['Phone verified', '15 Nov 2026 · 4:03 PM'], ['Account created', '16 Nov 2026 · 8:30 AM']
    ]
  },
  {
    id: 'USR-02839', name: 'Nana Akua Boateng', email: 'nana.boateng@example.com', phone: '+233 55 901 2381',
    role: 'Partner staff', status: 'Deactivated', verified: true, verifiedEmail: true, verifiedPhone: false, joined: '14 Nov 2026', lastSeen: '14 Nov 2026',
    location: 'East Legon, Ghana', initials: 'NB', color: 'peach', activity: [
      ['Account deactivated', '15 Nov 2026 · 11:24 AM'], ['Signed in', '14 Nov 2026 · 6:50 PM'], ['Account created', '14 Nov 2026 · 12:11 PM']
    ]
  },
  {
    id: 'USR-02838', name: 'Yaw Asante', email: 'yaw.asante@example.com', phone: '+233 27 774 9102',
    role: 'Customer', status: 'Suspended', verified: false, verifiedEmail: false, verifiedPhone: false, joined: '12 Nov 2026', lastSeen: '11 Nov 2026',
    location: 'Madina, Ghana', initials: 'YA', color: 'blue', activity: [
      ['Account suspended', '12 Nov 2026 · 3:21 PM'], ['Verification pending', '12 Nov 2026 · 3:18 PM'], ['Account created', '12 Nov 2026 · 3:02 PM']
    ]
  },
  {
    id: 'USR-02837', name: 'Efua Addo', email: 'efua.addo@example.com', phone: '+233 50 663 7108',
    role: 'Customer', status: 'Active', verified: true, verifiedEmail: true, verifiedPhone: false, joined: '10 Nov 2026', lastSeen: 'Yesterday, 7:34 PM',
    location: 'Osu, Ghana', initials: 'EA', color: 'rose', activity: [
      ['Signed in', 'Yesterday · 7:34 PM'], ['Email verified', '10 Nov 2026 · 10:05 AM'], ['Account created', '10 Nov 2026 · 9:52 AM']
    ]
  },
  {
    id: 'USR-02836', name: 'Kojo Nyarko', email: 'kojo.nyarko@example.com', phone: '+233 26 481 5503',
    role: 'Rider', status: 'Active', verified: false, verifiedEmail: false, verifiedPhone: false, joined: '08 Nov 2026', lastSeen: 'Yesterday, 5:11 PM',
    location: 'Spintex, Ghana', initials: 'KN', color: 'gold', activity: [
      ['Signed in', 'Yesterday · 5:11 PM'], ['Verification pending', '08 Nov 2026 · 1:08 PM'], ['Account created', '08 Nov 2026 · 1:01 PM']
    ]
  },
  {
    id: 'USR-02835', name: 'Adwoa Frimpong', email: 'adwoa.frimpong@example.com', phone: '+233 24 194 2280',
    role: 'Partner staff', status: 'Active', verified: true, verifiedEmail: true, verifiedPhone: true, joined: '06 Nov 2026', lastSeen: '06 Nov 2026',
    location: 'Airport Residential, Ghana', initials: 'AF', color: 'lilac', activity: [
      ['Role assigned', '06 Nov 2026 · 11:44 AM'], ['Email verified', '06 Nov 2026 · 11:40 AM'], ['Account created', '06 Nov 2026 · 11:22 AM']
    ]
  },
  {
    id: 'USR-02834', name: 'Kwame Tetteh', email: 'kwame.tetteh@example.com', phone: '',
    role: 'Customer', status: 'Active', verified: false, verifiedEmail: false, verifiedPhone: false, joined: '04 Nov 2026', lastSeen: '—',
    location: 'Accra, Ghana', initials: 'KT', color: 'mint', activity: [
      ['Account created', '04 Nov 2026 · 8:12 AM']
    ]
  }
];

// The product brief says role options must come from the API. This mock response
// stands in for that endpoint until Backend confirms it is available.
export const mockRoleResponse = [
  { id: 'role_customer', label: 'Customer' },
  { id: 'role_rider', label: 'Rider' },
  { id: 'role_partner_staff', label: 'Partner staff' },
  { id: 'role_admin', label: 'Administrator' }
];

export const previewAdmin = {
  name: 'RUNR Admin', email: 'admin@runr.app', role: 'Administrator', initials: 'RA',
  permissions: { changeRole: true, changeStatus: true, verifyUser: true, recoverAccount: true },
  twoFactorEnabled: true,
  sessions: [
    { device: 'MacBook Pro · Chrome', detail: 'Accra, Ghana · This device', active: true, current: true },
    { device: 'iPhone · Safari', detail: 'Accra, Ghana · 18 Nov, 8:14 AM', active: true, current: false }
  ]
};
