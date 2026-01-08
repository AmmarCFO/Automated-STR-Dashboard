
import React, { useState, useMemo, useRef } from 'react';
import Header_ar from './components/Header_ar';
import { Section } from './components/DashboardComponents';
import { FadeInUp } from './components/AnimatedWrappers';
import { motion } from 'framer-motion';
import { STRPerformanceData, STRUnit } from './types';
import { SearchIcon, ChartBarIcon, UploadIcon, LightBulbIcon } from './components/Icons';

const formatCurrency = (value: number) => {
    return `${Math.round(value).toLocaleString('ar-SA')} ريال`;
};

// --- LOGIC: AI Insight Generator (Arabic) ---
const generateAIInsights = (unit: STRUnit) => {
    const suggestions = [];
    const variance = unit.actualRevenue - unit.forecastedRevenue;
    const isBehind = variance < 0;
    const gapAmount = Math.abs(variance);
    
    if (isBehind) {
        suggestions.push({
            type: 'observation',
            text: `تحليل: الإيرادات أقل من المستهدف بـ ${formatCurrency(gapAmount)}. نسبة الإشغال ${unit.occupancyRate}٪.`
        });
    } else {
        suggestions.push({
            type: 'success',
            text: `تحليل: أداء ممتاز. الإيرادات أعلى من المستهدف بـ ${formatCurrency(variance)} مع نسبة إشغال ${unit.occupancyRate}٪.`
        });
    }

    if (unit.daysRemaining === 0) {
         if (isBehind) {
            suggestions.push({
                type: 'warning',
                text: "إجراء: راجع استراتيجية الشهر الماضي. فكر في تقليل الحد الأدنى للإقامة للفترة القادمة."
            });
         } else {
            suggestions.push({
                type: 'info',
                text: "إجراء: الاستراتيجية ناجحة. حلل تقييمات المستأجرين للحفاظ على التصنيف المرتفع."
            });
         }
    } else if (isBehind) {
        const dailyGap = gapAmount / unit.daysRemaining;
        if (unit.daysRemaining <= 10) {
             suggestions.push({
                type: 'urgent',
                text: `إجراء: عاجل. تحتاج حوالي ${Math.round(dailyGap)} ريال/يوم. خفض الأسعار بنسبة ١٥٪ فوراً.`
            });
        } else {
            suggestions.push({
                type: 'strategy',
                text: "إجراء: وتيرة الحجز بطيئة. فعل 'الحجز الفوري' وعدل أسعار عطلة نهاية الأسبوع."
            });
        }
    } else {
        if (unit.occupancyRate > 90) {
             suggestions.push({
                type: 'opportunity',
                text: "إجراء: طلب مرتفع. ارفع الأسعار بنسبة ١٠-١٥٪ للأيام المتبقية لتعظيم الربح."
            });
        } else {
             suggestions.push({
                type: 'info',
                text: "إجراء: الأداء مستقر. حافظ على الأسعار الحالية وراقب المنافسين."
            });
        }
    }
    return suggestions;
};

