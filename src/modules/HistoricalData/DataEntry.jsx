import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell,
} from 'recharts'

// ── Constants ────────────────────────────────────────────────────
const GAUGE_NAMES = [
  'Kalu Ganga – Millakanda', 'Kelani River – Hanwella',
  'Mahaweli – Manampitiya', 'Gin Ganga – Baddegama',
  'Nilwala – Pitabeddara', 'Attanagalu – Horombawa',
  'Deduru Oya – Dambulla', 'Walawe – Embilipitiya',
]
const EVENT_TYPES   = ['Cyclone','Southwest Monsoon','Northeast Monsoon','Dam Release','Drought','Flash Flood','Coastal Flood']
const PROVINCES     = ['Western','Southern','Central','North Western','North Central','Northern','Eastern','Sabaragamuwa','Uva']
const BASINS        = ['Kalu','Kelani','Mahaweli','Nilwala','Walawe','Attanagalu','Deduru','Gin']
const SEVERITY_OPTS = ['Minor','Moderate','Severe','Catastrophic']
const SEV_COLOR     = { Minor:'#16a34a', Moderate:'#ca8a04', Severe:'#ea580c', Catastrophic:'#dc2626' }
const SEV_BG        = { Minor:'#dcfce7', Moderate:'#fef9c3', Severe:'#ffedd5', Catastrophic:'#fee2e2' }
const RETURN_PERIODS= ['2yr','5yr','10yr','25yr','50yr','100yr','Extreme']
const CROP_TYPES    = ['Paddy','Vegetables','Tea','Rubber','Coconut','Other']
const DATA_SOURCES  = ['SCADA','Manual Reading','DMC Report','IMD Data','Post-Event Survey','Satellite Derived']
const VER_STATUS    = ['Pending','Verified','Rejected']
const VER_COLOR     = { Pending:'#ca8a04', Verified:'#16a34a', Rejected:'#dc2626' }
const VER_BG        = { Pending:'#fef9c3', Verified:'#dcfce7', Rejected:'#fee2e2' }

const BLANK_HYDRO_ROW = () => ({ gauge:'', peakLevel:'', peakDischarge:'', peakDateTime:'', durationAboveAlert:'', returnPeriod:'2yr' })
const BLANK_FORM = {
  eventName:'', eventType:'Cyclone', startDate:'', endDate:'',
  provinces:[], basins:[], severity:'Moderate', imdRef:'',
  hydroRows:[BLANK_HYDRO_ROW()],
  agriAreaHa:'', agriLossLkr:'', cropTypes:[],
  personsAffected:'', personsDisplaced:'', fatalities:'', injured:'',
  roadsKm:'', bridgesCount:'', canalsKm:'', infraRepairLkr:'',
  housesFullDamaged:'', housesPartDamaged:'', housingLossLkr:'',
  fishingCommunities:'', livelihoodLossLkr:'',
  description:'', dataSource:'DMC Report', enteredBy:'', verifiedBy:'',
  verificationStatus:'Pending', attachmentsNote:'',
}

