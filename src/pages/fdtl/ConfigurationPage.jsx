import { useState } from 'react';
import { BookOpen, CopyPlus, FlaskConical, ShieldCheck } from 'lucide-react';
import { Alert, Badge, Button, Card, DetailList, Input, LoadingState, Modal, PageHeader, Select, Table, Tabs } from '../../components/common';
import useAsync from '../../hooks/useAsync';
import { getRulePacks, getRuleTables, createRulePackVersion, testRulePack } from '../../services/fdtlService';
import { PROTOTYPE_DISCLAIMER } from '../../data/fdtlData';
import { formatDate } from '../../utils/time';
import { useToast } from '../../context/ToastContext';

const TABS = ['Rule Pack', 'FDP Limits', 'Flight Time', 'Rest Rules', 'Night / WOCL', 'Cumulative', 'Extensions'];

const ruleTableConfig = {
  'FDP Limits': {
    source: 'fdpLimitTable',
    rowKey: 'reportingWindow',
    description: 'Maximum FDP by reporting time and number of sectors.',
    columns: [
      { key: 'reportingWindow', header: 'Reporting Time' },
      { key: 'oneTwoSectors', header: '1–2 Sectors' },
      { key: 'threeSectors', header: '3 Sectors' },
      { key: 'fourSectors', header: '4 Sectors' },
      { key: 'fivePlusSectors', header: '5+ Sectors' },
    ],
  },
  'Flight Time': {
    source: 'flightTimeLimits',
    rowKey: 'limitKey',
    description: 'Maximum flight time per period.',
    columns: [
      { key: 'period', header: 'Period' },
      { key: 'crew', header: 'Crew Complement' },
      { key: 'limit', header: 'Limit' },
    ],
  },
  'Rest Rules': {
    source: 'restRules',
    rowKey: 'rule',
    description: 'Minimum rest requirements.',
    columns: [
      { key: 'rule', header: 'Rule' },
      { key: 'value', header: 'Value' },
      { key: 'note', header: 'Notes' },
    ],
  },
  'Night / WOCL': {
    source: 'nightRules',
    rowKey: 'rule',
    description: 'Window of circadian low and night duty rules.',
    columns: [
      { key: 'rule', header: 'Rule' },
      { key: 'value', header: 'Value' },
      { key: 'note', header: 'Notes' },
    ],
  },
  Cumulative: {
    source: 'cumulativeRules',
    rowKey: 'window',
    description: 'Rolling cumulative duty and flight time limits.',
    columns: [
      { key: 'window', header: 'Rolling Window' },
      { key: 'dutyLimit', header: 'Duty Limit' },
      { key: 'flightLimit', header: 'Flight Time Limit' },
    ],
  },
  Extensions: {
    source: 'extensionRules',
    rowKey: 'rule',
    description: 'FDP extensions and commander discretion.',
    columns: [
      { key: 'rule', header: 'Rule' },
      { key: 'value', header: 'Value' },
      { key: 'approval', header: 'Approval' },
    ],
  },
};