// --- COMPONENT: Unit Performance Card (Arabic Lighter Design) ---
const UnitPerformanceCard: React.FC<{ unit: STRUnit }> = ({ unit }) => {
    const variance = unit.actualRevenue - unit.forecastedRevenue;
    const isPositive = variance >= 0;
    const percentAchieved = Math.min(100, Math.round((unit.actualRevenue / unit.forecastedRevenue) * 100));
    const getBuildingName = (name: string) => name.replace('Mathwaa', 'مثوى');
    const getRateLabel = (label: string) => {
        if (label.includes('Negotiation 1')) return 'سعر التفاوض ١';
        if (label.includes('Negotiation 2')) return 'سعر التفاوض ٢';
        if (label.includes('Negotiation 3')) return 'سعر التفاوض ٣';
        return label;
    }
    const insights = useMemo(() => generateAIInsights(unit), [unit]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#1c1c1e] rounded-[2rem] p-8 border border-white/5 shadow-2xl hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:border-white/10 transition-all duration-500 overflow-hidden text-right"
        >
            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                        <span className="text-white/30 font-black text-xl">#</span>
                    </div>
                    <div>
                        <h4 className="text-4xl font-bold text-white tracking-tight">{unit.unitNumber}</h4>
                        <p className="text-sm font-medium text-white/40 mt-1">{getBuildingName(unit.buildingName)}</p>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-full border ${
                    unit.occupancyRate >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    unit.occupancyRate >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                    <span className="text-xs font-bold uppercase tracking-widest">{unit.occupancyRate}% إشغال</span>
                </div>
            </div>

            {/* Progress Bar (Neon) */}
            <div className="mb-10">
                <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    <span>تقدم الإيرادات</span>
                    <span>{percentAchieved}% من الهدف</span>
                </div>
                <div className="h-4 w-full bg-[#121214] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-white/5 relative">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentAchieved}%` }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                        className={`absolute right-0 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] ${
                            isPositive 
                            ? 'bg-gradient-to-l from-emerald-500 to-cyan-400' 
                            : 'bg-gradient-to-l from-rose-500 to-pink-500'
                        }`}
                    />
                </div>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-[#232326] rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">المستهدف</p>
                    <p className="text-2xl font-bold text-white/70 tabular-nums">{formatCurrency(unit.forecastedRevenue)}</p>
                </div>
                <div className="bg-[#232326] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-[0.08] ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">الفعلي</p>
                    <p className="text-3xl font-bold text-white tabular-nums relative z-10">{formatCurrency(unit.actualRevenue)}</p>
                </div>
            </div>

            {/* Strategic Insights (Lighter & Brighter) */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
                 <div className="absolute inset-0 bg-gradient-to-bl from-[#302b20] to-[#1e1e20]"></div>
                 
                 <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-lg bg-gradient-to-b from-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                            <LightBulbIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-[0.15em]">رؤى استراتيجية</span>
                    </div>
                    <div className="space-y-3">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className={`w-1 h-full min-h-[1.5rem] rounded-full mt-1 ${
                                    insight.type === 'urgent' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 
                                    insight.type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                                    'bg-indigo-500 shadow-[0_0_10px_#6366f1]'
                                }`}></div>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed">{insight.text}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Benchmarks */}
            <div className="border-t border-white/5 pt-6">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">معايير الإيجار</p>
                <div className="space-y-3">
                    {unit.negotiatedRates?.map((rate, idx) => {
                         const isAchieved = unit.actualRevenue >= rate.price;
                         return (
                            <div key={idx} className="flex justify-between items-center text-sm opacity-70 hover:opacity-100 transition-opacity">
                                <span className="font-medium text-gray-400">{getRateLabel(rate.label)}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-200 tabular-nums">{formatCurrency(rate.price)}</span>
                                    <div className={`w-2 h-2 rounded-full ${isAchieved ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`}></div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: Summary Card ---
const SummaryCard: React.FC<{ title: string; value: string; trend?: string; trendPositive?: boolean }> = ({ title, value, trend, trendPositive }) => (
    <div className="bg-[#1c1c1e] p-8 rounded-[2rem] border border-white/5 shadow-xl relative group overflow-hidden transition-transform hover:-translate-y-1 text-right">
        <div className="relative z-10">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{title}</p>
            <p className="text-4xl lg:text-5xl font-bold text-white tracking-tighter mb-4">{value}</p>
            {trend && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    trendPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                    {trend}
                </div>
            )}
        </div>
        <div className={`absolute -left-12 -bottom-12 w-48 h-48 rounded-full opacity-[0.1] blur-3xl group-hover:opacity-[0.2] transition-opacity duration-500 ${trendPositive ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
    </div>
);

interface AppProps {
    onToggleLanguage: () => void;
    data: STRPerformanceData;
}

const App_ar: React.FC<AppProps> = ({ onToggleLanguage, data: initialData }) => {
  const [data, setData] = useState<STRPerformanceData>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => processAirbnbCSV(event.target?.result as string);
    reader.readAsText(file);
  };

  const processAirbnbCSV = (csvText: string) => {
      const rows = csvText.split(/\r?\n/);
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(rows.length, 20); i++) {
          if (rows[i].includes('Listing title') || rows[i].includes('Listing ID')) {
              headerRowIndex = i;
              break;
          }
      }
      if (headerRowIndex === -1) {
          alert('تعذر العثور على الصف الرأسي. يرجى التحقق من ملف CSV.');
          return;
      }
      const parseCSVRow = (row: string) => {
          const result = [];
          let current = '';
          let inQuote = false;
          for (let i = 0; i < row.length; i++) {
              const char = row[i];
              if (char === '"') inQuote = !inQuote;
              else if (char === ',' && !inQuote) {
                  result.push(current.trim().replace(/^"|"$/g, ''));
                  current = '';
              } else current += char;
          }
          result.push(current.trim().replace(/^"|"$/g, ''));
          return result;
      };
      const headers = parseCSVRow(rows[headerRowIndex]);
      const listingIndex = headers.findIndex(h => h.includes('Listing title') || h.includes('Listing ID'));
      const earningsIndex = headers.findIndex(h => h.includes('Booking value') || h.includes('Earnings') || h.includes('Amount'));
      const nightsIndex = headers.findIndex(h => h.includes('Nights booked') || h.includes('Nights'));
      
      if (listingIndex === -1 || earningsIndex === -1) {
          alert('الأعمدة المطلوبة مفقودة.');
          return;
      }
      const newData = { ...data };
      const newUnits = [...newData.units];
      const unitMap = new Map<string, { revenue: number, bookedNights: number }>();
      for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (!row) continue;
          const cols = parseCSVRow(row);
          if (!cols[listingIndex]) continue;
          const listingName = cols[listingIndex];
          const earnings = parseFloat((cols[earningsIndex] || '0').replace(/[^0-9.-]+/g, ''));
          const nights = parseFloat((cols[nightsIndex] || '0').replace(/[^0-9.]/g, ''));
          
          // DYNAMIC MATCHING (ARABIC)
          const matchedUnit = newUnits.find(u => listingName.includes(u.unitNumber));
          
          if (matchedUnit) {
              const unitNum = matchedUnit.unitNumber;
              const current = unitMap.get(unitNum) || { revenue: 0, bookedNights: 0 };
              unitMap.set(unitNum, {
                  revenue: current.revenue + earnings,
                  bookedNights: current.bookedNights + nights
              });
          }
      }
      newData.units = newUnits.map(unit => {
          const updates = unitMap.get(unit.unitNumber);
          if (updates) {
              const newOccupancy = Math.min(100, Math.round((updates.bookedNights / 31) * 100));
              return { ...unit, actualRevenue: updates.revenue, occupancyRate: newOccupancy, status: newOccupancy > 0 ? 'Occupied' : 'Vacant', comments: '' };
          }
          return unit;
      });
      setData(newData);
      alert('تم تحديث البيانات بنجاح!');
  };

  const totals = useMemo(() => {
      return data.units.reduce((acc, unit) => ({
          actual: acc.actual + unit.actualRevenue,
          forecast: acc.forecast + unit.forecastedRevenue,
          variance: acc.variance + (unit.actualRevenue - unit.forecastedRevenue)
      }), { actual: 0, forecast: 0, variance: 0 });
  }, [data]);

  const filteredUnits = useMemo(() => {
      return data.units.filter(u => 
          u.unitNumber.includes(searchQuery) || 
          u.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, searchQuery]);

  const totalPerformancePercent = Math.round((totals.actual / totals.forecast) * 100);
  const isOverallPositive = totals.variance >= 0;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#E4E4E7] font-cairo selection:bg-indigo-500/30 selection:text-white relative overflow-hidden" dir="rtl">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <Header_ar onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 relative z-10">
        
        <FadeInUp>
          <div className="text-center pt-20 pb-16">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md mb-8"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">تقرير {data.period.replace('January', 'يناير').replace('2026', '٢٠٢٦')}</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-8xl font-bold text-white tracking-tighter mb-6 leading-[0.9]">
              أداء <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-white to-purple-400">التأجير قصير الأجل</span>
            </h1>
            
            <div className="flex justify-center mt-10">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 active:scale-95 shadow-sm"
                >
                    <UploadIcon className="w-4 h-4" />
                    <span>رفع ملف Airbnb</span>
                </button>
            </div>
          </div>
        </FadeInUp>

        <Section title="نظرة عامة على المحفظة" className="!mt-0 !pt-0" titleColor="text-white/90">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                <SummaryCard 
                    title="الإيرادات الفعلية" 
                    value={formatCurrency(totals.actual)}
                    trend={`${totalPerformancePercent}٪ من المستهدف`}
                    trendPositive={isOverallPositive}
                />
                <SummaryCard 
                    title="الإيرادات المستهدفة" 
                    value={formatCurrency(totals.forecast)}
                />
                <SummaryCard 
                    title="صافي الفرق" 
                    value={`${isOverallPositive ? '+' : ''}${formatCurrency(totals.variance)}`}
                    trend={isOverallPositive ? 'أعلى من المستهدف' : 'أقل من المستهدف'}
                    trendPositive={isOverallPositive}
                />
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <ChartBarIcon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">تفاصيل الوحدات</h3>
                    </div>
                    
                    <div className="relative w-full sm:w-72 group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-4 w-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pr-11 pl-4 py-3 bg-[#1c1c1e] border border-white/5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                            placeholder="بحث برقم الوحدة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="space-y-6">
                    {filteredUnits.length > 0 ? (
                        filteredUnits.map((unit) => (
                            <UnitPerformanceCard key={unit.id} unit={unit} />
                        ))
                    ) : (
                        <div className="text-center py-24 bg-[#1c1c1e] rounded-[2rem] border border-dashed border-white/5">
                            <p className="text-white/30 font-medium">لا توجد وحدات مطابقة للبحث.</p>
                        </div>
                    )}
                </div>
            </div>
        </Section>
      </main>

      <footer className="py-16 text-center border-t border-white/5 bg-[#09090b] relative z-10">
         <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2 font-cairo">
            إدارة أملاك مثوى
         </p>
         <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest font-cairo">
            تقرير سري • تم الإنشاء ٢٠٢٦
         </p>
      </footer>
    </div>
  );
};

export default App_ar;