const DUMMY_RECORDS = [
  {
    id:'R001', eventName:'2017 Southwest Monsoon Floods', eventType:'Southwest Monsoon',
    startDate:'2017-05-25', endDate:'2017-06-12',
    provinces:['Western','Southern','Sabaragamuwa'], basins:['Kalu','Kelani','Nilwala'],
    severity:'Catastrophic', imdRef:'DMC-2017-053',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'6.82', peakDischarge:'2840', peakDateTime:'2017-05-26T14:00', durationAboveAlert:'38', returnPeriod:'25yr' },
      { gauge:'Kelani River – Hanwella', peakLevel:'4.51', peakDischarge:'1640', peakDateTime:'2017-05-27T08:00', durationAboveAlert:'22', returnPeriod:'10yr' },
    ],
    agriAreaHa:'84200', agriLossLkr:'12400', cropTypes:['Paddy','Vegetables','Rubber'],
    personsAffected:'614000', personsDisplaced:'218000', fatalities:'202', injured:'415',
    roadsKm:'248', bridgesCount:'42', canalsKm:'86', infraRepairLkr:'8800',
    housesFullDamaged:'5200', housesPartDamaged:'32000', housingLossLkr:'4200',
    fishingCommunities:'280', livelihoodLossLkr:'2100',
    description:'Most devastating flood in Sri Lanka in 14 years. Triggered by an active low-pressure system over the Bay of Bengal coinciding with peak SW monsoon. Kalu Ganga exceeded major flood level at Millakanda for 38 consecutive hours.',
    dataSource:'DMC Report', enteredBy:'R.P. Wickramasinghe', verifiedBy:'D.M. Senanayake', verificationStatus:'Verified', attachmentsNote:'',
  },
  {
    id:'R002', eventName:'2016 Kalu Ganga Flash Flood', eventType:'Flash Flood',
    startDate:'2016-05-14', endDate:'2016-05-20',
    provinces:['Western','Sabaragamuwa'], basins:['Kalu','Kelani'],
    severity:'Severe', imdRef:'DMC-2016-041',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'5.94', peakDischarge:'2210', peakDateTime:'2016-05-15T18:30', durationAboveAlert:'19', returnPeriod:'10yr' },
    ],
    agriAreaHa:'18400', agriLossLkr:'3100', cropTypes:['Paddy','Vegetables'],
    personsAffected:'45000', personsDisplaced:'14000', fatalities:'38', injured:'92',
    roadsKm:'64', bridgesCount:'11', canalsKm:'22', infraRepairLkr:'1800',
    housesFullDamaged:'820', housesPartDamaged:'6400', housingLossLkr:'980',
    fishingCommunities:'42', livelihoodLossLkr:'380',
    description:'Flash flooding along lower Kalu Ganga after three consecutive days exceeding 150mm/24h. Ratnapura town centre inundated to 1.8m depth.',
    dataSource:'SCADA', enteredBy:'A.G. Fernando', verifiedBy:'', verificationStatus:'Pending', attachmentsNote:'',
  },
  {
    id:'R003', eventName:'Cyclone Ockhi Remnants 2017', eventType:'Cyclone',
    startDate:'2017-11-30', endDate:'2017-12-04',
    provinces:['Southern','Uva','Sabaragamuwa'], basins:['Nilwala','Gin','Walawe'],
    severity:'Severe', imdRef:'IMD-OCKHI-2017',
    hydroRows:[
      { gauge:'Nilwala – Pitabeddara', peakLevel:'5.12', peakDischarge:'1820', peakDateTime:'2017-12-01T22:00', durationAboveAlert:'26', returnPeriod:'25yr' },
      { gauge:'Walawe – Embilipitiya', peakLevel:'5.55', peakDischarge:'2100', peakDateTime:'2017-12-02T06:00', durationAboveAlert:'31', returnPeriod:'25yr' },
    ],
    agriAreaHa:'22800', agriLossLkr:'4200', cropTypes:['Paddy','Coconut','Tea'],
    personsAffected:'28000', personsDisplaced:'9400', fatalities:'15', injured:'48',
    roadsKm:'88', bridgesCount:'18', canalsKm:'44', infraRepairLkr:'2200',
    housesFullDamaged:'440', housesPartDamaged:'4800', housingLossLkr:'820',
    fishingCommunities:'148', livelihoodLossLkr:'640',
    description:"Cyclone Ockhi's outer bands struck the southern coast. Southern river basins received unprecedented rainfall as the system tracked north. Storm surge compounded flooding in coastal GN divisions.",
    dataSource:'IMD Data', enteredBy:'K.B. Rajapaksa', verifiedBy:'S. Karunaratne', verificationStatus:'Verified', attachmentsNote:'Satellite imagery attached',
  },
  {
    id:'R004', eventName:'2021 Cyclone Tauktae Remnants', eventType:'Cyclone',
    startDate:'2021-05-14', endDate:'2021-05-18',
    provinces:['Western','Sabaragamuwa'], basins:['Kalu','Kelani','Attanagalu'],
    severity:'Severe', imdRef:'IMD-TAUKTAE-2021',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'5.44', peakDischarge:'1980', peakDateTime:'2021-05-15T16:00', durationAboveAlert:'16', returnPeriod:'10yr' },
    ],
    agriAreaHa:'9200', agriLossLkr:'1840', cropTypes:['Paddy','Rubber'],
    personsAffected:'19000', personsDisplaced:'6800', fatalities:'6', injured:'22',
    roadsKm:'38', bridgesCount:'6', canalsKm:'14', infraRepairLkr:'880',
    housesFullDamaged:'180', housesPartDamaged:'2200', housingLossLkr:'420',
    fishingCommunities:'28', livelihoodLossLkr:'180',
    description:'Remnant moisture from Cyclone Tauktae enhanced monsoon rainfall over SW Sri Lanka. CIDSS early warning system issued alerts 8 hours before peak allowing evacuation.',
    dataSource:'SCADA', enteredBy:'N. Jayasuriya', verifiedBy:'R.P. Wickramasinghe', verificationStatus:'Verified', attachmentsNote:'',
  },
  {
    id:'R005', eventName:'2014 NE Monsoon – Mahaweli Flooding', eventType:'Northeast Monsoon',
    startDate:'2014-12-28', endDate:'2015-01-09',
    provinces:['Central','North Central','Eastern'], basins:['Mahaweli','Deduru'],
    severity:'Severe', imdRef:'DMC-2015-002',
    hydroRows:[
      { gauge:'Mahaweli – Manampitiya', peakLevel:'5.91', peakDischarge:'3200', peakDateTime:'2015-01-03T10:00', durationAboveAlert:'42', returnPeriod:'25yr' },
      { gauge:'Deduru Oya – Dambulla', peakLevel:'3.42', peakDischarge:'820', peakDateTime:'2015-01-04T08:00', durationAboveAlert:'18', returnPeriod:'10yr' },
    ],
    agriAreaHa:'38000', agriLossLkr:'6800', cropTypes:['Paddy','Vegetables'],
    personsAffected:'32000', personsDisplaced:'11000', fatalities:'11', injured:'34',
    roadsKm:'120', bridgesCount:'22', canalsKm:'68', infraRepairLkr:'3400',
    housesFullDamaged:'640', housesPartDamaged:'8200', housingLossLkr:'1400',
    fishingCommunities:'0', livelihoodLossLkr:'940',
    description:'Extended NE monsoon combined with full reservoirs required sustained spillway operations at Victoria (98%) and Randenigala (96%). Mahaweli system remained in flood for 18 consecutive days.',
    dataSource:'DMC Report', enteredBy:'P.B. Gunawardena', verifiedBy:'S. Karunaratne', verificationStatus:'Verified', attachmentsNote:'Victoria dam release log attached',
  },
  {
    id:'R006', eventName:'2019 Dry Zone Drought', eventType:'Drought',
    startDate:'2019-02-01', endDate:'2019-06-30',
    provinces:['North Central','Eastern','Northern'], basins:['Mahaweli','Deduru','Walawe'],
    severity:'Severe', imdRef:'DMC-2019-DRT-01',
    hydroRows:[
      { gauge:'Mahaweli – Manampitiya', peakLevel:'0.82', peakDischarge:'48', peakDateTime:'2019-04-15T12:00', durationAboveAlert:'0', returnPeriod:'25yr' },
    ],
    agriAreaHa:'124000', agriLossLkr:'28000', cropTypes:['Paddy','Vegetables','Coconut'],
    personsAffected:'182000', personsDisplaced:'0', fatalities:'0', injured:'0',
    roadsKm:'0', bridgesCount:'0', canalsKm:'0', infraRepairLkr:'0',
    housesFullDamaged:'0', housesPartDamaged:'0', housingLossLkr:'0',
    fishingCommunities:'0', livelihoodLossLkr:'8400',
    description:'Severe multi-season drought across the dry zone. Victoria reservoir fell to 31% storage — lowest since 1983. Yala season rice cultivation reduced by 40% in Mahaweli System H and B command areas.',
    dataSource:'Satellite Derived', enteredBy:'K.L. Rathnayake', verifiedBy:'P.B. Gunawardena', verificationStatus:'Verified', attachmentsNote:'NDVI satellite data report attached',
  },
  {
    id:'R007', eventName:'Cyclone Mora Outer Bands 2017', eventType:'Cyclone',
    startDate:'2017-05-28', endDate:'2017-05-31',
    provinces:['Western','Southern','Sabaragamuwa'], basins:['Kalu','Nilwala'],
    severity:'Catastrophic', imdRef:'IMD-MORA-2017',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'6.22', peakDischarge:'2560', peakDateTime:'2017-05-29T03:00', durationAboveAlert:'28', returnPeriod:'25yr' },
      { gauge:'Nilwala – Pitabeddara', peakLevel:'4.85', peakDischarge:'1620', peakDateTime:'2017-05-29T06:00', durationAboveAlert:'22', returnPeriod:'10yr' },
    ],
    agriAreaHa:'32000', agriLossLkr:'5800', cropTypes:['Paddy','Tea','Rubber'],
    personsAffected:'22000', personsDisplaced:'7600', fatalities:'8', injured:'29',
    roadsKm:'72', bridgesCount:'14', canalsKm:'28', infraRepairLkr:'1600',
    housesFullDamaged:'320', housesPartDamaged:'3800', housingLossLkr:'640',
    fishingCommunities:'62', livelihoodLossLkr:'480',
    description: "Cyclone Mora's outer bands brought extreme 24-hour rainfall >250mm to SW Sri Lanka before making landfall in Bangladesh. The Kalu Ganga basin saw the fastest rate of rise recorded in the dataset — 0.42m/hr.",
    dataSource:'IMD Data', enteredBy:'D.M. Senanayake', verifiedBy:'A.G. Fernando', verificationStatus:'Verified', attachmentsNote:'IMD track data attached',
  },
  {
    id:'R008', eventName:'2011 Mahaweli Extended Flood', eventType:'Northeast Monsoon',
    startDate:'2011-01-04', endDate:'2011-01-22',
    provinces:['Central','North Central','Eastern'], basins:['Mahaweli'],
    severity:'Catastrophic', imdRef:'DMC-2011-008',
    hydroRows:[
      { gauge:'Mahaweli – Manampitiya', peakLevel:'5.62', peakDischarge:'2980', peakDateTime:'2011-01-09T14:00', durationAboveAlert:'54', returnPeriod:'50yr' },
    ],
    agriAreaHa:'62000', agriLossLkr:'14200', cropTypes:['Paddy','Vegetables'],
    personsAffected:'156000', personsDisplaced:'48000', fatalities:'54', injured:'186',
    roadsKm:'184', bridgesCount:'38', canalsKm:'112', infraRepairLkr:'6800',
    housesFullDamaged:'2400', housesPartDamaged:'18000', housingLossLkr:'3200',
    fishingCommunities:'18', livelihoodLossLkr:'2800',
    description:'Prolonged NE monsoon combined with full reservoirs. Victoria required sustained spillway releases. Mahaweli system remained above major flood level for 18 days — longest continuous flood on record.',
    dataSource:'DMC Report', enteredBy:'S. Karunaratne', verifiedBy:'K.L. Rathnayake', verificationStatus:'Verified', attachmentsNote:'',
  },
  {
    id:'R009', eventName:'2023 Southwest Monsoon', eventType:'Southwest Monsoon',
    startDate:'2023-06-06', endDate:'2023-06-24',
    provinces:['Western','Sabaragamuwa','Southern'], basins:['Kalu','Kelani','Gin'],
    severity:'Severe', imdRef:'DMC-2023-044',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'5.18', peakDischarge:'1880', peakDateTime:'2023-06-10T20:00', durationAboveAlert:'14', returnPeriod:'10yr' },
      { gauge:'Gin Ganga – Baddegama', peakLevel:'4.12', peakDischarge:'1140', peakDateTime:'2023-06-11T04:00', durationAboveAlert:'10', returnPeriod:'5yr' },
    ],
    agriAreaHa:'14800', agriLossLkr:'2600', cropTypes:['Paddy','Vegetables','Rubber'],
    personsAffected:'12500', personsDisplaced:'4200', fatalities:'4', injured:'12',
    roadsKm:'42', bridgesCount:'8', canalsKm:'18', infraRepairLkr:'1100',
    housesFullDamaged:'180', housesPartDamaged:'2400', housingLossLkr:'480',
    fishingCommunities:'22', livelihoodLossLkr:'220',
    description:'Above-normal SW monsoon onset. CIDSS alert system issued 6-hour advance warning for Kalu Basin, enabling pre-emptive evacuation of 4,200 persons before peak.',
    dataSource:'SCADA', enteredBy:'A.G. Fernando', verifiedBy:'D.M. Senanayake', verificationStatus:'Verified', attachmentsNote:'',
  },
  {
    id:'R010', eventName:'2024 Victoria Controlled Release', eventType:'Dam Release',
    startDate:'2024-10-18', endDate:'2024-10-24',
    provinces:['Central','North Central'], basins:['Mahaweli'],
    severity:'Moderate', imdRef:'IDID-VICT-2024-10',
    hydroRows:[
      { gauge:'Mahaweli – Manampitiya', peakLevel:'5.74', peakDischarge:'2640', peakDateTime:'2024-10-19T16:00', durationAboveAlert:'22', returnPeriod:'10yr' },
    ],
    agriAreaHa:'8200', agriLossLkr:'1200', cropTypes:['Paddy'],
    personsAffected:'8200', personsDisplaced:'2800', fatalities:'0', injured:'4',
    roadsKm:'28', bridgesCount:'4', canalsKm:'12', infraRepairLkr:'480',
    housesFullDamaged:'80', housesPartDamaged:'1200', housingLossLkr:'240',
    fishingCommunities:'0', livelihoodLossLkr:'140',
    description:'Victoria reservoir reached 99.2% requiring emergency spillway release (580 m³/s). First major release event managed with CIDSS — downstream communities given 4-hour advance warning. Zero fatalities recorded.',
    dataSource:'SCADA', enteredBy:'P.B. Gunawardena', verifiedBy:'S. Karunaratne', verificationStatus:'Verified', attachmentsNote:'Spillway operation log attached',
  },
  {
    id:'R011', eventName:'2013 Kelani Flood – Colombo', eventType:'Southwest Monsoon',
    startDate:'2013-05-17', endDate:'2013-05-24',
    provinces:['Western'], basins:['Kelani','Attanagalu'],
    severity:'Severe', imdRef:'DMC-2013-039',
    hydroRows:[
      { gauge:'Kelani River – Hanwella', peakLevel:'4.88', peakDischarge:'1820', peakDateTime:'2013-05-19T22:00', durationAboveAlert:'32', returnPeriod:'25yr' },
      { gauge:'Attanagalu – Horombawa', peakLevel:'3.42', peakDischarge:'680', peakDateTime:'2013-05-20T06:00', durationAboveAlert:'18', returnPeriod:'10yr' },
    ],
    agriAreaHa:'6800', agriLossLkr:'1400', cropTypes:['Paddy','Vegetables'],
    personsAffected:'28000', personsDisplaced:'9400', fatalities:'22', injured:'68',
    roadsKm:'58', bridgesCount:'9', canalsKm:'16', infraRepairLkr:'1400',
    housesFullDamaged:'480', housesPartDamaged:'5200', housingLossLkr:'940',
    fishingCommunities:'18', livelihoodLossLkr:'320',
    description: 'Kelani River flooding caused widespread inundation in low-lying suburbs of Colombo including Kaduwela, Biyagama, and Kelaniya. Urban stormwater systems overwhelmed.',
    dataSource:'DMC Report', enteredBy:'N. Jayasuriya', verifiedBy:'R.P. Wickramasinghe', verificationStatus:'Verified', attachmentsNote:'',
  },
  {
    id:'R012', eventName:'2010 Southwest Monsoon Early Onset', eventType:'Southwest Monsoon',
    startDate:'2010-05-12', endDate:'2010-05-28',
    provinces:['Western','Southern','Sabaragamuwa'], basins:['Kalu','Nilwala','Gin'],
    severity:'Moderate', imdRef:'DMC-2010-022',
    hydroRows:[
      { gauge:'Kalu Ganga – Millakanda', peakLevel:'4.64', peakDischarge:'1420', peakDateTime:'2010-05-16T10:00', durationAboveAlert:'12', returnPeriod:'5yr' },
      { gauge:'Nilwala – Pitabeddara', peakLevel:'4.02', peakDischarge:'1080', peakDateTime:'2010-05-16T16:00', durationAboveAlert:'8', returnPeriod:'5yr' },
    ],
    agriAreaHa:'11200', agriLossLkr:'1800', cropTypes:['Paddy','Vegetables'],
    personsAffected:'18000', personsDisplaced:'5600', fatalities:'9', injured:'24',
    roadsKm:'36', bridgesCount:'6', canalsKm:'14', infraRepairLkr:'820',
    housesFullDamaged:'210', housesPartDamaged:'2800', housingLossLkr:'480',
    fishingCommunities:'38', livelihoodLossLkr:'280',
    description: 'Early onset of SW monsoon with above-normal rainfall across the Kalu and Nilwala basins. Pre-CIDSS period — warnings issued via manual rainfall thresholds only.',
    dataSource:'Manual Reading', enteredBy:'K.B. Rajapaksa', verifiedBy:'', verificationStatus:'Pending', attachmentsNote:'Paper records being digitised',
  },
]



