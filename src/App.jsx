import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  Lock,
  Menu,
  Moon,
  Pencil,
  Plus,
  Save,
  Sun,
  Train,
  TrendingUp,
  Trash2,
  X
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const STORAGE_KEY = 'sistema-dormentes-rumo-v3-zerado'
const THEME_KEY = 'sistema-dormentes-rumo-theme'

const STATUS = {
  bom_azul_novo: {
    label: 'Bom (Azul-Novo)',
    short: 'A',
    group: 'bom',
    score: 100,
    severity: 0,
    className: 'status-bom-azul',
    color: '#007FB6',
    textColor: '#ffffff',
    description: 'Dormente novo ou recentemente substituído, em condição boa de suporte e fixação, identificado pela sigla A e pela marcação azul.'
  },
  bom_verde_antigo: {
    label: 'Bom (Verde-Antigo)',
    short: 'G',
    group: 'bom',
    score: 100,
    severity: 0,
    className: 'status-bom-verde',
    color: '#00B96B',
    textColor: '#ffffff',
    description: 'Dormente antigo, porém em condição boa de suporte e fixação, identificado pela sigla G e pela marcação verde.'
  },
  regular_l1: {
    label: 'Regular L1',
    short: 'L1',
    group: 'regular',
    score: 75,
    severity: 1,
    className: 'status-regular-l1',
    color: '#FFEA73',
    textColor: '#111111',
    description: 'Dormente com degradação leve, ainda funcional, exigindo acompanhamento da evolução.'
  },
  regular_l2: {
    label: 'Regular L2',
    short: 'L2',
    group: 'regular',
    score: 50,
    severity: 2,
    className: 'status-regular-l2',
    color: '#FFDD00',
    textColor: '#111111',
    description: 'Dormente com degradação moderada, exigindo atenção e comparação nas próximas inspeções.'
  },
  regular_l3: {
    label: 'Regular L3',
    short: 'L3',
    group: 'regular',
    score: 25,
    severity: 3,
    className: 'status-regular-l3',
    color: '#b88900',
    textColor: '#ffffff',
    description: 'Dormente com degradação acentuada, próximo da condição inservível e com prioridade de acompanhamento.'
  },
  inservivel: {
    label: 'Inservível',
    short: 'V',
    group: 'critico',
    score: 0,
    severity: 4,
    className: 'status-inservivel',
    color: '#D95E44',
    textColor: '#ffffff',
    description: 'Dormente inservível, identificado pela sigla V e pela cor vermelha. Deve entrar em plano de substituição e, na prospecção, recebe uma pintura.'
  },
  ruina: {
    label: 'Ruína',
    short: 'R',
    group: 'critico',
    score: 0,
    severity: 5,
    className: 'status-ruina',
    color: '#AEB8C2',
    textColor: '#111111',
    description: 'Dormente em ruína, identificado pela sigla R e pela cor cinza. Na prospecção, recebe duas pinturas.'
  }
}

const STATUS_KEYS = Object.keys(STATUS)
const DEFAULT_STATUS = 'bom_verde_antigo'
const STATUS_ALIASES = {
  bom: DEFAULT_STATUS,
  regular: 'regular_l1'
}

const CHART_COLORS = {
  bom_azul_novo: '#007FB6',
  bom_verde_antigo: '#00B96B',
  regular_l1: '#FFEA73',
  regular_l2: '#FFDD00',
  regular_l3: '#B88900',
  inservivel: '#D95E44',
  ruina: '#AEB8C2',
  bom: '#007FB6',
  regular: '#FFDD00',
  line: '#007FB6',
  green: '#00B96B',
  aqua: '#00A9E0',
  grid: '#D7E5EF',
  text: '#052A52'
}

const DARK_CHART_COLORS = {
  bom_azul_novo: '#55C9F2',
  bom_verde_antigo: '#52E68F',
  regular_l1: '#FFF09A',
  regular_l2: '#FFE45C',
  regular_l3: '#D8AD38',
  inservivel: '#FF8A72',
  ruina: '#D5DEE6',
  bom: '#55C9F2',
  regular: '#FFE45C',
  line: '#55C9F2',
  green: '#52E68F',
  aqua: '#72D9FF',
  grid: '#274E72',
  text: '#D7EEFF'
}


const CLASSIFICATION_COLORS = {
  'Ótimo': '#00B96B',
  'Atenção': '#B88900',
  'Crítico': '#D95E44',
  'Sem dados': '#7C93A8'
}


const FISSURE_CLASSES = [
  { key: 'nao_marcado', label: 'Não marcado', short: 'NM', severity: 0, description: 'Sem medição suficiente para enquadramento.' },
  { key: 'ca', label: 'CA', short: 'CA', severity: 1, description: 'Fissura muito leve, monitorada por abertura e comprimento.' },
  { key: 'cb', label: 'CB', short: 'CB', severity: 2, description: 'Fissura leve, com evolução que deve ser comparada por inspeção.' },
  { key: 'cc', label: 'CC', short: 'CC', severity: 3, description: 'Fissura moderada; acompanhar por lado e região do dormente.' },
  { key: 'cd', label: 'CD', short: 'CD', severity: 4, description: 'Fissura forte, entra na carteira de atenção.' },
  { key: 'ce', label: 'CE', short: 'CE', severity: 5, description: 'Fissura muito forte, próxima de condição crítica.' },
  { key: 'ruina', label: 'Ruína por fissura', short: 'RU', severity: 6, description: 'Abertura severa conforme regra de vídeo/fissura da planilha.' }
]

const FISSURE_CLASS_MAP = Object.fromEntries(FISSURE_CLASSES.map((item) => [item.key, item]))
const FISSURE_CLASS_KEYS = FISSURE_CLASSES.map((item) => item.key)

const DEFAULT_HARDSCAN_LIMITS = {
  attention: 300,
  critical: 220
}

const today = () => new Date().toISOString().slice(0, 10)
const parseDate = (date) => new Date(`${date || today()}T00:00:00`)
const formatDate = (date) => date ? date.split('-').reverse().join('/') : ''
const normalizeDateValue = (value) => {
  if (!value) return ''
  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
  if (/^\d{4}$/.test(text)) return `${text}-01-01`
  return ''
}
const daysBetween = (start, end) => Math.max(1, Math.round((parseDate(end) - parseDate(start)) / 86400000))


