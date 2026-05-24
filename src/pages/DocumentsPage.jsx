import { useRef, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { can } from '../utils/permissions.js';
import { formatDate } from '../utils/formatters.js';

const allowedTypes = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOC',
  'image/png': 'Image',
  'image/jpeg': 'Image',
};

const statusTone = {
  Approved: 'success',
  'Under Review': 'info',
  Pending: 'warning',
};

export default function DocumentsPage() {
  const { currentUser, documents, setDocuments, addActivity } = useApp();
  const fileInputRef = useRef(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const canUpload = can(currentUser, 'upload_document');
  const canPreview = can(currentUser, 'preview_document');
  const canDownload = can(currentUser, 'download_document');

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = allowedTypes[file.type];
    if (!type) {
      window.alert('Only PDF, DOC, and image files are supported in this prototype.');
      return;
    }

    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-3)}`,
      name: file.name,
      type,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    setDocuments((items) => [newDoc, ...items]);
    addActivity(`Document uploaded: ${file.name}`, currentUser.role);
    event.target.value = '';
  };

  const downloadDoc = (doc) => {
    const blob = new Blob([`Mock file content for ${doc.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Records"
        title="Document Center"
        description="Upload, review, and manage MAC meeting documents"
        actions={
          canUpload ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md bg-adrde-navy px-4 py-2 text-sm font-semibold text-white hover:bg-adrde-blue"
              >
                Upload Document
              </button>
            </>
          ) : null
        }
      />

      <div className="surface overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Upload Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{doc.name}</td>
                <td className="px-4 py-3">{doc.type}</td>
                <td className="px-4 py-3">{formatDate(doc.uploadDate)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[doc.status] || 'neutral'}>{doc.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    {canPreview && (
                      <button
                        type="button"
                        className="text-adrde-blue hover:underline"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        Preview
                      </button>
                    )}
                    {canDownload && (
                      <button
                        type="button"
                        className="text-adrde-blue hover:underline"
                        onClick={() => downloadDoc(doc)}
                      >
                        Download
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(previewDoc)} title="Document Preview" onClose={() => setPreviewDoc(null)}>
        {previewDoc && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">File:</span> {previewDoc.name}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {previewDoc.type}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {previewDoc.status}
            </p>
            <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950">
              Mock preview panel — connect backend storage for real file rendering.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
