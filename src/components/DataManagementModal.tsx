import React, { useRef, useState } from 'react';
import { JobOffer } from '../types/job';
import { exportToJSON, exportToCSV, importFromJSON, resetToDemoData, clearAllData } from '../utils/storage';
import { 
  X, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  FileSpreadsheet, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOffer[];
  onDataLoaded: (newJobs: JobOffer[]) => void;
  showToast: (msg: string) => void;
  onResetDemo?: () => Promise<void>;
  onClearAll?: () => Promise<void>;
  onImportJobs?: (jobs: JobOffer[]) => Promise<void>;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onDataLoaded,
  showToast,
  onResetDemo,
  onClearAll,
  onImportJobs
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    exportToJSON(jobs);
    showToast('Exported full JSON backup successfully');
  };

  const handleExportCSV = () => {
    exportToCSV(jobs);
    showToast('Exported CSV spreadsheet successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const loadedJobs = importFromJSON(content);
        if (onImportJobs) {
          await onImportJobs(loadedJobs);
        } else {
          onDataLoaded(loadedJobs);
        }
        setImportError(null);
        showToast(`Successfully imported ${loadedJobs.length} job offers to SQLite!`);
        onClose();
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset SQLite database to standard demo data? Any unsaved custom entries will be replaced.')) {
      if (onResetDemo) {
        await onResetDemo();
      } else {
        const demo = resetToDemoData();
        onDataLoaded(demo);
      }
      showToast('Loaded demo dataset successfully');
      onClose();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all job offers from the SQLite database? This action cannot be undone unless you have a backup.')) {
      if (onClearAll) {
        await onClearAll();
      } else {
        const empty = clearAllData();
        onDataLoaded(empty);
      }
      showToast('All job offers cleared');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Data Management & Backup</h2>
              <p className="text-xs text-slate-600">Export, import, or reset your local applications database</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {importError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{importError}</span>
            </div>
          )}

          {/* Export section */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Export & Backup
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 group-hover:text-indigo-600">JSON Backup</span>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  Full fidelity backup with recruiter contacts and interviews.
                </p>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 group-hover:text-emerald-700">CSV Sheet</span>
                  <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  Excel & Google Sheets compatible spreadsheet export.
                </p>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Import Data
            </h3>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-left flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-slate-800 block">Restore from JSON</span>
                <span className="text-[11px] text-slate-600">Select a previously exported .json file to restore</span>
              </div>
              <Upload className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          {/* Danger zone / Reset */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Maintenance
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDemo}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reload Demo Data</span>
              </button>

              <button
                onClick={handleClearAll}
                className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