const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const normalized = String(value).replace(',', '.').replace(/[^0-9.-]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const formatNumber = (value, digits = 1) => {
  const parsed = toNumber(value)
  return parsed === null ? '-' : parsed.toLocaleString('pt-BR', { maximumFractionDigits: digits })
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`
}

function normalizeStatus(status) {
  const normalized = STATUS_ALIASES[status] || status
  return STATUS[normalized] ? normalized : DEFAULT_STATUS
}

function isStatusGroup(statusKey, group) {
  return STATUS[normalizeStatus(statusKey)].group === group
}

function createStatusCounts() {
  return Object.fromEntries(STATUS_KEYS.map((key) => [key, 0]))
}

function createStatusLabelCounts() {
  return Object.fromEntries(STATUS_KEYS.map((key) => [STATUS[key].label, 0]))
}

function getStatusLabel(statusKey) {
  return STATUS[normalizeStatus(statusKey)].label
}

function buildSleepers(count) {
  return Array.from({ length: Math.max(0, Number(count) || 0) }, (_, index) => ({
    id: `D${String(index + 1).padStart(3, '0')}`,
    number: index + 1
  }))
}

function createInspection(sleepers, date = today(), notes = '', locked = false) {
  const conditions = {}
  sleepers.forEach((sleeper) => {
    conditions[sleeper.id] = DEFAULT_STATUS
  })
  return { id: uid('insp'), date, notes, conditions, locked }
}


function normalizeHardScanRecords(records) {
  return Array.isArray(records) ? records.map((record) => ({
    id: record.id || uid('hs'),
    date: record.date || today(),
    sleeper: record.sleeper || '',
    equipment: record.equipment || '',
    value1: record.value1 || '',
    value2: record.value2 || '',
    value3: record.value3 || '',
    value4: record.value4 || '',
    average: record.average || '',
    notes: record.notes || ''
  })) : []
}

function normalizeFissureRecords(records) {
  return Array.isArray(records) ? records.map((record) => ({
    id: record.id || uid('fis'),
    date: record.date || today(),
    sleeper: record.sleeper || '',
    side: record.side || '',
    classKey: FISSURE_CLASS_MAP[record.classKey] ? record.classKey : 'nao_marcado',
    lateralLength: record.lateralLength || '',
    superiorLength: record.superiorLength || '',
    opening: record.opening || '',
    notes: record.notes || ''
  })) : []
}

function createTrack(name = 'Novo trecho', count = 0) {
  const sleepers = buildSleepers(count)
  return {
    id: uid('trecho'),
    name,
    malha: '',
    equipment: '',
    pointCode: '',
    direction: '',
    responsible: '',
    kmStart: '',
    kmEnd: '',
    kmStartScenario2: '',
    kmEndScenario2: '',
    sleeperMaterial: '',
    geometryType: '',
    trackClass: '',
    hasJointWeld: '',
    jointSurroundingGood: '',
    hasGaugeLoss: '',
    hasSupportLoss: '',
    prospectionYear: '',
    inspectionDate: '',
    prospectionCount: '',
    inservivelProspection: '',
    referenceCriticalRate: '',
    sleeperCount: count || '',
    sleepers,
    inspections: sleepers.length ? [createInspection(sleepers)] : [],
    hardScanRecords: [],
    fissureRecords: [],
    notes: ''
  }
}

function ensureTrackShape(track, index = 0) {
  const savedSleeperCount = track?.sleeperCount ?? track?.sleepers?.length ?? 0
  const sleeperCount = Math.max(0, Number(savedSleeperCount) || 0)
  const sleepers = Array.isArray(track?.sleepers) ? track.sleepers : buildSleepers(sleeperCount)
  const inspections = Array.isArray(track?.inspections) ? track.inspections : []
  return {
    ...createTrack(`Trecho ${index + 1}`, sleeperCount),
    ...track,
    sleeperCount: sleeperCount || '',
    inspectionDate: normalizeDateValue(track?.inspectionDate || track?.prospectionYear),
    sleepers,
    inspections: inspections.map((inspection) => ({
      id: inspection.id || uid('insp'),
      date: inspection.date || today(),
      notes: inspection.notes || '',
      locked: inspection.locked === true,
      conditions: Object.fromEntries(sleepers.map((sleeper) => [
        sleeper.id,
        normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      ]))
    })),
    hardScanRecords: normalizeHardScanRecords(track?.hardScanRecords),
    fissureRecords: normalizeFissureRecords(track?.fissureRecords)
  }
}

function analyzeInspection(track, inspection, previousInspection = null) {
  const sleepers = track.sleepers || []
  const totals = createStatusCounts()
  sleepers.forEach((sleeper) => {
    totals[normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)] += 1
  })

  const totalBom = STATUS_KEYS.filter((key) => STATUS[key].group === 'bom').reduce((sum, key) => sum + totals[key], 0)
  const totalRegular = STATUS_KEYS.filter((key) => STATUS[key].group === 'regular').reduce((sum, key) => sum + totals[key], 0)
  const labelTotals = createStatusLabelCounts()
  STATUS_KEYS.forEach((key) => {
    labelTotals[STATUS[key].label] = totals[key]
  })

  const scoreSum = sleepers.reduce((sum, sleeper) => {
    const status = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
    return sum + STATUS[status].score
  }, 0)
  const desempenho = sleepers.length ? Math.round(scoreSum / sleepers.length) : 0

  let worsened = 0
  let improved = 0
  let newCritical = 0
  let newRuins = 0
  let speed = 0
  let days = 0

  if (previousInspection) {
    days = daysBetween(previousInspection.date, inspection.date)
    const previousScore = sleepers.reduce((sum, sleeper) => {
      const status = normalizeStatus(previousInspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      return sum + STATUS[status].score
    }, 0) / Math.max(1, sleepers.length)
    sleepers.forEach((sleeper) => {
      const before = normalizeStatus(previousInspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      const now = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      if (STATUS[now].severity > STATUS[before].severity) worsened += 1
      if (STATUS[now].severity < STATUS[before].severity) improved += 1
      if (isStatusGroup(now, 'critico') && !isStatusGroup(before, 'critico')) newCritical += 1
      if (now === 'ruina' && before !== 'ruina') newRuins += 1
    })
    speed = Number(((previousScore - desempenho) / days).toFixed(2))
  }

  const criticalStatuses = new Set(['inservivel', 'ruina'])
  const clusters = []
  let current = []
  sleepers.forEach((sleeper) => {
    const status = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
    if (criticalStatuses.has(status)) {
      current.push({ ...sleeper, status })
    } else if (current.length) {
      clusters.push(current)
      current = []
    }
  })
  if (current.length) clusters.push(current)

  const regularAdjacents = new Set()
  sleepers.forEach((sleeper, index) => {
    const status = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
    if (!criticalStatuses.has(status)) return
    ;[sleepers[index - 1], sleepers[index + 1]].forEach((neighbor) => {
      if (!neighbor) return
      const neighborStatus = normalizeStatus(inspection.conditions?.[neighbor.id] || DEFAULT_STATUS)
      if (isStatusGroup(neighborStatus, 'regular')) regularAdjacents.add(neighbor.id)
    })
  })

  const clusterDetails = clusters.map((items, index) => ({
    id: index + 1,
    start: items[0].id,
    end: items.at(-1).id,
    label: `${items[0].id}${items.length > 1 ? ` a ${items.at(-1).id}` : ''}`,
    total: items.length,
    inserviveis: items.filter((item) => item.status === 'inservivel').length,
    ruinas: items.filter((item) => item.status === 'ruina').length
  }))

  const critical = totals.inservivel + totals.ruina
  return {
    trackId: track.id,
    trackName: track.name,
    equipment: track.equipment,
    date: inspection.date,
    data: formatDate(inspection.date),
    notes: inspection.notes,
    ...labelTotals,
    Bom: totalBom,
    Regular: totalRegular,
    Inservível: totals.inservivel,
    Ruína: totals.ruina,
    desempenho,
    criticalPercent: sleepers.length ? Number(((critical / sleepers.length) * 100).toFixed(1)) : 0,
    regularOrWorsePercent: sleepers.length ? Number((((totalRegular + critical) / sleepers.length) * 100).toFixed(1)) : 0,
    clustersCriticos: clusters.length,
    maiorMalhaCritica: clusterDetails.reduce((max, cluster) => Math.max(max, cluster.total), 0),
    clusterDetails,
    regularesAdjacentes: regularAdjacents.size,
    regularAdjacentsList: [...regularAdjacents].sort(),
    pinturasUma: totals.inservivel,
    pinturasDuas: totals.ruina,
    worsened,
    improved,
    newCritical,
    newRuins,
    daysSincePrevious: days,
    deteriorationSpeed: speed
  }
}

function analyzeTrack(track) {
  const sleepers = track.sleepers || []
  const inspections = [...(track.inspections || [])].sort((a, b) => parseDate(a.date) - parseDate(b.date))

  if (!sleepers.length || !inspections.length) {
    const emptyLatest = {
      id: null,
      date: '',
      data: '',
      trackId: track.id,
      trackName: track.name || 'Novo trecho',
      equipment: track.equipment || '',
      ...createStatusLabelCounts(),
      Bom: 0,
      Regular: 0,
      Inservível: 0,
      Ruína: 0,
      desempenho: 0,
      criticalPercent: 0,
      regularOrWorsePercent: 0,
      clustersCriticos: 0,
      maiorMalhaCritica: 0,
      clusterDetails: [],
      regularesAdjacentes: 0,
      regularAdjacentsList: [],
      pinturasUma: 0,
      pinturasDuas: 0,
      worsened: 0,
      improved: 0,
      newCritical: 0,
      newRuins: 0,
      daysSincePrevious: 0,
      deteriorationSpeed: 0
    }

    return {
      rows: [],
      latest: emptyLatest,
      initial: emptyLatest,
      totalDays: 0,
      totalScoreDrop: 0,
      averageSpeed: 0,
      projectedDaysToCritical: null,
      classification: 'Sem dados',
      riskIndex: 0,
      sleeperTrend: [],
      worstSleepers: []
    }
  }

  const rows = inspections.map((inspection, index) => analyzeInspection(track, inspection, inspections[index - 1]))
  const latest = rows.at(-1) || analyzeInspection(track, createInspection(track.sleepers || buildSleepers(1)))
  const initial = rows[0] || latest
  const totalDays = rows.length > 1 ? daysBetween(initial.date, latest.date) : 1
  const totalScoreDrop = Number(((initial.desempenho || 0) - (latest.desempenho || 0)).toFixed(1))
  const averageSpeed = Number((totalScoreDrop / totalDays).toFixed(2))

  let classification = 'Ótimo'
  if (latest.Ruína > 0 || latest.maiorMalhaCritica >= 3 || latest.criticalPercent >= 30 || latest.desempenho < 40) classification = 'Crítico'
  else if (latest.Inservível > 0 || latest.criticalPercent >= 10 || latest.regularOrWorsePercent >= 35 || latest.desempenho < 70) classification = 'Atenção'

  const sleeperTrend = (track.sleepers || []).map((sleeper) => {
    let currentStatus = DEFAULT_STATUS
    let degradationSteps = 0
    let criticalSince = null
    inspections.forEach((inspection, index) => {
      const status = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      currentStatus = status
      const previous = inspections[index - 1]
      if (previous) {
        const before = normalizeStatus(previous.conditions?.[sleeper.id] || DEFAULT_STATUS)
        const diff = STATUS[status].severity - STATUS[before].severity
        if (diff > 0) degradationSteps += diff
      }
      if (isStatusGroup(status, 'critico') && !criticalSince) criticalSince = inspection.date
    })
    return {
      id: sleeper.id,
      number: sleeper.number,
      currentStatus,
      degradationSteps,
      criticalSince,
      riskScore: STATUS[currentStatus].severity * 10 + degradationSteps
    }
  }).sort((a, b) => b.riskScore - a.riskScore || a.number - b.number)

  const riskIndex = Number(((100 - latest.desempenho) + latest.criticalPercent * 1.5 + latest.Inservível * 2.5 + latest.Ruína * 5 + latest.clustersCriticos * 4 + latest.regularesAdjacentes * 1.2 + Math.max(0, averageSpeed) * 15).toFixed(1))
  return {
    rows,
    latest,
    initial,
    totalDays,
    totalScoreDrop,
    averageSpeed,
    projectedDaysToCritical: averageSpeed > 0 ? Math.max(0, Math.round(latest.desempenho / averageSpeed)) : null,
    classification,
    riskIndex,
    sleeperTrend,
    worstSleepers: sleeperTrend.filter((item) => item.riskScore > 0).slice(0, 10)
  }
}


function getHardScanAverage(record) {
  const manualAverage = toNumber(record.average)
  if (manualAverage !== null) return manualAverage
  const values = [record.value1, record.value2, record.value3, record.value4].map(toNumber).filter((value) => value !== null)
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : null
}

function analyzeHardScan(records = []) {
  const rows = normalizeHardScanRecords(records).map((record) => ({ ...record, media: getHardScanAverage(record) })).filter((record) => record.media !== null)
  const values = rows.map((row) => row.media)
  const average = values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null
  const weakPoints = rows.filter((row) => row.media <= DEFAULT_HARDSCAN_LIMITS.critical).length
  const attentionPoints = rows.filter((row) => row.media > DEFAULT_HARDSCAN_LIMITS.critical && row.media <= DEFAULT_HARDSCAN_LIMITS.attention).length
  const chartData = rows.slice(-30).map((row, index) => ({ label: row.sleeper ? `D${row.sleeper}` : `Amostra ${index + 1}`, data: formatDate(row.date), media: row.media, equipamento: row.equipment || '-' }))
  return { count: rows.length, rows, average, weakPoints, attentionPoints, chartData }
}

function classifyFissure(record) {
  const opening = toNumber(record.opening) || 0
  const lateral = toNumber(record.lateralLength) || 0
  const superior = toNumber(record.superiorLength) || 0
  const longest = Math.max(lateral, superior)
  if (opening > 3 || (longest >= 2800 && opening >= 1)) return 'ruina'
  if (opening > 1.8 || (longest >= 2800 && opening >= 0.5)) return 'ce'
  if (opening > 0.8 || (longest >= 900 && opening >= 0.5)) return 'cd'
  if (opening > 0.5 || (longest >= 2800 && opening >= 0.25)) return 'cc'
  if (opening > 0.25 || (longest >= 900 && opening >= 0.05)) return 'cb'
  if (opening > 0.05 || longest > 0) return 'ca'
  return 'nao_marcado'
}

function analyzeFissures(records = []) {
  const rows = normalizeFissureRecords(records).map((record) => {
    const autoClass = classifyFissure(record)
    const classKey = record.classKey && record.classKey !== 'nao_marcado' ? record.classKey : autoClass
    return { ...record, classKey, classLabel: FISSURE_CLASS_MAP[classKey].label, severity: FISSURE_CLASS_MAP[classKey].severity, openingNumber: toNumber(record.opening) || 0, lateralNumber: toNumber(record.lateralLength) || 0, superiorNumber: toNumber(record.superiorLength) || 0 }
  })
  const counts = Object.fromEntries(FISSURE_CLASS_KEYS.map((key) => [key, 0]))
  rows.forEach((row) => { counts[row.classKey] += 1 })
  const chartData = FISSURE_CLASSES.map((item) => ({ classe: item.label, total: counts[item.key], severidade: item.severity }))
  const criticalCount = rows.filter((row) => row.severity >= 4).length
  return { count: rows.length, rows, counts, chartData, criticalCount }
}

function getProspectionStats(track) {
  const prospected = toNumber(track?.prospectionCount) || 0
  const inserviveis = toNumber(track?.inservivelProspection) || 0
  const referenceRate = toNumber(track?.referenceCriticalRate)
  const taxa = prospected ? Number(((inserviveis / prospected) * 100).toFixed(1)) : null
  return { prospected, inserviveis, taxa, referenceRate }
}

function aggregateTechnicalData(tracks = []) {
  const prospectionRows = tracks.map((track) => {
    const stats = getProspectionStats(track)
    return { trackId: track.id, trackName: track.name || 'Novo trecho', prospected: stats.prospected, inserviveis: stats.inserviveis, taxa: stats.taxa || 0, referenceRate: stats.referenceRate || 0 }
  }).filter((row) => row.prospected || row.inserviveis)
  const hardScanRows = tracks.map((track) => {
    const analysis = analyzeHardScan(track.hardScanRecords)
    return { trackId: track.id, trackName: track.name || 'Novo trecho', hardScanMedio: analysis.average || 0, pontosFracos: analysis.weakPoints, pontosAtencao: analysis.attentionPoints, total: analysis.count }
  }).filter((row) => row.total)
  const fissureCounts = Object.fromEntries(FISSURE_CLASS_KEYS.map((key) => [key, 0]))
  tracks.forEach((track) => {
    const analysis = analyzeFissures(track.fissureRecords)
    FISSURE_CLASS_KEYS.forEach((key) => { fissureCounts[key] += analysis.counts[key] || 0 })
  })
  const fissureRows = FISSURE_CLASSES.map((item) => ({ classe: item.label, total: fissureCounts[item.key], severidade: item.severity }))
  const allHardScanValues = tracks.flatMap((track) => analyzeHardScan(track.hardScanRecords).rows.map((row) => row.media))
  const hardScanAverage = allHardScanValues.length ? Number((allHardScanValues.reduce((sum, value) => sum + value, 0) / allHardScanValues.length).toFixed(1)) : null
  const prospectionTotal = prospectionRows.reduce((sum, row) => sum + row.prospected, 0)
  const inservivelTotal = prospectionRows.reduce((sum, row) => sum + row.inserviveis, 0)
  const fissureCritical = fissureRows.filter((row) => row.severidade >= 4).reduce((sum, row) => sum + row.total, 0)
  return { prospectionRows, hardScanRows, fissureRows, prospectionTotal, inservivelTotal, prospectionRate: prospectionTotal ? Number(((inservivelTotal / prospectionTotal) * 100).toFixed(1)) : null, hardScanAverage, fissureCritical }
}

function getActionPlan(track, analytics) {
  if (analytics.classification === 'Sem dados') {
    return {
      priority: 'Sem dados',
      deadline: 'Cadastrar informações',
      restriction: 'Nenhuma restrição sugerida antes do cadastro',
      action: 'Preencher o trecho, informar a quantidade de dormentes e aplicar para iniciar a inspeção.',
      reason: 'Ainda não há dormentes ou inspeções cadastradas.'
    }
  }

  const latest = analytics.latest
  const maxCluster = latest.maiorMalhaCritica || 0
  const isCurve = track.geometryType === 'curva'
  const gaugeLoss = track.hasGaugeLoss === 'sim'
  const supportLoss = track.hasSupportLoss === 'sim'
  const jointNeedsAction = track.hasJointWeld === 'sim' && track.jointSurroundingGood === 'nao'

  let priority = 'Monitorar'
  let deadline = 'Próxima rotina'
  let restriction = 'Sem restrição sugerida pelo sistema'
  let action = 'Manter acompanhamento periódico e comparar evolução na próxima inspeção.'
  let reason = 'Sem ruína, sem malha crítica relevante e sem perda de bitola/suporte cadastrada.'

  if (latest.Ruína > 0) {
    priority = 'Crítico gerencial'
    deadline = 'Tratativa imediata'
    restriction = 'Avaliar restrição operacional conforme condição real da via'
    action = 'Marcar ruína com duas pinturas, substituir o dormente em ruína e avaliar inservíveis/intercalados do agrupamento.'
    reason = 'Ruína indica perda de função de suporte/fixação e transfere esforço aos adjacentes.'
  } else if (gaugeLoss && supportLoss && ((isCurve && maxCluster >= 3) || (!isCurve && maxCluster >= 5))) {
    priority = 'P1'
    deadline = '24h / interdição programada'
    restriction = 'Interdição programada conforme avaliação local'
    action = 'Priorizar substituição da malha crítica e escalar para decisão operacional.'
    reason = 'Sequência com perda de bitola e suporte atingiu limite alto.'
  } else if (gaugeLoss && supportLoss && ((isCurve && maxCluster >= 2) || (!isCurve && maxCluster >= 3))) {
    priority = 'P2'
    deadline = '48h'
    restriction = 'Restrição 22 km/h até tratativa'
    action = 'Programar substituição em curto prazo e acompanhar evolução até execução.'
    reason = 'Sequência com perda de bitola e suporte atingiu limite médio.'
  } else if (gaugeLoss && !supportLoss && ((isCurve && maxCluster >= 2) || (!isCurve && maxCluster >= 5))) {
    priority = 'P3'
    deadline = '7 dias'
    restriction = 'Restrição 22 km/h até tratativa'
    action = 'Programar substituição e monitorar vencimento de prazo.'
    reason = 'Sequência com perda de bitola sem perda de suporte atingiu limite baixo.'
  } else if (latest.Inservível > 0 || latest.clustersCriticos > 0) {
    priority = 'Prospecção crítica'
    deadline = 'Planejar substituição'
    restriction = 'Avaliar restrição pela classe e condição local'
    action = 'Marcar inservíveis com uma pintura, quantificar por equipamento e acompanhar regulares adjacentes.'
    reason = 'Existem dormentes inservíveis ou agrupamentos a registrar no plano de substituição.'
  }

  if (jointNeedsAction) {
    action += ' Em junta/solda sem dormentes bons antes e depois, marcar dormentes para substituição com duas pinturas.'
    reason += ' Há junta/solda com entorno sem dormentes bons.'
  }

  return { priority, deadline, restriction, action, reason }
}

function escapeExcel(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}


function sanitizeFileName(value) {
  return String(value || 'arquivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function statusCellStyle(statusKey) {
  const status = STATUS[normalizeStatus(statusKey)]
  return `background:${status.color};color:${status.textColor};font-weight:800;text-align:center;`
}

function buildInspectionGradeHtml(track, mode = 'pdf') {
  const sortedInspections = [...(track.inspections || [])].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  const sleepers = track.sleepers || []
  const title = `Grade de inspeção de dormentes - ${escapeExcel(track.name)}`
  const sleeperHeaders = sleepers.map((sleeper) => `<th>${escapeExcel(sleeper.id)}</th>`).join('')
  const rows = sortedInspections.map((inspection) => {
    const cells = sleepers.map((sleeper) => {
      const key = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
      const content = STATUS[key].short
      return `<td style="${statusCellStyle(key)}">${escapeExcel(content)}</td>`
    }).join('')
    return `<tr><td>${escapeExcel(formatDate(inspection.date))}</td><td>${escapeExcel(inspection.notes)}</td>${cells}</tr>`
  }).join('')

  const legend = Object.entries(STATUS).map(([key, status]) => `<span style="display:inline-block;margin:0 8px 8px 0;padding:6px 10px;border-radius:10px;${statusCellStyle(key)}">${escapeExcel(status.short)} - ${escapeExcel(status.label)}</span>`).join('')

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #123a63; margin: 18px; }
          h1 { margin: 0 0 8px; color: #083b6e; font-size: 22px; }
          h2 { margin: 18px 0 8px; color: #083b6e; font-size: 16px; }
          p { margin: 4px 0; }
          table { border-collapse: collapse; width: 100%; font-size: 11px; }
          th, td { border: 1px solid #9eb8d2; padding: 6px; white-space: nowrap; }
          th { background: #eaf3fb; color: #083b6e; font-weight: 800; }
          .meta { margin: 12px 0 14px; padding: 10px; border: 1px solid #d7e3ef; border-radius: 10px; background: #f6fbff; }
          .legend { margin: 10px 0 14px; }
          @media print {
            body { margin: 10mm; }
            table { font-size: 9px; }
            th, td { padding: 4px; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          <p><strong>Ponto de monitoramento:</strong> ${escapeExcel(track.name)}</p>
          <p><strong>Cenário 1:</strong> ${escapeExcel(track.kmStart)} até ${escapeExcel(track.kmEnd)}</p>
          <p><strong>Cenário 2:</strong> ${escapeExcel(track.kmStartScenario2 || '')} até ${escapeExcel(track.kmEndScenario2 || '')}</p>
          <p><strong>Data da inspeção:</strong> ${escapeExcel(formatDate(track.inspectionDate || ''))}</p>
          <p><strong>Malha:</strong> ${escapeExcel(track.malha)} &nbsp; <strong>Equipamento:</strong> ${escapeExcel(track.equipment)}</p>
          <p><strong>Inspetor:</strong> ${escapeExcel(track.responsible)} &nbsp; <strong>Material:</strong> ${escapeExcel(track.sleeperMaterial)}</p>
        </div>
        <div class="legend">${legend}</div>
        <h2>Grade de inspeção</h2>
        <table>
          <thead><tr><th>Data</th><th>Observação</th>${sleeperHeaders}</tr></thead>
          <tbody>${rows || '<tr><td colspan="2">Sem inspeções registradas.</td></tr>'}</tbody>
        </table>
      </body>
    </html>
  `
}

function getFilteredTrackIds(tracks, selectedDashboardTrack) {
  return selectedDashboardTrack === 'all' ? tracks.map((track) => track.id) : [selectedDashboardTrack]
}

function buildDashboardRows(tracks, selectedDashboardTrack, startDate, endDate) {
  const trackIds = new Set(getFilteredTrackIds(tracks, selectedDashboardTrack))
  return tracks
    .filter((track) => trackIds.has(track.id))
    .flatMap((track) => analyzeTrack(track).rows)
    .filter((row) => !startDate || parseDate(row.date) >= parseDate(startDate))
    .filter((row) => !endDate || parseDate(row.date) <= parseDate(endDate))
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))
}