// ── Chart data ────────────────────────────────────────────────────
const EVENTS_PER_YEAR = Array.from({ length: 15 }, (_, i) => {
  const year = 2010 + i
  const recs = DUMMY_RECORDS.filter((r) => new Date(r.startDate).getFullYear() === year)
  const out = { year }
  SEVERITY_OPTS.forEach((s) => { out[s] = recs.filter((r) => r.severity === s).length })
  return out
})

const KALU_PEAKS = [
  { year: 2010, level: 4.64 }, { year: 2011, level: 3.82 }, { year: 2012, level: 2.94 },
  { year: 2013, level: 3.44 }, { year: 2014, level: 3.10 }, { year: 2015, level: 4.21 },
  { year: 2016, level: 5.94 }, { year: 2017, level: 6.82 }, { year: 2018, level: 3.66 },
  { year: 2019, level: 2.48 }, { year: 2020, level: 3.92 }, { year: 2021, level: 5.44 },
  { year: 2022, level: 3.78 }, { year: 2023, level: 5.18 }, { year: 2024, level: 4.12 },
]

const AFFECTED_BY_TYPE = [
  { type: 'Southwest Monsoon', persons: 712500 },
  { type: 'Northeast Monsoon', persons: 188000 },
  { type: 'Cyclone',           persons: 50000  },
  { type: 'Dam Release',       persons: 8200   },
  { type: 'Flash Flood',       persons: 45000  },
  { type: 'Drought',           persons: 182000 },
]

