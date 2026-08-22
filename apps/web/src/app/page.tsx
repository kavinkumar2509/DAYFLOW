import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold mx-auto shadow-lg shadow-indigo-500/20">
          D
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            DAYFLOW HRMS
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Streamlined Employee & HR Operations Portal
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs text-slate-500">
            Single entry point for Employees, HR Managers, and Admins.
          </p>
          <Link href="/login" className="block">
            <Button size="lg" className="w-full">
              Proceed to Login
            </Button>
          </Link>
        </div>

        <div className="flex justify-center gap-6 text-xs text-slate-400">
          <span>• Attendance Tracking</span>
          <span>• Leave Approvals</span>
          <span>• Payroll Management</span>
        </div>
      </div>
    </main>
  );
}