function groupRowsByDate(rows, conditionFilter = 'all') {
  const grouped = new Map()
  rows.forEach((row) => {
    const key = row.date
    const current = grouped.get(key) || {
      date: key,
      data: formatDate(key),
      ...createStatusLabelCounts(),
      Bom: 0,
      Regular: 0,
      Inservível: 0,
      Ruína: 0,
      desempenhoTotal: 0,
      desempenhoCount: 0,
      criticalPercentTotal: 0,
      criticalPercentCount: 0,
      clustersCriticos: 0,
      maiorMalhaCritica: 0,
      pinturasUma: 0,
      pinturasDuas: 0,
      regularesAdjacentes: 0,
      newCritical: 0,
      newRuins: 0
    }
    STATUS_KEYS.forEach((key) => {
      current[STATUS[key].label] += row[STATUS[key].label] || 0
    })
    current.Bom += row.Bom
    current.Regular += row.Regular
    current.Inservível += row.Inservível
    current.Ruína += row.Ruína
    current.desempenhoTotal += row.desempenho
    current.desempenhoCount += 1
    current.criticalPercentTotal += row.criticalPercent
    current.criticalPercentCount += 1
    current.clustersCriticos += row.clustersCriticos
    current.maiorMalhaCritica = Math.max(current.maiorMalhaCritica, row.maiorMalhaCritica)
    current.pinturasUma += row.pinturasUma
    current.pinturasDuas += row.pinturasDuas
    current.regularesAdjacentes += row.regularesAdjacentes
    current.newCritical += row.newCritical
    current.newRuins += row.newRuins
    grouped.set(key, current)
  })
  return [...grouped.values()].map((row) => ({
    ...row,
    desempenho: row.desempenhoCount ? Math.round(row.desempenhoTotal / row.desempenhoCount) : 0,
    criticalPercent: row.criticalPercentCount ? Number((row.criticalPercentTotal / row.criticalPercentCount).toFixed(1)) : 0,
    condicaoFiltrada: conditionFilter === 'all'
      ? STATUS_KEYS.reduce((sum, key) => sum + (row[STATUS[key].label] || 0), 0)
      : row[STATUS[conditionFilter].label] || 0
  }))
}

function Metric({ icon, title, value, detail }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      {children}
    </div>
  )
}

function EmptyHint({ children }) {
  return <p className="empty-hint">{children}</p>
}