const SEV_CHART_COLOR = { Minor: '#22c55e', Moderate: '#eab308', Severe: '#f97316', Catastrophic: '#ef4444' }

// ── Styles ────────────────────────────────────────────────────────
const card = { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
const sectionHead = { fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12, paddingBottom: 6, borderBottom: '2px solid #dbeafe' }
const label = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }
const input = { width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, color: '#1e293b', background: '#fff', boxSizing: 'border-box' }
const th = { padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }
const td = { padding: '9px 12px', fontSize: 12, borderBottom: '1px solid #f1f5f9', color: '#374151', verticalAlign: 'middle' }

// ── Helper functions ──────────────────────────────────────────────
function toggleArr(arr, val) { return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] }
function SevBadge({ sev }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: SEV_BG[sev] || '#f8fafc', color: SEV_COLOR[sev] || '#64748b' }}>{sev}</span>
}
function VerBadge({ status }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: VER_BG[status] || '#f8fafc', color: VER_COLOR[status] || '#64748b' }}>{status}</span>
}
function SectionTitle({ children }) {
  return <div style={sectionHead}>{children}</div>
}
function Field({ label: lbl, children }) {
  return <div style={{ marginBottom: 14 }}><label style={label}>{lbl}</label>{children}</div>
}
function InfoGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', flexWrap: 'wrap' }}>{children}</div>
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  if (!msg) return null
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#16a34a', color: '#fff', padding: '14px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(22,163,74,0.35)', display: 'flex', alignItems: 'center', gap: 12 }}>
      ✓ {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 }}>✕</button>
    </div>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────
