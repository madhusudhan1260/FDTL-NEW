import { useState } from 'react';
import { FileText, FileSpreadsheet, Download, FilePlus2 } from 'lucide-react';
import { Alert, Badge, Button, Card, DatePicker, ErrorState, PageHeader, Select, Table } from '../components/common';
import useAsync from '../hooks/useAsync';
import { getReports, generateReport } from '../services/reportService';
import { getCrew } from '../services/crewService';
import { reportTypes, reportFormats } from '../data/reportData';
import { formatDateDMY } from '../utils/time';
import { useToast } from '../context/ToastContext';

const initialForm = { type: 'Crew FDTL Report', from: '2026-09-01', to: '2026-09-30', crew: 'All', format: 'PDF' };

export default function ReportsPage() {
  const { notify } = useToast();
  const [form, setForm] = useState(initialForm);
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [formError, setFormError] = useState('');
  const reports = useAsync(getReports, []);
  const crew = useAsync(() => getCrew(), []);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (form.from > form.to) {
      setFormError('"From" date must be before "To" date.');
      return;
    }
    setFormError('');
    setGenerating(true);
    const report = await generateReport(form);
    setGenerating(false);
    setLastGenerated(report);
    reports.setData((current) => [report, ...(current ?? []).filter((item) => item.id !== report.id)]);
    notify(`${report.name} generated.`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <span className="cell-with-icon">
          {row.format === 'PDF' ? <FileText size={16} className="text-danger" /> : <FileSpreadsheet size={16} className="text-success" />}
          <strong>{row.name}</strong>
        </span>
      ),
    },
    { key: 'range', header: 'Date Range', render: (row) => `${formatDateDMY(row.from)} → ${formatDateDMY(row.to)}` },
    { key: 'crew', header: 'Crew' },
    { key: 'generatedOn', header: 'Generated On' },
    { key: 'format', header: 'Format', render: (row) => <Badge tone="neutral" dot={false}>{row.format}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button variant="ghost" size="sm" icon={Download} onClick={() => notify(`Downloading ${row.name} (${row.format}) — simulated in prototype.`, 'info')}>
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="page">
      <PageHeader title="Reports" subtitle="Generate FDTL compliance reports" breadcrumbs={['MADDY AVIATION', 'Reports']} />

      <Card title="Generate Report">
        <form className="report-form" onSubmit={handleGenerate}>
          <Select label="Report Type" name="type" value={form.type} onChange={update('type')} options={reportTypes} />
          <DatePicker label="From" name="from" value={form.from} onChange={update('from')} />
          <DatePicker label="To" name="to" value={form.to} onChange={update('to')} />
          <Select label="Crew" name="crew" value={form.crew} onChange={update('crew')} options={['All', ...(crew.data ?? []).map((member) => member.name)]} />
          <Select label="Format" name="format" value={form.format} onChange={update('format')} options={reportFormats} />
          <div className="report-form__action">
            <Button type="submit" icon={FilePlus2} loading={generating}>
              {generating ? 'Generating…' : 'Generate Report'}
            </Button>
          </div>
        </form>
        {formError && <Alert tone="danger" title={formError} />}
        {lastGenerated && !generating && (
          <Alert
            tone="success"
            title={`${lastGenerated.name} is ready`}
            action={<Button size="sm" variant="secondary" icon={Download} onClick={() => notify('Download simulated in prototype.', 'info')}>Download</Button>}
          >
            {formatDateDMY(lastGenerated.from)} → {formatDateDMY(lastGenerated.to)} · {lastGenerated.crew} · {lastGenerated.format} · {lastGenerated.size}
          </Alert>
        )}
      </Card>

      <Card title="Recent Reports" padded={false}>
        {reports.error ? <ErrorState message="Unable to load reports." onRetry={reports.reload} /> : <Table columns={columns} rows={reports.data} loading={reports.loading} emptyTitle="No reports generated yet" />}
      </Card>
    </div>
  );
}