export default function App() {
  const [tracks, setTracks] = useState(() => [createTrack()])
  const [selectedTrackId, setSelectedTrackId] = useState(null)
  const [newInspectionDate, setNewInspectionDate] = useState(today())
  const [activeTab, setActiveTab] = useState('trechos')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [savedAt, setSavedAt] = useState('')
  const [dashboardTrack, setDashboardTrack] = useState('all')
  const [dashboardStart, setDashboardStart] = useState('')
  const [dashboardEnd, setDashboardEnd] = useState('')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [inspectionEditor, setInspectionEditor] = useState(null)
  const [historyTrack, setHistoryTrack] = useState('all')
  const [historySort, setHistorySort] = useState('desc')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (!inspectionEditor) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [inspectionEditor])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data.tracks) && data.tracks.length) {
        const nextTracks = data.tracks.map(ensureTrackShape)
        setTracks(nextTracks)
        setSelectedTrackId(data.selectedTrackId || nextTracks[0].id)
        setSavedAt(data.savedAt || '')
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (!selectedTrackId && tracks.length) setSelectedTrackId(tracks[0].id)
  }, [tracks, selectedTrackId])

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) || tracks[0]
  const selectedAnalysis = useMemo(() => analyzeTrack(selectedTrack), [selectedTrack])
  const ranking = useMemo(() => tracks.map((track) => ({ track, analytics: analyzeTrack(track) })).sort((a, b) => b.analytics.riskIndex - a.analytics.riskIndex), [tracks])
  const actionPlan = useMemo(() => getActionPlan(selectedTrack, selectedAnalysis), [selectedTrack, selectedAnalysis])
  const chartColors = theme === 'dark' ? DARK_CHART_COLORS : CHART_COLORS
  const dashboardRows = useMemo(() => buildDashboardRows(tracks, dashboardTrack, dashboardStart, dashboardEnd), [tracks, dashboardTrack, dashboardStart, dashboardEnd])
  const dashboardGrouped = useMemo(() => groupRowsByDate(dashboardRows, conditionFilter), [dashboardRows, conditionFilter])
  const dashboardTotals = useMemo(() => dashboardRows.reduce((acc, row) => {
    acc.Bom += row.Bom
    acc.Regular += row.Regular
    acc.Inservível += row.Inservível
    acc.Ruína += row.Ruína
    acc.clusters += row.clustersCriticos
    acc.pinturasUma += row.pinturasUma
    acc.pinturasDuas += row.pinturasDuas
    acc.regularesAdjacentes += row.regularesAdjacentes
    acc.desempenhoTotal += row.desempenho
    acc.count += 1
    return acc
  }, { Bom: 0, Regular: 0, Inservível: 0, Ruína: 0, clusters: 0, pinturasUma: 0, pinturasDuas: 0, regularesAdjacentes: 0, desempenhoTotal: 0, count: 0 }), [dashboardRows])
  const dashboardScore = dashboardTotals.count ? Math.round(dashboardTotals.desempenhoTotal / dashboardTotals.count) : 0
  const dashboardTracks = useMemo(() => dashboardTrack === 'all' ? tracks : tracks.filter((track) => track.id === dashboardTrack), [tracks, dashboardTrack])
  const dashboardTechnical = useMemo(() => aggregateTechnicalData(dashboardTracks), [dashboardTracks])
  const selectedHardScan = useMemo(() => analyzeHardScan(selectedTrack?.hardScanRecords || []), [selectedTrack])
  const selectedFissures = useMemo(() => analyzeFissures(selectedTrack?.fissureRecords || []), [selectedTrack])
  const selectedProspection = useMemo(() => getProspectionStats(selectedTrack), [selectedTrack])

  const historyData = useMemo(() => {
    const entries = tracks.map((track) => {
      const analysis = analyzeTrack(track)
      const rows = [...analysis.rows].sort((a, b) => historySort === 'asc'
        ? parseDate(a.date) - parseDate(b.date)
        : parseDate(b.date) - parseDate(a.date))
      const dates = rows.map((row) => row.date).filter(Boolean).sort()
      return { track, analysis, rows, firstDate: dates[0] || '', lastDate: dates.at(-1) || '' }
    })
    const filteredEntries = historyTrack === 'all' ? entries : entries.filter((entry) => entry.track.id === historyTrack)
    const consolidated = filteredEntries
      .flatMap((entry) => entry.rows.map((row) => ({ ...row, track: entry.track })))
      .sort((a, b) => historySort === 'asc' ? parseDate(a.date) - parseDate(b.date) : parseDate(b.date) - parseDate(a.date))
    const allDates = entries.flatMap((entry) => entry.rows.map((row) => row.date)).filter(Boolean).sort()
    return {
      entries,
      filteredEntries,
      consolidated,
      totalTracks: tracks.length,
      tracksWithInspections: entries.filter((entry) => entry.rows.length).length,
      totalInspections: entries.reduce((sum, entry) => sum + entry.rows.length, 0),
      totalSleepers: tracks.reduce((sum, track) => sum + (track.sleepers?.length || 0), 0),
      firstDate: allDates[0] || '',
      lastDate: allDates.at(-1) || ''
    }
  }, [tracks, historyTrack, historySort])

  function updateTrack(patch) {
    setTracks((current) => current.map((track) => track.id === selectedTrack.id ? { ...track, ...patch } : track))
  }

  function addTrack() {
    const next = createTrack(`Novo trecho ${tracks.length + 1}`, 0)
    setTracks((current) => [...current, next])
    setSelectedTrackId(next.id)
    setActiveTab('trechos')
  }

  function removeTrack(trackId) {
    if (tracks.length === 1) return
    const nextTracks = tracks.filter((track) => track.id !== trackId)
    setTracks(nextTracks)
    if (selectedTrackId === trackId) setSelectedTrackId(nextTracks[0].id)
  }

  function applySleeperCount() {
    const count = Math.max(1, Math.min(300, Number(selectedTrack.sleeperCount) || 1))
    const sleepers = buildSleepers(count)
    setTracks((current) => current.map((track) => {
      if (track.id !== selectedTrack.id) return track
      const previous = [...(track.inspections || [])].sort((a, b) => parseDate(a.date) - parseDate(b.date)).at(-1)
      const conditions = {}
      sleepers.forEach((sleeper) => {
        conditions[sleeper.id] = normalizeStatus(previous?.conditions?.[sleeper.id] || DEFAULT_STATUS)
      })
      return {
        ...track,
        sleeperCount: count,
        sleepers,
        inspections: [{ id: uid('insp'), date: today(), notes: 'Quantidade de dormentes atualizada', conditions, locked: true }]
      }
    }))
  }

  function addInspection() {
    if (!selectedTrack.sleepers.length) return
    const sorted = [...selectedTrack.inspections].sort((a, b) => parseDate(a.date) - parseDate(b.date))
    const previous = sorted.at(-1)
    const conditions = {}
    selectedTrack.sleepers.forEach((sleeper) => {
      conditions[sleeper.id] = normalizeStatus(previous?.conditions?.[sleeper.id] || DEFAULT_STATUS)
    })
    setTracks((current) => current.map((track) => track.id === selectedTrack.id
      ? { ...track, inspections: [...track.inspections, { id: uid('insp'), date: newInspectionDate || today(), notes: 'Nova ida ao trecho', conditions, locked: true }] }
      : track
    ))
  }

  function deleteInspection(inspectionId) {
    if (selectedTrack.inspections.length === 1) return
    setTracks((current) => current.map((track) => track.id === selectedTrack.id
      ? { ...track, inspections: track.inspections.filter((inspection) => inspection.id !== inspectionId) }
      : track
    ))
  }

  function updateInspection(inspectionId, patch) {
    setTracks((current) => current.map((track) => track.id === selectedTrack.id
      ? { ...track, inspections: track.inspections.map((inspection) => inspection.id === inspectionId ? { ...inspection, ...patch } : inspection) }
      : track
    ))
  }

  function updateCell(inspectionId, sleeperId, status) {
    setTracks((current) => current.map((track) => track.id === selectedTrack.id
      ? {
          ...track,
          inspections: track.inspections.map((inspection) => {
            if (inspection.id !== inspectionId || inspection.locked) return inspection
            return { ...inspection, conditions: { ...inspection.conditions, [sleeperId]: status } }
          })
        }
      : track
    ))
  }

  function openInspectionEditor(inspectionId, sleeperIndex = 0) {
    if (!selectedTrack?.sleepers?.length) return
    updateInspection(inspectionId, { locked: false })
    setInspectionEditor({
      inspectionId,
      sleeperIndex: Math.max(0, Math.min(Number(sleeperIndex) || 0, selectedTrack.sleepers.length - 1))
    })
  }

  function closeInspectionEditor({ lock = true } = {}) {
    if (inspectionEditor?.inspectionId && lock) {
      updateInspection(inspectionEditor.inspectionId, { locked: true })
    }
    setInspectionEditor(null)
  }

  function moveInspectionEditor(delta) {
    setInspectionEditor((current) => {
      if (!current || !selectedTrack?.sleepers?.length) return current
      const nextIndex = Math.max(0, Math.min(current.sleeperIndex + delta, selectedTrack.sleepers.length - 1))
      return { ...current, sleeperIndex: nextIndex }
    })
  }

  function updateEditorCell(status) {
    if (!inspectionEditor || !selectedTrack?.sleepers?.length) return
    const sleeper = selectedTrack.sleepers[Math.max(0, Math.min(inspectionEditor.sleeperIndex, selectedTrack.sleepers.length - 1))]
    if (!sleeper) return
    setTracks((current) => current.map((track) => track.id === selectedTrack.id
      ? {
          ...track,
          inspections: track.inspections.map((inspection) => inspection.id === inspectionEditor.inspectionId
            ? { ...inspection, conditions: { ...inspection.conditions, [sleeper.id]: status }, locked: false }
            : inspection
          )
        }
      : track
    ))
  }

  function addHardScanRecord() {
    const nextRecord = { id: uid('hs'), date: today(), sleeper: '', equipment: selectedTrack.equipment || selectedTrack.name || '', value1: '', value2: '', value3: '', value4: '', average: '', notes: '' }
    updateTrack({ hardScanRecords: [...(selectedTrack.hardScanRecords || []), nextRecord] })
  }

  function updateHardScanRecord(recordId, patch) {
    updateTrack({ hardScanRecords: (selectedTrack.hardScanRecords || []).map((record) => record.id === recordId ? { ...record, ...patch } : record) })
  }

  function deleteHardScanRecord(recordId) {
    updateTrack({ hardScanRecords: (selectedTrack.hardScanRecords || []).filter((record) => record.id !== recordId) })
  }

  function addFissureRecord() {
    const nextRecord = { id: uid('fis'), date: today(), sleeper: '', side: '', classKey: 'nao_marcado', lateralLength: '', superiorLength: '', opening: '', notes: '' }
    updateTrack({ fissureRecords: [...(selectedTrack.fissureRecords || []), nextRecord] })
  }

  function updateFissureRecord(recordId, patch) {
    updateTrack({ fissureRecords: (selectedTrack.fissureRecords || []).map((record) => record.id === recordId ? { ...record, ...patch } : record) })
  }

  function deleteFissureRecord(recordId) {
    updateTrack({ fissureRecords: (selectedTrack.fissureRecords || []).filter((record) => record.id !== recordId) })
  }

  function saveData() {
    const timestamp = new Date().toLocaleString('pt-BR')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tracks, selectedTrackId, savedAt: timestamp }))
    setSavedAt(timestamp)
  }

  function clearData() {
    const emptyTrack = createTrack()
    localStorage.removeItem(STORAGE_KEY)
    setTracks([emptyTrack])
    setSelectedTrackId(emptyTrack.id)
    setDashboardTrack('all')
    setDashboardStart('')
    setDashboardEnd('')
    setConditionFilter('all')
    setSavedAt('')
    setActiveTab('trechos')
  }

  function exportExcel() {
    const statusHeaders = STATUS_KEYS.map((key) => `<th>${escapeExcel(STATUS[key].label)}</th>`).join('')
    const rows = dashboardRows.map((row) => {
      const statusCells = STATUS_KEYS.map((key) => `<td>${row[STATUS[key].label] || 0}</td>`).join('')
      return `
        <tr><td>${escapeExcel(row.trackName)}</td><td>${escapeExcel(row.equipment)}</td><td>${escapeExcel(row.data)}</td>${statusCells}<td>${row.desempenho}</td><td>${row.criticalPercent}%</td><td>${row.clustersCriticos}</td><td>${row.maiorMalhaCritica}</td><td>${row.pinturasUma}</td><td>${row.pinturasDuas}</td><td>${row.regularesAdjacentes}</td><td>${escapeExcel(row.notes)}</td></tr>
      `
    }).join('')
    const rankingRows = ranking.map((item, index) => `
      <tr><td>${index + 1}</td><td>${escapeExcel(item.track.name)}</td><td>${escapeExcel(item.track.equipment)}</td><td>${item.analytics.classification}</td><td>${item.analytics.latest.desempenho}</td><td>${item.analytics.latest.Inservível}</td><td>${item.analytics.latest.Ruína}</td><td>${item.analytics.latest.clustersCriticos}</td><td>${item.analytics.riskIndex}</td></tr>
    `).join('')
    const html = `
      <html><head><meta charset="UTF-8" /></head><body>
        <h1>Dashboard de dormentes - Marcelo Dias</h1>
        <p><strong>Filtro de trecho:</strong> ${dashboardTrack === 'all' ? 'Todos' : escapeExcel(tracks.find((t) => t.id === dashboardTrack)?.name || '')}</p>
        <p><strong>Período:</strong> ${dashboardStart ? formatDate(dashboardStart) : 'início'} até ${dashboardEnd ? formatDate(dashboardEnd) : 'fim'}</p>
        <h2>Dados filtrados</h2>
        <table border="1"><tr><th>Trecho</th><th>Equipamento</th><th>Data</th>${statusHeaders}<th>Desempenho</th><th>% Crítico</th><th>Malhas</th><th>Maior malha</th><th>1 pintura</th><th>2 pinturas</th><th>Regulares adj.</th><th>Observação</th></tr>${rows}</table>
        <h2>Ranking de trechos</h2>
        <table border="1"><tr><th>#</th><th>Trecho</th><th>Equipamento</th><th>Classificação</th><th>Desempenho</th><th>Inservíveis</th><th>Ruína</th><th>Malhas</th><th>Risco</th></tr>${rankingRows}</table>
        <h2>Prospecção / referência Ferronorte</h2>
        <table border="1"><tr><th>Trecho</th><th>Prospectados</th><th>Inservíveis</th><th>Taxa calculada</th><th>Taxa referência</th></tr>${dashboardTechnical.prospectionRows.map((row) => `<tr><td>${escapeExcel(row.trackName)}</td><td>${row.prospected}</td><td>${row.inserviveis}</td><td>${row.taxa}%</td><td>${row.referenceRate}%</td></tr>`).join('')}</table>
        <h2>HardScan por trecho</h2>
        <table border="1"><tr><th>Trecho</th><th>Média</th><th>Pontos atenção</th><th>Pontos fracos</th><th>Amostras</th></tr>${dashboardTechnical.hardScanRows.map((row) => `<tr><td>${escapeExcel(row.trackName)}</td><td>${row.hardScanMedio}</td><td>${row.pontosAtencao}</td><td>${row.pontosFracos}</td><td>${row.total}</td></tr>`).join('')}</table>
        <h2>Fissuras por classe</h2>
        <table border="1"><tr><th>Classe</th><th>Total</th></tr>${dashboardTechnical.fissureRows.map((row) => `<tr><td>${escapeExcel(row.classe)}</td><td>${row.total}</td></tr>`).join('')}</table>
      </body></html>`
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-dormentes-marcelo-dias.xls'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function printDashboardPDF() {
    setActiveTab('dashboard')
    setTimeout(() => window.print(), 150)
  }

  function exportInspectionGradeExcel() {
    const html = buildInspectionGradeHtml(selectedTrack, 'excel')
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `grade-inspecao-${sanitizeFileName(selectedTrack.name)}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function printInspectionGradePDF() {
    const html = buildInspectionGradeHtml(selectedTrack, 'pdf')
    const frame = document.createElement('iframe')
    frame.style.position = 'fixed'
    frame.style.right = '0'
    frame.style.bottom = '0'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const doc = frame.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()
    setTimeout(() => {
      frame.contentWindow.focus()
      frame.contentWindow.print()
      setTimeout(() => document.body.removeChild(frame), 1200)
    }, 250)
  }

  function buildHistoryHtml() {
    const statusHeaders = STATUS_KEYS.map((key) => `<th>${escapeExcel(STATUS[key].label)}</th>`).join('')
    const trackRows = historyData.entries.map((entry) => {
      const km = entry.track.kmStart && entry.track.kmEnd ? `${entry.track.kmStart} a ${entry.track.kmEnd}` : '-'
      return `<tr><td>${escapeExcel(entry.track.name || 'Novo trecho')}</td><td>${escapeExcel(km)}</td><td>${escapeExcel(entry.track.malha || '-')}</td><td>${escapeExcel(entry.track.responsible || '-')}</td><td>${entry.track.sleepers?.length || 0}</td><td>${entry.rows.length}</td><td>${entry.firstDate ? formatDate(entry.firstDate) : '-'}</td><td>${entry.lastDate ? formatDate(entry.lastDate) : '-'}</td><td>${entry.analysis.classification}</td><td>${entry.analysis.latest.desempenho}</td><td>${entry.analysis.riskIndex}</td></tr>`
    }).join('')
    const inspectionRows = historyData.consolidated.map((row) => {
      const km = row.track.kmStart && row.track.kmEnd ? `${row.track.kmStart} a ${row.track.kmEnd}` : '-'
      const statusCells = STATUS_KEYS.map((key) => `<td>${row[STATUS[key].label] || 0}</td>`).join('')
      return `<tr><td>${escapeExcel(row.data)}</td><td>${escapeExcel(row.track.name || 'Novo trecho')}</td><td>${escapeExcel(km)}</td><td>${escapeExcel(row.track.responsible || '-')}</td><td>${row.track.sleepers?.length || 0}</td><td>${row.desempenho}</td>${statusCells}<td>${row.Bom}</td><td>${row.Regular}</td><td>${row.Inservível}</td><td>${row.Ruína}</td><td>${row.criticalPercent}%</td><td>${row.clustersCriticos}</td><td>${row.maiorMalhaCritica}</td><td>${row.newCritical}</td><td>${row.newRuins}</td><td>${escapeExcel(row.notes || '')}</td></tr>`
    }).join('')
    const trackFilterLabel = historyTrack === 'all' ? 'Todos os trechos' : (tracks.find((t) => t.id === historyTrack)?.name || '-')
    return `
      <html><head><meta charset="UTF-8" />
      <style>body{font-family:Arial,Helvetica,sans-serif;color:#052A52;padding:18px;}h1{font-size:20px;margin:0 0 4px;}h2{font-size:15px;margin:22px 0 8px;}p{margin:2px 0;font-size:12px;}table{border-collapse:collapse;width:100%;font-size:11px;margin-top:6px;}th,td{border:1px solid #9bb6cf;padding:5px 6px;text-align:left;}th{background:#e7f1fb;}</style>
      </head><body>
        <h1>Histórico de prospecção de dormentes — Rumo</h1>
        <p><strong>Filtro:</strong> ${escapeExcel(trackFilterLabel)} &nbsp;•&nbsp; <strong>Ordem:</strong> ${historySort === 'asc' ? 'Mais antiga primeiro' : 'Mais recente primeiro'}</p>
        <p><strong>Trechos:</strong> ${historyData.totalTracks} &nbsp;•&nbsp; <strong>Inspeções:</strong> ${historyData.totalInspections} &nbsp;•&nbsp; <strong>Dormentes monitorados:</strong> ${historyData.totalSleepers}</p>
        <p><strong>Período:</strong> ${historyData.firstDate ? formatDate(historyData.firstDate) : 'sem registro'} até ${historyData.lastDate ? formatDate(historyData.lastDate) : 'sem registro'}</p>
        <h2>Resumo por trecho</h2>
        <table><tr><th>Trecho</th><th>KM</th><th>Malha</th><th>Inspetor</th><th>Dormentes</th><th>Inspeções</th><th>1ª inspeção</th><th>Última inspeção</th><th>Classificação</th><th>Desempenho</th><th>Risco</th></tr>${trackRows || '<tr><td colspan="11">Sem trechos cadastrados.</td></tr>'}</table>
        <h2>Todas as inspeções</h2>
        <table><tr><th>Data</th><th>Trecho</th><th>KM</th><th>Inspetor</th><th>Dorm.</th><th>Desemp.</th>${statusHeaders}<th>Bom</th><th>Regular</th><th>Inservível</th><th>Ruína</th><th>% Crítico</th><th>Malhas</th><th>Maior malha</th><th>Novos críticos</th><th>Novas ruínas</th><th>Observação</th></tr>${inspectionRows || '<tr><td colspan="20">Nenhuma inspeção registrada.</td></tr>'}</table>
      </body></html>`
  }

  function exportHistoryExcel() {
    const blob = new Blob([buildHistoryHtml()], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'historico-dormentes-rumo.xls'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function printHistoryPDF() {
    const frame = document.createElement('iframe')
    frame.style.position = 'fixed'
    frame.style.right = '0'
    frame.style.bottom = '0'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const doc = frame.contentWindow.document
    doc.open()
    doc.write(buildHistoryHtml())
    doc.close()
    setTimeout(() => {
      frame.contentWindow.focus()
      frame.contentWindow.print()
      setTimeout(() => document.body.removeChild(frame), 1200)
    }, 250)
  }

  const tabItems = [
    { id: 'trechos', label: 'Registro de trechos', icon: Train },
    { id: 'inspecao', label: 'Inspeção', icon: ClipboardList },
    { id: 'ensaios', label: 'Ensaios e fissuras', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'procedimentos', label: 'Procedimentos', icon: BookOpen }
  ]

  const editorInspection = inspectionEditor
    ? selectedTrack?.inspections?.find((inspection) => inspection.id === inspectionEditor.inspectionId)
    : null
  const editorSleeperCount = selectedTrack?.sleepers?.length || 0
  const editorSleeperIndex = editorSleeperCount
    ? Math.max(0, Math.min(inspectionEditor?.sleeperIndex || 0, editorSleeperCount - 1))
    : 0
  const editorSleeper = editorSleeperCount ? selectedTrack.sleepers[editorSleeperIndex] : null
  const editorCurrentStatus = editorInspection && editorSleeper
    ? normalizeStatus(editorInspection.conditions?.[editorSleeper.id] || DEFAULT_STATUS)
    : DEFAULT_STATUS
  const editorProgress = editorSleeperCount ? Math.round(((editorSleeperIndex + 1) / editorSleeperCount) * 100) : 0

  return (
    <main className="app">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar no-print ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-block">
            <img src="./assets/brand/rumo-logo-negativo.png" alt="Rumo" className="sidebar-brand-logo" />
            <div>
              <strong>Menu principal</strong>
              <p>Fluxo de trabalho: registre locais, inspecione, depois apresente no dashboard.</p>
            </div>
          </div>
          <button className="ghost sidebar-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <nav className="nav-menu">
          {tabItems.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} className={`nav-button ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}>
                <Icon size={18} /> {item.label}
              </button>
            )
          })}
        </nav>
        <section className="sidebar-section">
          <h3>Trecho ativo</h3>
          <select value={selectedTrack?.id || ''} onChange={(e) => setSelectedTrackId(e.target.value)}>
            {tracks.map((track) => <option key={track.id} value={track.id}>{track.name || 'Novo trecho'}</option>)}
          </select>
          <p className="muted">O trecho ativo é usado por padrão na aba de inspeção.</p>
          <button className="full outline" onClick={addTrack}><Plus size={16} /> Novo trecho</button>
        </section>
      </aside>

      <header className="hero no-print">
        <div className="hero-copy">
          <div className="hero-menu-row">
            <button className="menu-trigger outline" onClick={() => setSidebarOpen(true)}><Menu size={18} /> Menu</button>
            <button className="theme-toggle outline" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            </button>
          </div>
          <h1>Controle de degradação de dormentes</h1>
        </div>
        <aside className="hero-brand-panel">
          <img src="./assets/brand/rumo-logo-tagline-negativo.png" alt="Rumo" />
          <strong>Qualidade de via</strong>
          <span>Interface compacta para ver mais dados por tela.</span>
        </aside>
      </header>

      <section className="quick-save no-print">
        <div>
          <strong>{savedAt ? `Último salvamento: ${savedAt}` : 'Dados ainda não salvos nesta sessão'}</strong>
          <p>Os dados ficam neste navegador. Salve depois de registrar ou editar inspeções.</p>
        </div>
        <div className="actions">
          <button onClick={saveData}><Save size={16} /> Salvar</button>
          <button className="outline" onClick={clearData}>Limpar dados</button>
        </div>
      </section>

      {inspectionEditor && editorInspection && editorSleeper && (
        <div className="inspection-editor-overlay no-print" role="dialog" aria-modal="true" aria-label="Modo de edição da linha">
          <section className="inspection-editor-panel">
            <button className="inspection-editor-close" onClick={() => closeInspectionEditor({ lock: true })} aria-label="Sair da edição"><X size={24} /></button>
            <div className="inspection-editor-header">
              <div>
                <span className="section-kicker">Edição ampliada</span>
                <h2>Modo de edição da linha</h2>
                <p>Use os botões grandes para marcar a condição do dormente sem sofrer no celular.</p>
              </div>
              <div className="inspection-editor-progress">
                <strong>Dormente {editorSleeperIndex + 1} de {editorSleeperCount}</strong>
                <span>{editorSleeper.id}</span>
                <div className="progress-track"><i style={{ width: `${editorProgress}%` }} /></div>
              </div>
            </div>

            <div className="inspection-editor-meta">
              <label><CalendarDays size={18} /> Data da linha<input type="date" value={editorInspection.date} onChange={(e) => updateInspection(editorInspection.id, { date: e.target.value })} onClick={(e) => e.currentTarget.showPicker?.()} /></label>
              <label><ClipboardList size={18} /> Observação<input value={editorInspection.notes} onChange={(e) => updateInspection(editorInspection.id, { notes: e.target.value })} placeholder="Observação da inspeção" /></label>
            </div>

            <div className="inspection-editor-box">
              <div className="inspection-editor-current">
                <span>Dormente atual</span>
                <strong>{editorSleeper.id}</strong>
                <em>{STATUS[editorCurrentStatus].label}</em>
              </div>
              <div className="inspection-editor-status-grid">
                {Object.entries(STATUS).map(([statusKey, status]) => (
                  <button
                    key={statusKey}
                    className={`editor-status-button ${status.className} ${editorCurrentStatus === statusKey ? 'selected' : ''}`}
                    onClick={() => updateEditorCell(statusKey)}
                    type="button"
                  >
                    <span>{status.short}</span>
                    <strong>{status.label}</strong>
                    {editorCurrentStatus === statusKey && <small><CheckCircle2 size={18} /> Selecionado</small>}
                  </button>
                ))}
              </div>
            </div>

            <div className="inspection-editor-actions">
              <button className="outline editor-nav-button" onClick={() => moveInspectionEditor(-1)} disabled={editorSleeperIndex === 0}>← Anterior</button>
              <button className="editor-nav-button" onClick={() => moveInspectionEditor(1)} disabled={editorSleeperIndex >= editorSleeperCount - 1}>Próximo →</button>
              <button className="editor-lock-button" onClick={() => closeInspectionEditor({ lock: true })}><Lock size={20} /> Bloquear novamente</button>
              <button className="danger editor-exit-button" onClick={() => closeInspectionEditor({ lock: true })}><X size={20} /> Sair da edição</button>
            </div>
          </section>
        </div>
      )}

      <section className="content">
        {activeTab === 'trechos' && (
          <section className="panel no-print">
            <div className="section-head">
              <div>
                <span className="section-kicker">Cadastro base</span>
                <h2>Registro de locais / trechos</h2>
                <p className="muted">Cadastre aqui as informações que serão reutilizadas na inspeção e no dashboard.</p>
              </div>
              <button onClick={addTrack}><Plus size={16} /> Adicionar trecho</button>
            </div>
            <div className="track-management">
              <aside className="track-list-card">
                {tracks.map((track) => {
                  const analysis = analyzeTrack(track)
                  return (
                    <button key={track.id} className={`track-button ${track.id === selectedTrack.id ? 'active' : ''}`} onClick={() => setSelectedTrackId(track.id)}>
                      <strong>{track.name || 'Novo trecho'}</strong>
                      <span>{track.kmStart && track.kmEnd ? `${track.kmStart} até ${track.kmEnd}` : 'KM não informado'}</span>
                      <small>{analysis.classification} • risco {analysis.riskIndex}</small>
                    </button>
                  )
                })}
              </aside>
              <div className="track-form">
                <div className="form-grid form-grid-expanded">
                  <label>Ponto de monitoramento<input value={selectedTrack.name} onChange={(e) => updateTrack({ name: e.target.value })} /></label>
                  <label>Inspetor<input value={selectedTrack.responsible || ''} onChange={(e) => updateTrack({ responsible: e.target.value })} /></label>
                  <label>Malha<select value={selectedTrack.malha || ''} onChange={(e) => updateTrack({ malha: e.target.value })}><option value="">Selecione</option><option>Ferronorte</option><option>Malha Central</option><option>Malha Paulista</option><option>Outra</option></select></label>
                  <label>Material<select value={selectedTrack.sleeperMaterial || ''} onChange={(e) => updateTrack({ sleeperMaterial: e.target.value })}><option value="">Selecione</option><option value="concreto">Concreto</option><option value="madeira">Madeira</option><option value="aco">Aço</option><option value="polimero">Polímero</option></select></label>
                  <label>Traçado<select value={selectedTrack.geometryType || ''} onChange={(e) => updateTrack({ geometryType: e.target.value })}><option value="">Selecione</option><option value="tangente">Tangente</option><option value="curva">Curva</option></select></label>
                  <label>Cenário 1 - KM inicial<input value={selectedTrack.kmStart || ''} onChange={(e) => updateTrack({ kmStart: e.target.value })} /></label>
                  <label>Cenário 1 - KM Final<input value={selectedTrack.kmEnd || ''} onChange={(e) => updateTrack({ kmEnd: e.target.value })} /></label>
                  <label>Cenário 2 - KM inicial<input value={selectedTrack.kmStartScenario2 || ''} onChange={(e) => updateTrack({ kmStartScenario2: e.target.value })} /></label>
                  <label>Cenário 2 - KM Final<input value={selectedTrack.kmEndScenario2 || ''} onChange={(e) => updateTrack({ kmEndScenario2: e.target.value })} /></label>
                  <label>Data da inspeção<input type="date" value={selectedTrack.inspectionDate || ''} onChange={(e) => updateTrack({ inspectionDate: e.target.value })} onClick={(e) => e.currentTarget.showPicker?.()} /></label>
                  <label>Quantidade de dormentes<span className="input-with-button"><input type="number" min="1" max="300" value={selectedTrack.sleeperCount} onChange={(e) => updateTrack({ sleeperCount: e.target.value })} /><button onClick={applySleeperCount}>Aplicar</button></span></label>
                </div>
                <label className="full-label compact-notes">Observações do local<textarea rows={2} placeholder="Observações rápidas do local" value={selectedTrack.notes || ''} onChange={(e) => updateTrack({ notes: e.target.value })} /></label>
                <button className="danger outline" disabled={tracks.length === 1} onClick={() => removeTrack(selectedTrack.id)}><Trash2 size={16} /> Excluir trecho selecionado</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'inspecao' && (
          <>
            <section className="panel no-print">
              <div className="section-head">
                <div>
                  <span className="section-kicker">Campo</span>
                  <h2>Inspeção de dormentes</h2>
                  <p className="muted">Escolha o trecho cadastrado e registre a condição dos mesmos dormentes ao longo das idas ao local.</p>
                </div>
              </div>
              <div className="inspection-top-grid">
                <label>Trecho para trabalhar<select value={selectedTrack.id} onChange={(e) => setSelectedTrackId(e.target.value)}>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name || 'Novo trecho'}</option>)}</select></label>
                <label>Data da nova linha<input type="date" value={newInspectionDate} onChange={(e) => setNewInspectionDate(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} /></label>
                <button onClick={addInspection} disabled={!selectedTrack.sleepers.length}><Plus size={16} /> Adicionar dia de serviço</button>
              </div>
              <div className="legend legend-large">
                {Object.entries(STATUS).map(([key, status]) => <span key={key} className={status.className}>{status.label}</span>)}
              </div>
            </section>

            <section className="panel report-section">
              <div className="section-head compact-head">
                <div>
                  <h2>Grade de inspeção</h2>
                  <p className="muted">Cada linha é uma ida ao trecho. Cada coluna é um dormente. Para evitar esbarrão no celular, a linha só altera depois de clicar em <strong>Editar linha</strong>.</p>
                </div>
                <div className="actions no-print">
                  <button className="success" onClick={exportInspectionGradeExcel}><FileSpreadsheet size={16} /> Excel da grade</button>
                  <button className="danger" onClick={printInspectionGradePDF}><FileText size={16} /> PDF da grade</button>
                </div>
              </div>
              {!selectedTrack.sleepers.length && <EmptyHint>Informe a quantidade de dormentes no cadastro do trecho e clique em Aplicar para iniciar a grade.</EmptyHint>}
              <div className="table-wrap">
                <table className="inspection-table">
                  <thead>
                    <tr>
                      <th className="sticky-col">Ação</th>
                      <th>Data</th>
                      <th>Observação</th>
                      {selectedTrack.sleepers.map((sleeper) => <th key={sleeper.id}>{sleeper.id}</th>)}
                      <th>Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...selectedTrack.inspections].sort((a, b) => parseDate(a.date) - parseDate(b.date)).map((inspection) => (
                      <tr key={inspection.id} className={inspection.locked ? 'locked-row' : 'editing-row'}>
                        <td className="sticky-col action-cell">
                          <button className={inspection.locked ? 'outline' : 'success'} onClick={() => openInspectionEditor(inspection.id)}>
                            <Pencil size={15} /> Editar
                          </button>
                        </td>
                        <td><input type="date" disabled={inspection.locked} value={inspection.date} onChange={(e) => updateInspection(inspection.id, { date: e.target.value })} onClick={(e) => e.currentTarget.showPicker?.()} /></td>
                        <td><input disabled={inspection.locked} value={inspection.notes} onChange={(e) => updateInspection(inspection.id, { notes: e.target.value })} /></td>
                        {selectedTrack.sleepers.map((sleeper) => {
                          const current = normalizeStatus(inspection.conditions?.[sleeper.id] || DEFAULT_STATUS)
                          return (
                            <td key={sleeper.id}>
                              <div className="cell-stack">
                                {Object.entries(STATUS).map(([statusKey, status]) => (
                                  <button key={statusKey} className={`cell-option ${status.className} ${current === statusKey ? 'active' : ''}`} onClick={() => openInspectionEditor(inspection.id, sleeper.number - 1)} title={`${sleeper.id} · ${status.label}`}>{status.short}</button>
                                ))}
                              </div>
                            </td>
                          )
                        })}
                        <td><button className="ghost" disabled={selectedTrack.inspections.length === 1 || inspection.locked} onClick={() => deleteInspection(inspection.id)}><Trash2 size={15} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'ensaios' && (
          <section className="dashboard-report report-section">
            <section className="panel no-print dashboard-controls">
              <div>
                <span className="section-kicker">Ensaios complementares</span>
                <h2>HardScan e monitoramento de fissuras</h2>
                <p className="muted">Campos inspirados nas abas HardScan, Prospecção por vídeo e Monitoramento Fissura da planilha. Eles complementam a grade de siglas sem substituir o padrão atual.</p>
              </div>
              <div className="dashboard-filter-grid">
                <label>Trecho<select value={selectedTrack.id} onChange={(e) => setSelectedTrackId(e.target.value)}>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name || 'Novo trecho'}</option>)}</select></label>
                <label>Taxa prospecção calculada<input readOnly value={selectedProspection.taxa === null ? 'Sem dados' : `${selectedProspection.taxa}%`} /></label>
                <label>HardScan médio<input readOnly value={selectedHardScan.average === null ? 'Sem dados' : selectedHardScan.average} /></label>
                <label>Fissuras críticas<input readOnly value={selectedFissures.criticalCount} /></label>
              </div>
            </section>

            <section className="metrics">
              <Metric icon={<TrendingUp />} title="Taxa de prospecção" value={selectedProspection.taxa === null ? '-' : `${selectedProspection.taxa}%`} detail="Inservíveis / prospectados do trecho" />
              <Metric icon={<BarChart3 />} title="HardScan médio" value={selectedHardScan.average === null ? '-' : selectedHardScan.average} detail={`${selectedHardScan.count} amostras cadastradas`} />
              <Metric icon={<AlertTriangle />} title="Pontos fracos" value={selectedHardScan.weakPoints} detail={`≤ ${DEFAULT_HARDSCAN_LIMITS.critical} no HardScan`} />
              <Metric icon={<FileText />} title="Fissuras críticas" value={selectedFissures.criticalCount} detail="Classes CD, CE ou ruína" />
            </section>

            <section className="charts">
              <ChartCard title="HardScan por dormente" subtitle="Compara média individual do ensaio por dormente/amostra.">
                {selectedHardScan.chartData.length ? <ResponsiveContainer width="100%" height={218}><BarChart data={selectedHardScan.chartData}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="label" stroke={chartColors.text} /><YAxis stroke={chartColors.text} /><Tooltip /><Legend /><Bar dataKey="media" name="Média HardScan" fill={chartColors.aqua} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer> : <EmptyHint>Cadastre medições HardScan para visualizar o gráfico.</EmptyHint>}
              </ChartCard>
              <ChartCard title="Fissuras por classe" subtitle="Classificação automática por abertura/comprimento, com possibilidade de ajuste manual.">
                {selectedFissures.count ? <ResponsiveContainer width="100%" height={218}><BarChart data={selectedFissures.chartData}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="classe" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="total" name="Fissuras" fill={chartColors.regular_l2} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer> : <EmptyHint>Cadastre fissuras para visualizar o gráfico.</EmptyHint>}
              </ChartCard>
            </section>

            <section className="split report-section">
              <div className="panel">
                <div className="section-head compact-head">
                  <div><h2>Registro HardScan</h2><p className="muted">Modelo compatível com DORM, valores 1 a 4, média individual, equipamento e data.</p></div>
                  <button className="no-print" onClick={addHardScanRecord}><Plus size={16} /> Adicionar</button>
                </div>
                <div className="table-wrap compact technical-table"><table><thead><tr><th>Data</th><th>Dormente</th><th>Equipamento</th><th>V1</th><th>V2</th><th>V3</th><th>V4</th><th>Média</th><th>Obs.</th><th>Excluir</th></tr></thead><tbody>{(selectedTrack.hardScanRecords || []).length ? (selectedTrack.hardScanRecords || []).map((record) => <tr key={record.id}><td><input type="date" value={record.date} onChange={(e) => updateHardScanRecord(record.id, { date: e.target.value })} /></td><td><input value={record.sleeper} onChange={(e) => updateHardScanRecord(record.id, { sleeper: e.target.value })} /></td><td><input value={record.equipment} onChange={(e) => updateHardScanRecord(record.id, { equipment: e.target.value })} /></td><td><input value={record.value1} onChange={(e) => updateHardScanRecord(record.id, { value1: e.target.value })} /></td><td><input value={record.value2} onChange={(e) => updateHardScanRecord(record.id, { value2: e.target.value })} /></td><td><input value={record.value3} onChange={(e) => updateHardScanRecord(record.id, { value3: e.target.value })} /></td><td><input value={record.value4} onChange={(e) => updateHardScanRecord(record.id, { value4: e.target.value })} /></td><td><input value={record.average} placeholder={formatNumber(getHardScanAverage(record))} onChange={(e) => updateHardScanRecord(record.id, { average: e.target.value })} /></td><td><input value={record.notes} onChange={(e) => updateHardScanRecord(record.id, { notes: e.target.value })} /></td><td><button className="ghost" onClick={() => deleteHardScanRecord(record.id)}><Trash2 size={15} /></button></td></tr>) : <tr><td colSpan="10">Sem medições cadastradas.</td></tr>}</tbody></table></div>
              </div>

              <div className="panel">
                <div className="section-head compact-head">
                  <div><h2>Monitoramento de fissuras</h2><p className="muted">Registre lado, comprimento lateral/superior e abertura. O sistema sugere a classe da planilha.</p></div>
                  <button className="no-print" onClick={addFissureRecord}><Plus size={16} /> Adicionar</button>
                </div>
                <div className="table-wrap compact technical-table"><table><thead><tr><th>Data</th><th>Dormente</th><th>Lado</th><th>Lateral mm</th><th>Superior mm</th><th>Abertura mm</th><th>Classe</th><th>Obs.</th><th>Excluir</th></tr></thead><tbody>{(selectedTrack.fissureRecords || []).length ? (selectedTrack.fissureRecords || []).map((record) => <tr key={record.id}><td><input type="date" value={record.date} onChange={(e) => updateFissureRecord(record.id, { date: e.target.value })} /></td><td><input value={record.sleeper} onChange={(e) => updateFissureRecord(record.id, { sleeper: e.target.value })} /></td><td><select value={record.side} onChange={(e) => updateFissureRecord(record.id, { side: e.target.value })}><option value="">-</option><option>LE</option><option>LD</option><option>Centro</option></select></td><td><input value={record.lateralLength} onChange={(e) => updateFissureRecord(record.id, { lateralLength: e.target.value, classKey: classifyFissure({ ...record, lateralLength: e.target.value }) })} /></td><td><input value={record.superiorLength} onChange={(e) => updateFissureRecord(record.id, { superiorLength: e.target.value, classKey: classifyFissure({ ...record, superiorLength: e.target.value }) })} /></td><td><input value={record.opening} onChange={(e) => updateFissureRecord(record.id, { opening: e.target.value, classKey: classifyFissure({ ...record, opening: e.target.value }) })} /></td><td><select value={record.classKey} onChange={(e) => updateFissureRecord(record.id, { classKey: e.target.value })}>{FISSURE_CLASSES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></td><td><input value={record.notes} onChange={(e) => updateFissureRecord(record.id, { notes: e.target.value })} /></td><td><button className="ghost" onClick={() => deleteFissureRecord(record.id)}><Trash2 size={15} /></button></td></tr>) : <tr><td colSpan="9">Sem fissuras cadastradas.</td></tr>}</tbody></table></div>
              </div>
            </section>
          </section>
        )}

        {activeTab === 'dashboard' && (
          <section className="dashboard-report report-section">
            <section className="panel no-print dashboard-controls">
              <div>
                <span className="section-kicker">Apresentação gerencial</span>
                <h2>Dashboard filtrável</h2>
                <p className="muted">Use os filtros para montar a apresentação por trecho, período e condição do dormente.</p>
              </div>
              <div className="dashboard-filter-grid">
                <label>Trecho<select value={dashboardTrack} onChange={(e) => setDashboardTrack(e.target.value)}><option value="all">Todos os trechos</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name || 'Novo trecho'}</option>)}</select></label>
                <label>Data inicial<input type="date" value={dashboardStart} onChange={(e) => setDashboardStart(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} /></label>
                <label>Data final<input type="date" value={dashboardEnd} onChange={(e) => setDashboardEnd(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} /></label>
                <label>Condição no gráfico<select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}><option value="all">Todas</option>{Object.entries(STATUS).map(([key, status]) => <option key={key} value={key}>{status.label}</option>)}</select></label>
              </div>
              <div className="actions dashboard-actions">
                <button onClick={exportExcel}><FileSpreadsheet size={16} /> Exportar Excel</button>
                <button className="danger" onClick={printDashboardPDF}><FileText size={16} /> PDF de apresentação</button>
              </div>
            </section>

            <section className="metrics">
              <Metric icon={<BarChart3 />} title="Desempenho médio" value={`${dashboardScore}/100`} detail="Média das inspeções filtradas" />
              <Metric icon={<AlertTriangle />} title="Críticos" value={`${dashboardTotals.Inservível + dashboardTotals.Ruína}`} detail="Inservível + Ruína" />
              <Metric icon={<Train />} title="Malhas críticas" value={dashboardTotals.clusters} detail="Clusters de inservível/ruína" />
              <Metric icon={<CheckCircle2 />} title="Marcações" value={`${dashboardTotals.pinturasUma}/${dashboardTotals.pinturasDuas}`} detail="1 pintura / 2 pinturas" />
              <Metric icon={<TrendingUp />} title="Taxa prospecção" value={dashboardTechnical.prospectionRate === null ? '-' : `${dashboardTechnical.prospectionRate}%`} detail={`${dashboardTechnical.inservivelTotal} inservíveis / ${dashboardTechnical.prospectionTotal} prospectados`} />
              <Metric icon={<BarChart3 />} title="HardScan médio" value={dashboardTechnical.hardScanAverage === null ? '-' : dashboardTechnical.hardScanAverage} detail="Média das amostras filtradas" />
              <Metric icon={<FileText />} title="Fissuras críticas" value={dashboardTechnical.fissureCritical} detail="Classes CD, CE e ruína" />
              <Metric icon={<AlertTriangle />} title="Regulares adj." value={dashboardTotals.regularesAdjacentes} detail="Regulares ao lado de críticos" />
            </section>

            <section className="panel report-section action-plan-card">
              <div>
                <span className="section-kicker">Plano sugerido do trecho ativo</span>
                <h2>{actionPlan.priority} • {actionPlan.deadline}</h2>
                <p className="analysis-text"><strong>Ação:</strong> {actionPlan.action}</p>
              </div>
              <div className="action-plan-meta"><span><strong>Restrição</strong>{actionPlan.restriction}</span><span><strong>Motivo</strong>{actionPlan.reason}</span></div>
            </section>

            {dashboardGrouped.length === 0 ? <EmptyHint>Nenhum dado encontrado para os filtros selecionados.</EmptyHint> : (
              <section className="charts">
                <ChartCard title="Evolução do desempenho" subtitle="Queda da nota indica degradação do trecho ao longo das idas.">
                  <ResponsiveContainer width="100%" height={218}><LineChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis domain={[0, 100]} stroke={chartColors.text} /><Tooltip /><Legend /><Line type="monotone" dataKey="desempenho" name="Desempenho" stroke={chartColors.line} strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Composição por condição" subtitle="Bom Azul-Novo, Bom Verde-Antigo, Regular L1/L2/L3, Inservível e Ruína.">
                  <ResponsiveContainer width="100%" height={218}><AreaChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend />{STATUS_KEYS.map((key) => <Area key={key} type="monotone" dataKey={STATUS[key].label} name={STATUS[key].label} stackId="1" stroke={chartColors[key]} fill={chartColors[key]} fillOpacity={0.78} />)}</AreaChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Taxa crítica" subtitle="Percentual de dormentação inservível/ruína dentro do filtro.">
                  <ResponsiveContainer width="100%" height={218}><LineChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} /><Tooltip /><Legend /><Line type="monotone" dataKey="criticalPercent" name="% crítico" stroke={chartColors.inservivel} strokeWidth={3} /></LineChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Condição filtrada" subtitle="Mostra somente a condição escolhida nos filtros do dashboard.">
                  <ResponsiveContainer width="100%" height={218}><BarChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="condicaoFiltrada" name={conditionFilter === 'all' ? 'Todas as condições' : STATUS[conditionFilter].label} fill={conditionFilter === 'all' ? chartColors.line : chartColors[conditionFilter]} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Malhas / clusters" subtitle="Sequências de dormentes em condição crítica.">
                  <ResponsiveContainer width="100%" height={218}><BarChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="clustersCriticos" name="Malhas críticas" fill={chartColors.line} radius={[8, 8, 0, 0]} /><Bar dataKey="maiorMalhaCritica" name="Maior malha" fill={chartColors.aqua} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Marcação de prospecção" subtitle="Uma pintura para inservível e duas pinturas para ruína.">
                  <ResponsiveContainer width="100%" height={218}><BarChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="pinturasUma" name="1 pintura" fill={chartColors.inservivel} radius={[8, 8, 0, 0]} /><Bar dataKey="pinturasDuas" name="2 pinturas" fill={chartColors.ruina} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </ChartCard>
              </section>
            )}

            {(dashboardTechnical.prospectionRows.length || dashboardTechnical.hardScanRows.length || dashboardTechnical.fissureRows.some((row) => row.total > 0)) ? (
              <section className="charts">
                {!!dashboardTechnical.prospectionRows.length && <ChartCard title="Taxa de inservíveis por prospecção" subtitle="Personalizado a partir da aba Prospecção Trecho: inservíveis / dormentes prospectados."><ResponsiveContainer width="100%" height={218}><BarChart data={dashboardTechnical.prospectionRows}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="trackName" stroke={chartColors.text} interval={0} angle={-18} textAnchor="end" height={58} /><YAxis stroke={chartColors.text} /><Tooltip /><Legend /><Bar dataKey="taxa" name="Taxa %" fill={chartColors.inservivel} radius={[8, 8, 0, 0]} /><Bar dataKey="referenceRate" name="Taxa ref. %" fill={chartColors.regular_l2} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>}
                {!!dashboardTechnical.hardScanRows.length && <ChartCard title="HardScan médio por trecho" subtitle="Média dos ensaios cadastrados por trecho/equipamento."><ResponsiveContainer width="100%" height={218}><BarChart data={dashboardTechnical.hardScanRows}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="trackName" stroke={chartColors.text} interval={0} angle={-18} textAnchor="end" height={58} /><YAxis stroke={chartColors.text} /><Tooltip /><Legend /><Bar dataKey="hardScanMedio" name="Média HardScan" fill={chartColors.aqua} radius={[8, 8, 0, 0]} /><Bar dataKey="pontosFracos" name="Pontos fracos" fill={chartColors.inservivel} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>}
                {dashboardTechnical.fissureRows.some((row) => row.total > 0) && <ChartCard title="Fissuras por classe" subtitle="Consolida as classes CA, CB, CC, CD, CE e Ruína dos trechos filtrados."><ResponsiveContainer width="100%" height={218}><BarChart data={dashboardTechnical.fissureRows}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="classe" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="total" name="Fissuras" fill={chartColors.regular_l2} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>}
                {dashboardGrouped.length > 0 && <ChartCard title="Novos críticos e ruínas" subtitle="Mostra quando a inspeção atual criou novas condições críticas contra a ida anterior."><ResponsiveContainer width="100%" height={218}><BarChart data={dashboardGrouped}><CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" /><XAxis dataKey="data" stroke={chartColors.text} /><YAxis stroke={chartColors.text} allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="newCritical" name="Novos críticos" fill={chartColors.inservivel} radius={[8, 8, 0, 0]} /><Bar dataKey="newRuins" name="Novas ruínas" fill={chartColors.ruina} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>}
              </section>
            ) : null}

            <section className="split report-section">
              <div className="panel">
                <h2>Ranking de trechos</h2>
                <div className="table-wrap compact"><table><thead><tr><th>#</th><th>Trecho</th><th>Classe</th><th>Desemp.</th><th>I</th><th>RU</th><th>Malhas</th><th>Risco</th></tr></thead><tbody>{ranking.map((item, index) => <tr key={item.track.id} className={item.track.id === selectedTrack.id ? 'highlight-row' : ''}><td>{index + 1}</td><td>{item.track.name}</td><td>{item.analytics.classification}</td><td>{item.analytics.latest.desempenho}</td><td>{item.analytics.latest.Inservível}</td><td>{item.analytics.latest.Ruína}</td><td>{item.analytics.latest.clustersCriticos}</td><td>{item.analytics.riskIndex}</td></tr>)}</tbody></table></div>
              </div>
              <div className="panel">
                <h2>Piores dormentes do trecho ativo</h2>
                <div className="table-wrap compact"><table><thead><tr><th>Dormente</th><th>Status</th><th>Pioras</th><th>Crítico desde</th></tr></thead><tbody>{selectedAnalysis.worstSleepers.length ? selectedAnalysis.worstSleepers.map((item) => <tr key={item.id}><td>{item.id}</td><td>{STATUS[item.currentStatus].label}</td><td>{item.degradationSteps}</td><td>{item.criticalSince ? formatDate(item.criticalSince) : '-'}</td></tr>) : <tr><td colSpan="4">Sem degradação registrada.</td></tr>}</tbody></table></div>
              </div>
            </section>
          </section>
        )}

        {activeTab === 'historico' && (
          <section className="dashboard-report report-section">
            <section className="panel no-print dashboard-controls">
              <div>
                <span className="section-kicker"><History size={15} /> Registro completo</span>
                <h2>Histórico de prospecção</h2>
                <p className="muted">Reúne todos os trechos cadastrados e todas as inspeções já registradas neste aparelho, ordenadas por data.</p>
              </div>
              <div className="dashboard-filter-grid">
                <label>Trecho<select value={historyTrack} onChange={(e) => setHistoryTrack(e.target.value)}><option value="all">Todos os trechos</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name || 'Novo trecho'}</option>)}</select></label>
                <label>Ordenar por data<select value={historySort} onChange={(e) => setHistorySort(e.target.value)}><option value="desc">Mais recente primeiro</option><option value="asc">Mais antiga primeiro</option></select></label>
              </div>
              <div className="actions dashboard-actions">
                <button className="success" onClick={exportHistoryExcel}><FileSpreadsheet size={16} /> Exportar Excel</button>
                <button className="danger" onClick={printHistoryPDF}><FileText size={16} /> PDF do histórico</button>
              </div>
            </section>

            <section className="metrics">
              <Metric icon={<Train />} title="Trechos cadastrados" value={historyData.totalTracks} detail={`${historyData.tracksWithInspections} com inspeção registrada`} />
              <Metric icon={<ClipboardList />} title="Inspeções registradas" value={historyData.totalInspections} detail="Somando todas as idas a campo" />
              <Metric icon={<CalendarDays />} title="Período coberto" value={historyData.firstDate ? formatDate(historyData.firstDate) : '-'} detail={historyData.lastDate ? `até ${formatDate(historyData.lastDate)}` : 'sem registros'} />
              <Metric icon={<BarChart3 />} title="Dormentes monitorados" value={historyData.totalSleepers} detail="Total na base de trechos" />
            </section>

            <div className="legend legend-large no-print">
              {Object.entries(STATUS).map(([key, status]) => <span key={key} className={status.className}>{status.label}</span>)}
            </div>

            <section className="panel report-section">
              <div className="section-head compact-head">
                <div>
                  <h2>Linha do tempo de inspeções</h2>
                  <p className="muted">Cada linha é uma ida a campo. {historyTrack === 'all' ? 'Inclui todos os trechos cadastrados.' : 'Filtrado pelo trecho selecionado.'}</p>
                </div>
              </div>
              {historyData.consolidated.length === 0 ? <EmptyHint>Nenhuma inspeção registrada ainda. Cadastre um trecho e registre inspeções para alimentar o histórico.</EmptyHint> : (
                <div className="table-wrap compact">
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th><th>Trecho</th><th>KM</th><th>Inspetor</th><th>Dorm.</th><th>Desemp.</th><th>Bom</th><th>Regular</th><th>Inservível</th><th>Ruína</th><th>% Crít.</th><th>Malhas</th><th>Novos crít./ruína</th><th>Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.consolidated.map((row, index) => (
                        <tr key={`${row.trackId}-${row.date}-${index}`}>
                          <td>{row.data}</td>
                          <td>{row.track.name || 'Novo trecho'}</td>
                          <td>{row.track.kmStart && row.track.kmEnd ? `${row.track.kmStart}–${row.track.kmEnd}` : '-'}</td>
                          <td>{row.track.responsible || '-'}</td>
                          <td>{row.track.sleepers?.length || 0}</td>
                          <td><strong>{row.desempenho}</strong></td>
                          <td>{row.Bom}</td>
                          <td>{row.Regular}</td>
                          <td style={row.Inservível ? { color: STATUS.inservivel.color, fontWeight: 900 } : undefined}>{row.Inservível}</td>
                          <td style={row.Ruína ? { fontWeight: 900 } : undefined}>{row.Ruína}</td>
                          <td>{row.criticalPercent}%</td>
                          <td>{row.clustersCriticos}</td>
                          <td>{row.newCritical || row.newRuins ? `${row.newCritical}/${row.newRuins}` : '-'}</td>
                          <td>{row.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="panel report-section">
              <div className="section-head compact-head">
                <div>
                  <h2>Detalhe por trecho</h2>
                  <p className="muted">Cada trecho com seus dados de cadastro e o histórico completo das suas inspeções.</p>
                </div>
              </div>
              {historyData.filteredEntries.length === 0 ? <EmptyHint>Nenhum trecho para exibir.</EmptyHint> : (
                <div className="history-track-list">
                  {historyData.filteredEntries.map((entry) => {
                    const km = entry.track.kmStart && entry.track.kmEnd ? `${entry.track.kmStart} até ${entry.track.kmEnd}` : 'KM não informado'
                    const classColor = CLASSIFICATION_COLORS[entry.analysis.classification] || '#7C93A8'
                    return (
                      <article key={entry.track.id} className="history-track-card">
                        <div className="history-track-head">
                          <div>
                            <h3>{entry.track.name || 'Novo trecho'}</h3>
                            <div className="history-meta">
                              <span>{km}</span>
                              {entry.track.malha && <span>Malha: {entry.track.malha}</span>}
                              {entry.track.sleeperMaterial && <span>Material: {entry.track.sleeperMaterial}</span>}
                              {entry.track.geometryType && <span>Traçado: {entry.track.geometryType}</span>}
                              {entry.track.responsible && <span>Inspetor: {entry.track.responsible}</span>}
                              <span>{entry.track.sleepers?.length || 0} dormentes</span>
                              <span>{entry.rows.length} inspeções</span>
                              {entry.lastDate && <span>Última: {formatDate(entry.lastDate)}</span>}
                            </div>
                          </div>
                          <span className="history-pill" style={{ color: classColor }}>{entry.analysis.classification} • risco {entry.analysis.riskIndex}</span>
                        </div>
                        {entry.rows.length === 0 ? <p className="history-empty">Sem inspeções registradas para este trecho.</p> : (
                          <div className="table-wrap compact">
                            <table>
                              <thead>
                                <tr><th>Data</th><th>Desemp.</th><th>Bom</th><th>Regular</th><th>Inservível</th><th>Ruína</th><th>% Crít.</th><th>Malhas</th><th>Maior malha</th><th>Pioras</th><th>Melhoras</th><th>Novos crít./ruína</th><th>Observação</th></tr>
                              </thead>
                              <tbody>
                                {entry.rows.map((row, index) => (
                                  <tr key={`${entry.track.id}-${row.date}-${index}`}>
                                    <td>{row.data}</td>
                                    <td><strong>{row.desempenho}</strong></td>
                                    <td>{row.Bom}</td>
                                    <td>{row.Regular}</td>
                                    <td style={row.Inservível ? { color: STATUS.inservivel.color, fontWeight: 900 } : undefined}>{row.Inservível}</td>
                                    <td style={row.Ruína ? { fontWeight: 900 } : undefined}>{row.Ruína}</td>
                                    <td>{row.criticalPercent}%</td>
                                    <td>{row.clustersCriticos}</td>
                                    <td>{row.maiorMalhaCritica}</td>
                                    <td>{row.worsened}</td>
                                    <td>{row.improved}</td>
                                    <td>{row.newCritical || row.newRuins ? `${row.newCritical}/${row.newRuins}` : '-'}</td>
                                    <td>{row.notes || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </section>
        )}

        {activeTab === 'procedimentos' && (
          <section className="procedures-grid">
            <div className="panel procedure-intro">
              <span className="section-kicker">Consulta rápida</span>
              <h2>Procedimentos e critérios de classificação</h2>
              <p>Esta aba existe para o usuário consultar o critério antes de registrar a condição no campo. Ela resume a nova classificação: Bom Azul-Novo, Bom Verde-Antigo, Regular L1/L2/L3, Inservível, Ruína, Cluster/Malha, Taxa, marcações e criticidades.</p>
            </div>
            {Object.entries(STATUS).map(([key, status]) => (
              <div key={key} className={`panel procedure-card ${status.className}`}>
                <h2>{status.label}</h2>
                <p>{status.description}</p>
                {status.group === 'bom' && <ul><li>Não deve haver perda de bitola.</li><li>Não deve haver ombreira afogada, quebra que impeça fixação ou fixação não travada.</li><li>Não deve haver aço exposto, DRT agressivo ou fissura/vazio na região do trilho.</li></ul>}
                {key === 'regular_l1' && <ul><li>Primeiro nível de atenção: defeito leve e controlado.</li><li>Registrar para comparar na próxima ida ao trecho.</li><li>Não deve apresentar perda funcional de suporte ou fixação.</li></ul>}
                {key === 'regular_l2' && <ul><li>Nível intermediário: degradação moderada, com necessidade de acompanhamento mais próximo.</li><li>Verificar se está adjacente a inservível ou ruína.</li><li>Observar evolução para L3 ou inservível nas próximas inspeções.</li></ul>}
                {key === 'regular_l3' && <ul><li>Nível alto de regularidade: degradação acentuada, próximo de inservível.</li><li>Priorizar no planejamento de campo e observar impactos em bitola/suporte.</li><li>Se houver defeito crítico na região do trilho, reclassificar como inservível.</li></ul>}
                {key === 'inservivel' && <ul><li>Inclui perda de bitola, ombreira quebrada/afogada, fixação não travada, aço exposto com comprometimento, DRT agressivo ou falha na região do trilho.</li><li>Na prospecção recebe uma pintura.</li><li>Deve ser quantificado por equipamento e por malha/cluster.</li></ul>}
                {key === 'ruina' && <ul><li>Indica perda da função de suporte/fixação do trilho.</li><li>Transfere esforço para dormentes adjacentes e acelera degradação dos intercalados.</li><li>Na prospecção recebe duas pinturas.</li></ul>}
              </div>
            ))}
            <div className="panel procedure-card wide">
              <h2>Cluster / Malha e Taxa</h2>
              <ul><li><strong>Cluster/Malha:</strong> sequência de dormentes inservíveis ou em ruína na via permanente.</li><li><strong>Taxa:</strong> porcentagem de dormentação inservível/crítica no trecho analisado.</li><li>O dashboard calcula a quantidade de malhas, a maior sequência e o percentual crítico.</li></ul>
            </div>
            <div className="panel procedure-card wide">
              <h2>Marcação de prospecção</h2>
              <ul><li><strong>Inservível:</strong> uma pintura.</li><li><strong>Ruína:</strong> duas pinturas.</li><li>Em equipamentos com junta/solda no trilho, deve haver dormentes bons antes e depois; se não houver, marcar com duas pinturas para substituição.</li></ul>
            </div>
            <div className="panel procedure-card wide">
              <h2>HardScan e fissuras</h2>
              <ul><li><strong>HardScan:</strong> registre DORM, valores de ensaio, média individual, equipamento e data para acompanhar pontos fracos por gráfico.</li><li><strong>Fissuras:</strong> use lado LE/LD, comprimento lateral/superior e abertura em mm. O sistema sugere classes CA, CB, CC, CD, CE ou Ruína.</li><li>Esses dados não substituem a sigla/cor da inspeção; eles explicam o motivo técnico da piora e melhoram a apresentação gerencial.</li></ul>
            </div>
            <div className="panel procedure-card wide">
              <h2>Criticidade operacional</h2>
              <ul><li><strong>P3:</strong> perda de bitola sem perda de suporte em sequência limite; restrição 22 km/h e tratativa em 7 dias.</li><li><strong>P2:</strong> perda de bitola com perda de suporte em sequência média; restrição 22 km/h e tratativa em 48h.</li><li><strong>P1:</strong> perda de bitola e suporte em sequência alta; interdição programada / 24h.</li><li>O sistema sugere prioridade, mas a decisão final deve seguir a avaliação operacional local e os documentos vigentes.</li></ul>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
