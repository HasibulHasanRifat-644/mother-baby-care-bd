import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  Target, 
  Calculator, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Search, 
  Printer, 
  Sparkles,
  Heart,
  PiggyBank,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { BabySavingsAccount, SavingsGoal, SavingsTransaction } from '../../types/savings';
import { BabyProfile, Language } from '../../types/vaccine';
import { formatFriendlyDate, toBengaliNumerals } from '../../utils/dateCalculations';

interface SavingsDashboardProps {
  currentBaby: BabyProfile;
  account: BabySavingsAccount;
  language: Language;
  onOpenDepositModal: () => void;
  onOpenWithdrawModal: () => void;
  onOpenGoalModal: () => void;
  onOpenCalculatorModal: () => void;
  onDeleteTransaction: (txId: string) => void;
}

export const SavingsDashboard: React.FC<SavingsDashboardProps> = ({
  currentBaby,
  account,
  language,
  onOpenDepositModal,
  onOpenWithdrawModal,
  onOpenGoalModal,
  onOpenCalculatorModal,
  onDeleteTransaction,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [searchTx, setSearchTx] = useState('');

  const savingsHeroImage = '/src/assets/images/baby_savings_bank_1792749301691.jpg';

  // Calculate totals
  const { currentBalance, totalDeposits, totalWithdrawals } = useMemo(() => {
    let dep = 0;
    let wit = 0;
    account.transactions.forEach(t => {
      if (t.type === 'deposit') dep += t.amount;
      else if (t.type === 'withdrawal') wit += t.amount;
    });
    return {
      currentBalance: Math.max(0, dep - wit),
      totalDeposits: dep,
      totalWithdrawals: wit,
    };
  }, [account.transactions]);

  // Goal allocated amounts
  const goalStats = useMemo(() => {
    const map: Record<string, number> = {};
    account.goals.forEach(g => { map[g.id] = 0; });

    account.transactions.forEach(t => {
      if (t.goalId && map[t.goalId] !== undefined) {
        if (t.type === 'deposit') map[t.goalId] += t.amount;
        else if (t.type === 'withdrawal') map[t.goalId] = Math.max(0, map[t.goalId] - t.amount);
      }
    });

    return map;
  }, [account.goals, account.transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return account.transactions
      .filter(t => {
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (searchTx.trim()) {
          const q = searchTx.toLowerCase().trim();
          const noteMatch = (t.note || '').toLowerCase().includes(q);
          const contribMatch = (t.contributorName || '').toLowerCase().includes(q);
          const methodMatch = t.paymentMethod.toLowerCase().includes(q);
          return noteMatch || contribMatch || methodMatch;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [account.transactions, filterType, searchTx]);

  const methodLabels: Record<string, { labelBn: string; labelEn: string; color: string }> = {
    bkash: { labelBn: 'বিকাশ (bKash)', labelEn: 'bKash', color: 'text-pink-600 bg-pink-50' },
    nagad: { labelBn: 'নগদ (Nagad)', labelEn: 'Nagad', color: 'text-orange-600 bg-orange-50' },
    rocket: { labelBn: 'রকেট (Rocket)', labelEn: 'Rocket', color: 'text-purple-600 bg-purple-50' },
    bank: { labelBn: 'ব্যাংক হিসাব', labelEn: 'Bank Transfer', color: 'text-blue-600 bg-blue-50' },
    cash_piggybank: { labelBn: 'মাটির ব্যাংক / ক্যাশ', labelEn: 'Cash / Piggybank', color: 'text-emerald-700 bg-emerald-50' },
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Strip: Mother & Baby Savings Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl overflow-hidden shadow-md text-white border border-teal-700/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text & Key Numbers */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-semibold border border-teal-600/50">
                <PiggyBank className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'মায়ের সঞ্চয় ও সোনামণির ভবিষ্যৎ ফান্ড' : "Mother's Savings & Baby Future Fund"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {language === 'bn' ? `${currentBaby.name}-এর নিজস্ব ডিজিটাল ব্যাংক` : `${currentBaby.name}'s Digital Savings`}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'প্রতিদিনের ছোট ছোট সঞ্চয়, ঈদের সালামি ও উপহারের টাকা জমিয়ে গড়ে তুলুন সন্তানের শিক্ষা, চিকিৎসা ও নিরাপদ জীবনের মজবুত ভিত্তি।'
                  : "Build an empowering financial safety net for your child's education, medical emergency, and bright milestones."}
              </p>
            </div>

            {/* Total Balance Card */}
            <div className="bg-teal-950/60 border border-teal-600/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-teal-300 uppercase tracking-wider font-semibold">
                  {language === 'bn' ? 'মোট জমাকৃত ব্যালেন্স' : 'Total Saved Balance'}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight mt-0.5">
                  ৳{language === 'bn' ? toBengaliNumerals(currentBalance.toLocaleString()) : currentBalance.toLocaleString()}
                </div>
                <span className="text-[11px] text-teal-200/80 font-mono">
                  {language === 'bn' ? 'অ্যাকাউন্ট নং:' : 'Account #:'} {account.accountNumber}
                </span>
              </div>

              {/* Action Buttons inside hero */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenDepositModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>{language === 'bn' ? 'টাকা জমা করুন' : 'Deposit Money'}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenWithdrawModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm border border-teal-600/60 transition-all"
                >
                  <MinusCircle className="w-4 h-4 text-teal-200" />
                  <span>{language === 'bn' ? 'জরুরি খরচ' : 'Expense'}</span>
                </button>
              </div>
            </div>

            {/* Micro stats strip */}
            <div className="grid grid-cols-3 gap-3 text-xs text-teal-200 pt-1">
              <div className="bg-teal-950/40 p-2.5 rounded-xl border border-teal-800/40">
                <span className="block text-[11px] text-teal-400">{language === 'bn' ? 'সর্বমোট জমা' : 'Total Deposits'}</span>
                <span className="font-bold text-emerald-300 font-mono text-sm">
                  +৳{language === 'bn' ? toBengaliNumerals(totalDeposits.toLocaleString()) : totalDeposits.toLocaleString()}
                </span>
              </div>
              <div className="bg-teal-950/40 p-2.5 rounded-xl border border-teal-800/40">
                <span className="block text-[11px] text-teal-400">{language === 'bn' ? 'জরুরি প্রয়োজনে খরচ' : 'Withdrawn'}</span>
                <span className="font-bold text-rose-300 font-mono text-sm">
                  -৳{language === 'bn' ? toBengaliNumerals(totalWithdrawals.toLocaleString()) : totalWithdrawals.toLocaleString()}
                </span>
              </div>
              <div className="bg-teal-950/40 p-2.5 rounded-xl border border-teal-800/40">
                <span className="block text-[11px] text-teal-400">{language === 'bn' ? 'সক্রিয় সঞ্চয় লক্ষ্য' : 'Active Goals'}</span>
                <span className="font-bold text-white font-mono text-sm">
                  {language === 'bn' ? `${toBengaliNumerals(account.goals.length)}টি লক্ষ্য` : `${account.goals.length} Goals`}
                </span>
              </div>
            </div>

          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 h-full p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-teal-600/50 max-w-sm w-full group">
              <img
                src={savingsHeroImage}
                alt="Mother and baby saving money in piggy bank"
                className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্রতিদিনের ভালোবাসার ক্ষুদ্র সঞ্চয়' : 'Daily Mother\'s Care'}</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  {language === 'bn' ? 'ছোট ছোট ফোঁটায় যেমন সাগর গড়ে, তেমনি মায়ের ক্ষুদ্র সঞ্চয়ে গড়ে শিশুর ভবিষ্যৎ।' : 'Small constant steps create great horizons.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Target Goals Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? '🎯 সোনামণির সঞ্চয় লক্ষ্যসমূহ (Savings Goals)' : 'Target Savings Goals'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'চিকিৎসা, পড়াশোনা বা জন্মদিনের মতো নির্দিষ্ট লক্ষ্যের অগ্রগতি ট্র্যাক করুন।' : 'Track progress toward specific milestone funds.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCalculatorModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all"
            >
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>{language === 'bn' ? 'ডিপিএস ক্যালকুলেটর' : 'DPS Calculator'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenGoalModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-all"
            >
              <Target className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন লক্ষ্য যোগ' : 'Add Goal'}</span>
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {account.goals.map((goal) => {
            const savedInGoal = goalStats[goal.id] || 0;
            const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((savedInGoal / goal.targetAmount) * 100)) : 0;
            const isFinished = progress >= 100;

            const categoryIcons: Record<string, string> = {
              medical: '🏥',
              education: '🎓',
              birthday: '🎂',
              gold: '🪙',
              emergency: '🛡️',
              general: '🌱',
            };

            return (
              <div
                key={goal.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{categoryIcons[goal.category] || '🎯'}</span>
                    {isFinished && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{language === 'bn' ? 'অর্জিত!' : 'Completed!'}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {language === 'bn' ? goal.titleBn : goal.title}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {language === 'bn' ? 'লক্ষ্য:' : 'Target:'} ৳{language === 'bn' ? toBengaliNumerals(goal.targetAmount.toLocaleString()) : goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-600">
                        ৳{language === 'bn' ? toBengaliNumerals(savedInGoal.toLocaleString()) : savedInGoal.toLocaleString()}
                      </span>
                      <span className="font-mono text-teal-700 font-bold">
                        {language === 'bn' ? `${toBengaliNumerals(progress)}%` : `${progress}%`}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFinished ? 'bg-emerald-500' : 'bg-teal-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {goal.targetDate ? formatFriendlyDate(goal.targetDate, language) : ''}
                  </span>
                  <button
                    type="button"
                    onClick={onOpenDepositModal}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    {language === 'bn' ? '+ জমা করুন' : '+ Deposit'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions & Bank Passbook Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Passbook Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'সঞ্চয় হিসাব বিবরণী (Bank Statement / Passbook)' : 'Savings Ledger & Statement'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn' ? 'সকল জমা ও জরুরি খরচের নির্ভুল ইতিহাস।' : 'Complete timeline of deposits, gifts, and emergency healthcare expenses.'}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'সব' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('deposit')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'deposit' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'জমা (+)' : 'Deposits'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('withdrawal')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'withdrawal' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'উত্তোলন (-)' : 'Expenses'}
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTx ?? ''}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder={language === 'bn' ? 'বিবরণ বা নাম খুঁজুন...' : 'Search statement...'}
                className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'ধরন' : 'Type'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'বিবরণ ও বার্তা' : 'Description / Note'}</th>
                <th className="py-2.5 px-3">{language === 'bn' ? 'কে দিয়েছেন / মাধ্যম' : 'Saved By / Method'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</th>
                <th className="py-2.5 px-2 text-center no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isDeposit = tx.type === 'deposit';
                const methodInfo = methodLabels[tx.paymentMethod] || {
                  labelBn: tx.paymentMethod,
                  labelEn: tx.paymentMethod,
                  color: 'text-slate-700 bg-slate-100',
                };

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                      {formatFriendlyDate(tx.date, language)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isDeposit ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'জমা' : 'Deposit'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'উত্তোলন' : 'Expense'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-800">
                      <div className="font-semibold">{tx.note || (isDeposit ? 'সঞ্চয় জমা' : 'জরুরি খরচ')}</div>
                      {tx.goalId && (
                        <div className="text-[10px] text-teal-700">
                          🎯 {account.goals.find(g => g.id === tx.goalId)?.titleBn || ''}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap space-y-0.5">
                      <div className="font-medium text-slate-700">{tx.contributorName || 'অভিভাবক'}</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${methodInfo.color}`}>
                        {language === 'bn' ? methodInfo.labelBn : methodInfo.labelEn}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap text-sm">
                      <span className={isDeposit ? 'text-emerald-700' : 'text-rose-700'}>
                        {isDeposit ? '+' : '-'}৳{language === 'bn' ? toBengaliNumerals(tx.amount.toLocaleString()) : tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center no-print whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(language === 'bn' ? 'আপনি কি এই লেনদেন মুছে ফেলতে চান?' : 'Delete transaction?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 rounded text-slate-300 hover:text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              {language === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি।' : 'No transactions recorded yet.'}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