function DetailModal({ record, onClose }) {
  if (!record) return null
  const Detail = ({ k, v }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7, borderBottom: '1px solid #f8fafc', paddingBottom: 7 }}>
      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{k}</span>
      <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 600, textAlign: 'right' }}>{v || '—'}</span>
    </div>
  )
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 760, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{record.eventName}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{record.startDate} to {record.endDate} · {record.imdRef}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => alert('PDF export will be connected to backend')} style={{ fontSize: 11, fontWeight: 700, padding: '7px 14px', borderRadius: 7, border: '1px solid #2563eb', background: '#fff', color: '#2563eb', cursor: 'pointer' }}>🖨 Print / Export PDF</button>
            <button onClick={onClose} style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: 4 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Event Info */}
          <div>
            <SectionTitle>Event Information</SectionTitle>
            <InfoGrid>
              <Detail k="Event Type" v={record.eventType} />
              <Detail k="IMD/DMC Reference" v={record.imdRef} />
              <Detail k="Severity" v={<SevBadge sev={record.severity} />} />
              <Detail k="Affected Provinces" v={record.provinces.join(', ')} />
              <Detail k="Affected Basins" v={record.basins.join(', ')} />
            </InfoGrid>
          </div>
          {/* Hydrological */}
          <div>
            <SectionTitle>Hydrological Readings</SectionTitle>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: '#f8fafc' }}>
                {['Gauge','Peak Level','Peak Discharge','Peak Date/Time','Duration >Alert','Return Period'].map((h) => <th key={h} style={{ ...th, cursor: 'default' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {record.hydroRows.map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{r.gauge}</td>
                    <td style={{ ...td, fontWeight: 700, color: '#dc2626' }}>{r.peakLevel} m</td>
                    <td style={td}>{r.peakDischarge} m³/s</td>
                    <td style={{ ...td, fontFamily: 'monospace' }}>{r.peakDateTime?.replace('T', ' ')}</td>
                    <td style={td}>{r.durationAboveAlert}h</td>
                    <td style={td}>{r.returnPeriod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Impact */}
          <div>
            <SectionTitle>Sector Impact</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <ImpactBox title="Agriculture" rows={[['Area affected', `${record.agriAreaHa} ha`], ['Crop loss', `LKR ${record.agriLossLkr}M`], ['Crop types', record.cropTypes?.join(', ')]]} />
              <ImpactBox title="People" rows={[['Affected', (+record.personsAffected).toLocaleString()], ['Displaced', (+record.personsDisplaced).toLocaleString()], ['Fatalities', record.fatalities], ['Injured', record.injured]]} />
              <ImpactBox title="Infrastructure" rows={[['Roads', `${record.roadsKm} km`], ['Bridges', record.bridgesCount], ['Canals', `${record.canalsKm} km`], ['Repair cost', `LKR ${record.infraRepairLkr}M`]]} />
              <ImpactBox title="Housing" rows={[['Fully damaged', record.housesFullDamaged], ['Partially damaged', record.housesPartDamaged], ['Housing loss', `LKR ${record.housingLossLkr}M`]]} />
              <ImpactBox title="Livelihoods" rows={[['Fishing communities', record.fishingCommunities], ['Livelihood loss', `LKR ${record.livelihoodLossLkr}M`]]} />
            </div>
          </div>
          {/* Notes */}
          <div>
            <SectionTitle>Observations & Notes</SectionTitle>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, background: '#f8fafc', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>{record.description}</div>
            <InfoGrid>
              <Detail k="Data Source" v={record.dataSource} />
              <Detail k="Verification Status" v={<VerBadge status={record.verificationStatus} />} />
              <Detail k="Entered By" v={record.enteredBy} />
              <Detail k="Verified By" v={record.verifiedBy} />
              {record.attachmentsNote && <Detail k="Attachments" v={record.attachmentsNote} />}
            </InfoGrid>
          </div>
        </div>
      </div>
    </div>
  )
}
function ImpactBox({ title, rows }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
          <span style={{ color: '#94a3b8' }}>{k}</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{v || '—'}</span>
        </div>
      ))}
    </div>
  )
}

