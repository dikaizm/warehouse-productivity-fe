export const ROLES = {
    KEPALA_GUDANG: 'kepala_gudang',
    OPERASIONAL: 'operasional',
    ADMIN_LOGISTIK: 'admin_logistik',
} as const;

export const ROLES_NAME = {
    [ROLES.KEPALA_GUDANG]: 'Kepala Gudang',
    [ROLES.OPERASIONAL]: 'Operasional',
    [ROLES.ADMIN_LOGISTIK]: 'Admin Logistik',
} as const;

export const SUB_ROLES = {
    LEADER_INCOMING: 'leader_incoming',
    GOOD_RECEIVE: 'good_receive',
    QUALITY_INSPECTION: 'quality_inspection',
    BINNING: 'binning',
    LEADER_OUTGOING: 'leader_outgoing',
    PICKING: 'picking',
    QUALITY_CONTROL: 'quality_control',
} as const;

export const SUB_ROLES_NAME = {
    [SUB_ROLES.LEADER_INCOMING]: 'Leader Incoming',
    [SUB_ROLES.GOOD_RECEIVE]: 'Good Receive',
    [SUB_ROLES.QUALITY_INSPECTION]: 'Quality Inspection',
    [SUB_ROLES.BINNING]: 'Binning',
    [SUB_ROLES.LEADER_OUTGOING]: 'Leader Outgoing',
    [SUB_ROLES.PICKING]: 'Picking',
    [SUB_ROLES.QUALITY_CONTROL]: 'Quality Control',
} as const;