export default function ConfigurationPage() {
  const { notify } = useToast();
  const [tab, setTab] = useState(TABS[0]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newVersion, setNewVersion] = useState({ name: 'NSOP India', version: '2026.01', effectiveFrom: '2027-01-01' });
  const [creating, setCreating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const packs = useAsync(getRulePacks, []);
  const tables = useAsync(getRuleTables, []);

  const activePack = packs.data?.find((pack) => pack.status === 'Active');

  const handleCreate = async () => {
    setCreating(true);
    const created = await createRulePackVersion(newVersion);
    packs.setData((current) => [...current, created]);
    setCreating(false);
    setCreateOpen(false);
    notify(`${created.name} ${created.version} created as draft.`);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testRulePack(activePack.id);
    setTesting(false);
    setTestResult(result);
  };

  const packColumns = [
    { key: 'name', header: 'Rule Pack', render: (row) => <strong>{row.name}</strong> },
    { key: 'version', header: 'Version' },
    { key: 'effectiveFrom', header: 'Effective From', render: (row) => (row.effectiveFrom.includes('-') ? formatDate(row.effectiveFrom) : row.effectiveFrom) },
    { key: 'rules', header: 'Rules' },
    { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
    { key: 'actions', header: 'Actions', align: 'right', render: () => <Button variant="ghost" size="sm" icon={BookOpen} onClick={() => setTab('FDP Limits')}>View</Button> },
  ];

  const tableConfig = ruleTableConfig[tab];

  return (
    <div className="page">
      <PageHeader title="FDTL Configuration" subtitle="Rule packs and limit configuration" breadcrumbs={['FDTL', 'Configuration']} />
      <Alert tone="info" title="Prototype rules">{PROTOTYPE_DISCLAIMER}</Alert>

      <Card padded={false}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="card__body">
          {tab === 'Rule Pack' &&
            (packs.loading ? (
              <LoadingState />
            ) : (
              <div className="stack">
                <div className="rule-pack-hero">
                  <span className="rule-pack-hero__icon"><ShieldCheck size={26} /></span>
                  <div className="rule-pack-hero__body">
                    <p className="muted">Current Rule Pack</p>
                    <h2>{activePack.name}</h2>
                    <DetailList
                      columns={4}
                      items={[
                        { label: 'Version', value: activePack.version },
                        { label: 'Effective From', value: formatDate(activePack.effectiveFrom) },
                        { label: 'Approved By', value: activePack.approvedBy },
                        { label: 'Status', value: <Badge>{activePack.status === 'Active' ? 'ACTIVE' : activePack.status}</Badge> },
                      ]}
                    />
                  </div>
                  <div className="rule-pack-hero__actions">
                    <Button variant="secondary" icon={BookOpen} onClick={() => setTab('FDP Limits')}>View Rules</Button>
                    <Button variant="secondary" icon={CopyPlus} onClick={() => setCreateOpen(true)}>Create New Version</Button>
                    <Button icon={FlaskConical} loading={testing} onClick={handleTest}>Test Rule Pack</Button>
                  </div>
                </div>

                {testResult && (
                  <Alert tone={testResult.violation ? 'warning' : 'success'} title={`Test completed — ${testResult.scenarios} crew/flight scenarios evaluated`}>
                    {testResult.eligible} eligible · {testResult.warning} warning · {testResult.violation} violation (sample day 22 Sep 2026)
                  </Alert>
                )}

                <h3 className="section-title">Available Rule Packs</h3>
                <Table columns={packColumns} rows={packs.data} compact />
              </div>
            ))}

          {tableConfig &&
            (tables.loading ? (
              <LoadingState />
            ) : (
              <div className="stack">
                <p className="muted">{tableConfig.description} · {activePack?.name} {activePack?.version}</p>
                <Table
                  columns={tableConfig.columns}
                  rows={tables.data[tableConfig.source].map((row, index) => ({ ...row, limitKey: `${row.period}-${row.crew}-${index}` }))}
                  rowKey={tableConfig.rowKey}
                  compact
                />
              </div>
            ))}
        </div>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Rule Pack Version"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate}>Create Draft</Button>
          </>
        }
      >
        <div className="form-grid">
          <Select label="Base Rule Pack" name="name" value={newVersion.name} onChange={(event) => setNewVersion({ ...newVersion, name: event.target.value })} options={['NSOP India', 'Internal Training']} />
          <Input label="Version" name="version" value={newVersion.version} onChange={(event) => setNewVersion({ ...newVersion, version: event.target.value })} />
          <Input label="Effective From" name="effectiveFrom" type="date" value={newVersion.effectiveFrom} onChange={(event) => setNewVersion({ ...newVersion, effectiveFrom: event.target.value })} />
        </div>
        <p className="muted">The new version is created as a Draft copy of the selected pack and must be approved before activation.</p>
      </Modal>
    </div>
  );
}