// ── Tab 1: Data Entry Form ────────────────────────────────────────
function DataEntryTab({ initData = null, onSaved }) {
  const [form, setForm] = useState(initData || BLANK_FORM)
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const setHydro = (i, key, val) => setForm((f) => {
    const rows = [...f.hydroRows]; rows[i] = { ...rows[i], [key]: val }; return { ...f, hydroRows: rows }
  })
  const addHydro = () => setForm((f) => ({ ...f, hydroRows: [...f.hydroRows, BLANK_HYDRO_ROW()] }))
  const removeHydro = (i) => setForm((f) => ({ ...f, hydroRows: f.hydroRows.filter((_, j) => j !== i) }))

  const handleSave = () => {
    if (!form.eventName.trim()) { alert('Please enter an event name'); return }
    onSaved(form)
    setForm(BLANK_FORM)
  }

  const inputStyle = { ...input }
  const Checkbox = ({ checked, onChange, label: lbl }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 14, height: 14, cursor: 'pointer' }} /> {lbl}
    </label>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Section 1 */}
      <div style={card}>
        <SectionTitle>Section 1 — Event Information</SectionTitle>
        <InfoGrid>
          <Field label="Event Name">
            <input style={inputStyle} value={form.eventName} onChange={(e) => set('eventName', e.target.value)} placeholder="e.g. Cyclone Mora 2017" />
          </Field>
          <Field label="Event Type">
            <select style={inputStyle} value={form.eventType} onChange={(e) => set('eventType', e.target.value)}>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Start Date">
            <input type="date" style={inputStyle} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </Field>
          <Field label="End Date">
            <input type="date" style={inputStyle} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </Field>
          <Field label="IMD/DMC Reference Number">
            <input style={inputStyle} value={form.imdRef} onChange={(e) => set('imdRef', e.target.value)} placeholder="e.g. DMC-2024-051" />
          </Field>
          <Field label="Severity Level">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 2 }}>
              {SEVERITY_OPTS.map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
                  <input type="radio" name="severity" checked={form.severity === s} onChange={() => set('severity', s)} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: SEV_COLOR[s] }}>{s}</span>
                </label>
              ))}
            </div>
          </Field>
        </InfoGrid>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <Field label="Affected Provinces">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              {PROVINCES.map((p) => <Checkbox key={p} label={p} checked={form.provinces.includes(p)} onChange={() => set('provinces', toggleArr(form.provinces, p))} />)}
            </div>
          </Field>
          <Field label="Affected Basins">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              {BASINS.map((b) => <Checkbox key={b} label={b} checked={form.basins.includes(b)} onChange={() => set('basins', toggleArr(form.basins, b))} />)}
            </div>
          </Field>
        </div>
      </div>

      {/* Section 2 */}
      <div style={card}>
        <SectionTitle>Section 2 — Hydrological Readings</SectionTitle>
        {form.hydroRows.map((row, i) => (
          <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', marginBottom: 10, border: '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>Reading {i + 1}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr 1fr', gap: 10 }}>
              <div><label style={label}>Gauge Station</label>
                <select style={inputStyle} value={row.gauge} onChange={(e) => setHydro(i, 'gauge', e.target.value)}>
                  <option value="">— Select —</option>
                  {GAUGE_NAMES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div><label style={label}>Peak Level (m)</label>
                <input type="number" step="0.01" style={inputStyle} value={row.peakLevel} onChange={(e) => setHydro(i, 'peakLevel', e.target.value)} placeholder="0.00" />
              </div>
              <div><label style={label}>Peak Q (m³/s)</label>
                <input type="number" style={inputStyle} value={row.peakDischarge} onChange={(e) => setHydro(i, 'peakDischarge', e.target.value)} placeholder="0" />
              </div>
              <div><label style={label}>Date & Time of Peak</label>
                <input type="datetime-local" style={inputStyle} value={row.peakDateTime} onChange={(e) => setHydro(i, 'peakDateTime', e.target.value)} />
              </div>
              <div><label style={label}>Duration Alert (h)</label>
                <input type="number" style={inputStyle} value={row.durationAboveAlert} onChange={(e) => setHydro(i, 'durationAboveAlert', e.target.value)} placeholder="0" />
              </div>
              <div><label style={label}>Return Period</label>
                <select style={inputStyle} value={row.returnPeriod} onChange={(e) => setHydro(i, 'returnPeriod', e.target.value)}>
                  {RETURN_PERIODS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            {form.hydroRows.length > 1 && (
              <button onClick={() => removeHydro(i)} style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, padding: '3px 9px', borderRadius: 5, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer' }}>✕ Remove</button>
            )}
          </div>
        ))}
        <button onClick={addHydro} style={{ fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 7, border: '1px dashed #2563eb', background: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>+ Add Gauge Reading</button>
      </div>

      {/* Section 3 */}
      <div style={card}>
        <SectionTitle>Section 3 — Sector Impact Data</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>Agriculture</div>
            <Field label="Cultivated area affected (ha)">
              <input type="number" style={inputStyle} value={form.agriAreaHa} onChange={(e) => set('agriAreaHa', e.target.value)} />
            </Field>
            <Field label="Crop loss estimate (LKR millions)">
              <input type="number" style={inputStyle} value={form.agriLossLkr} onChange={(e) => set('agriLossLkr', e.target.value)} />
            </Field>
            <Field label="Crop Types Affected">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', padding: '8px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                {CROP_TYPES.map((c) => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', userSelect: 'none' }}>
                    <input type="checkbox" checked={(form.cropTypes || []).includes(c)} onChange={() => set('cropTypes', toggleArr(form.cropTypes || [], c))} /> {c}
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>People</div>
            {[['Persons affected', 'personsAffected'], ['Persons displaced', 'personsDisplaced'], ['Fatalities', 'fatalities'], ['Injured', 'injured']].map(([lbl, key]) => (
              <Field key={key} label={lbl}><input type="number" style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)} /></Field>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>Infrastructure</div>
            {[['Roads damaged (km)', 'roadsKm'], ['Bridges damaged (count)', 'bridgesCount'], ['Irrigation canals damaged (km)', 'canalsKm'], ['Estimated repair cost (LKR millions)', 'infraRepairLkr']].map(([lbl, key]) => (
              <Field key={key} label={lbl}><input type="number" style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)} /></Field>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>Housing</div>
            {[['Houses fully damaged', 'housesFullDamaged'], ['Houses partially damaged', 'housesPartDamaged'], ['Estimated housing loss (LKR millions)', 'housingLossLkr']].map(([lbl, key]) => (
              <Field key={key} label={lbl}><input type="number" style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)} /></Field>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9', marginTop: 8 }}>Livelihoods</div>
            {[['Fishing communities affected', 'fishingCommunities'], ['Estimated livelihood loss (LKR millions)', 'livelihoodLossLkr']].map(([lbl, key]) => (
              <Field key={key} label={lbl}><input type="number" style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)} /></Field>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div style={card}>
        <SectionTitle>Section 4 — Observations & Notes</SectionTitle>
        <Field label="Description / Narrative">
          <textarea rows={5} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the event, conditions, response, and impact…" />
        </Field>
        <InfoGrid>
          <Field label="Data Source">
            <select style={inputStyle} value={form.dataSource} onChange={(e) => set('dataSource', e.target.value)}>
              {DATA_SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Attachments / Files">
            <input style={{ ...inputStyle, color: '#94a3b8' }} value={form.attachmentsNote} onChange={(e) => set('attachmentsNote', e.target.value)} placeholder="File upload will be enabled when connected to server" />
          </Field>
          <Field label="Entered By">
            <input style={inputStyle} value={form.enteredBy} onChange={(e) => set('enteredBy', e.target.value)} />
          </Field>
          <Field label="Verified By">
            <input style={inputStyle} value={form.verifiedBy} onChange={(e) => set('verifiedBy', e.target.value)} />
          </Field>
          <Field label="Verification Status">
            <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
              {VER_STATUS.map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
                  <input type="radio" name="verStatus" checked={form.verificationStatus === s} onChange={() => set('verificationStatus', s)} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: VER_COLOR[s] }}>{s}</span>
                </label>
              ))}
            </div>
          </Field>
        </InfoGrid>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={() => setForm(BLANK_FORM)} style={{ fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} style={{ fontSize: 13, fontWeight: 700, padding: '10px 28px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>💾 Save Historical Record</button>
      </div>
    </div>
  )
}

// ── Tab 2: Records Table ──────────────────────────────────────────
function RecordsTab({ records, setRecords, onEdit, onView }) {
  const [search, setSearch]           = useState('')
  const [typeF, setTypeF]             = useState('All')
  const [sevF, setSevF]               = useState('All')
  const [basinF, setBasinF]           = useState('All')
  const [yearF, setYearF]             = useState('All')
  const [sortCol, setSortCol]         = useState('startDate')
  const [sortDir, setSortDir]         = useState(-1)

  const years = [...new Set(records.map((r) => new Date(r.startDate).getFullYear()))].sort((a,b)=>b-a)
  const selStyle = { fontSize: 12, padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, background: '#fff', color: '#1e293b', cursor: 'pointer' }

  const filtered = useMemo(() => {
    let list = records.filter((r) =>
      (search === '' || r.eventName.toLowerCase().includes(search.toLowerCase()) || r.basins.join('').toLowerCase().includes(search.toLowerCase())) &&
      (typeF === 'All' || r.eventType === typeF) &&
      (sevF === 'All' || r.severity === sevF) &&
      (basinF === 'All' || r.basins.includes(basinF)) &&
      (yearF === 'All' || new Date(r.startDate).getFullYear() === +yearF)
    )
    return [...list].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol]
      if (sortCol === 'personsAffected' || sortCol === 'fatalities') { av = +av; bv = +bv }
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir
    })
  }, [records, search, typeF, sevF, basinF, yearF, sortCol, sortDir])

  const sortBy = (col) => { setSortCol(col); setSortDir((d) => sortCol === col ? -d : 1) }
  const SortTh = ({ col, children }) => (
    <th style={th} onClick={() => sortBy(col)}>
      {children} {sortCol === col ? (sortDir === 1 ? '▲' : '▼') : ''}
    </th>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Filters */}
      <div style={{ ...card, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: '12px 16px' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search events or basins…" style={{ ...selStyle, width: 220 }} />
        <select value={typeF} onChange={(e) => setTypeF(e.target.value)} style={selStyle}>
          <option value="All">All Types</option>
          {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={sevF} onChange={(e) => setSevF(e.target.value)} style={selStyle}>
          <option value="All">All Severities</option>
          {SEVERITY_OPTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={basinF} onChange={(e) => setBasinF(e.target.value)} style={selStyle}>
          <option value="All">All Basins</option>
          {BASINS.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select value={yearF} onChange={(e) => setYearF(e.target.value)} style={selStyle}>
          <option value="All">All Years</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} records</span>
        <button onClick={() => alert('Export functionality will be connected to backend')} style={{ fontSize: 11, fontWeight: 700, padding: '7px 14px', borderRadius: 7, border: '1px solid #2563eb', background: '#fff', color: '#2563eb', cursor: 'pointer' }}>⬇ Export CSV</button>
      </div>

      {/* Table */}
      <div style={card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <SortTh col="eventName">Event Name</SortTh>
                <SortTh col="eventType">Type</SortTh>
                <SortTh col="startDate">Date Range</SortTh>
                <th style={{ ...th, cursor: 'default' }}>Basins</th>
                <SortTh col="severity">Severity</SortTh>
                <th style={{ ...th, cursor: 'default' }}>Peak Level</th>
                <SortTh col="personsAffected">Persons Aff.</SortTh>
                <SortTh col="fatalities">Fatalities</SortTh>
                <SortTh col="verificationStatus">Status</SortTh>
                <th style={{ ...th, cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ ...td, fontWeight: 700, color: '#1e293b', maxWidth: 200 }}>{r.eventName}</td>
                  <td style={{ ...td, color: '#64748b' }}>{r.eventType}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{r.startDate}<br />{r.endDate}</td>
                  <td style={td}>{r.basins.map((b) => <span key={b} style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#eff6ff', color: '#2563eb', marginRight: 3, display: 'inline-block', marginBottom: 2 }}>{b}</span>)}</td>
                  <td style={td}><SevBadge sev={r.severity} /></td>
                  <td style={{ ...td, fontFamily: 'monospace', fontWeight: 700, color: '#dc2626' }}>{r.hydroRows[0]?.peakLevel ? `${r.hydroRows[0].peakLevel}m` : '—'}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{(+r.personsAffected).toLocaleString()}</td>
                  <td style={{ ...td, fontWeight: 700, color: +r.fatalities > 0 ? '#dc2626' : '#16a34a' }}>{r.fatalities}</td>
                  <td style={td}><VerBadge status={r.verificationStatus} /></td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    <button onClick={() => onView(r)} style={actBtn('#2563eb')}>View</button>
                    <button onClick={() => onEdit(r)} style={actBtn('#7c3aed')}>Edit</button>
                    <button onClick={() => { if (window.confirm(`Delete "${r.eventName}"?`)) setRecords((rs) => rs.filter((x) => x.id !== r.id)) }} style={actBtn('#dc2626')}>Del</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} style={{ ...td, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: 24 }}>No records match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
const actBtn = (color) => ({ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 5, border: `1px solid ${color}22`, background: `${color}0d`, color, cursor: 'pointer', marginRight: 4 })

// ── Tab 3: Analytics ──────────────────────────────────────────────
function AnalyticsTab({ records }) {
  const totalPersons = records.reduce((s, r) => s + (+r.personsAffected || 0), 0)
  const worstEvent = records.reduce((a, b) => (+b.fatalities || 0) > (+a.fatalities || 0) ? b : a, records[0])
  const basinCount = {}
  records.forEach((r) => r.basins.forEach((b) => { basinCount[b] = (basinCount[b] || 0) + 1 }))
  const mostAffectedBasin = Object.entries(basinCount).sort((a, b) => b[1] - a[1])[0]?.[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {/* Events per year */}
        <div style={{ ...card, gridColumn: '1 / 3' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Flood Events per Year — by Severity</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EVENTS_PER_YEAR} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {SEVERITY_OPTS.map((s) => <Bar key={s} dataKey={s} stackId="a" fill={SEV_CHART_COLOR[s]} radius={s === 'Catastrophic' ? [3, 3, 0, 0] : [0, 0, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Persons by type — horizontal */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Persons Affected by Event Type</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AFFECTED_BY_TYPE} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 10, fill: '#374151' }} width={110} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [v.toLocaleString(), 'Persons']} />
              <Bar dataKey="persons" radius={[0, 4, 4, 0]}>
                {AFFECTED_BY_TYPE.map((_, i) => <Cell key={i} fill={['#3b82f6','#8b5cf6','#f97316','#ef4444','#06b6d4','#d97706'][i % 6]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kalu Ganga peak levels */}
        <div style={{ ...card, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Kalu Ganga – Millakanda: Annual Peak Levels (2010–2024)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={KALU_PEAKS} margin={{ left: -8, right: 16, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 8]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => [`${v}m`, 'Peak Level']} />
              <ReferenceLine y={4.5} stroke="#dc2626" strokeDasharray="4 3" label={{ value: 'Major Flood (4.5m)', fontSize: 10, fill: '#dc2626', position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Peak Level (m)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Events', value: records.length, icon: '📋', color: '#2563eb' },
          { label: 'Total Persons Affected', value: totalPersons.toLocaleString(), icon: '👥', color: '#7c3aed' },
          { label: 'Worst Event (fatalities)', value: `${worstEvent?.eventName?.split(' ').slice(0,3).join(' ')} (${worstEvent?.fatalities})`, icon: '⚠', color: '#dc2626' },
          { label: 'Most Affected Basin', value: mostAffectedBasin, icon: '🌊', color: '#0891b2' },
          { label: 'Avg Return Period', value: '~10–25yr', icon: '📅', color: '#16a34a' },
        ].map((s) => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1.3 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Root Component ────────────────────────────────────────────────
export default function M12HistoricalDataEntry() {
  const [tab, setTab]           = useState(0)
  const [records, setRecords]   = useState(DUMMY_RECORDS)
  const [viewRecord, setViewRecord] = useState(null)
  const [editData, setEditData] = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const handleSaved = (form) => {
    if (editData) {
      setRecords((rs) => rs.map((r) => r.id === editData.id ? { ...form, id: editData.id } : r))
      showToast('Record updated successfully')
    } else {
      setRecords((rs) => [{ ...form, id: `R${String(Date.now()).slice(-6)}` }, ...rs])
      showToast('Historical record saved successfully')
    }
    setEditData(null)
    setTab(1)
  }

  const handleEdit = (record) => { setEditData(record); setTab(0) }

  const TABS = ['Data Entry', 'Historical Records', 'Analytics']

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Toast msg={toast} onClose={() => setToast('')} />
      <DetailModal record={viewRecord} onClose={() => setViewRecord(null)} />

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', gap: 2 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); if (i !== 0) setEditData(null) }} style={{
            padding: '14px 22px', fontSize: 13, fontWeight: tab === i ? 700 : 500,
            color: tab === i ? '#2563eb' : '#64748b', background: 'transparent', border: 'none',
            borderBottom: tab === i ? '2px solid #2563eb' : '2px solid transparent', cursor: 'pointer',
          }}>{t}{i === 0 && editData ? ' (Editing)' : ''}</button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {tab === 0 && <DataEntryTab key={editData?.id || 'new'} initData={editData} onSaved={handleSaved} />}
        {tab === 1 && <RecordsTab records={records} setRecords={setRecords} onEdit={handleEdit} onView={setViewRecord} />}
        {tab === 2 && <AnalyticsTab records={records} />}
      </div>
    </div>
  )
}