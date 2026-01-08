
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SensitivityMatrixProps {
  lang: 'en' | 'ar';
  scenarioId?: string;
}

const DATA_CONFIG: any = {
  study_a: {
      views: {
          apartments: {
              values: [
                  // Conservative: 69,360
                  [69360, 62424, 55488, 48552, 41616],
                  // Realistic: 77,700
                  [77700, 69930, 62160, 54390, 46620],
                  // Optimistic: 86,028
                  [86028, 77425, 68822, 60220, 51617]
              ],
              en: {
                  label: 'Apartments (Per Unit)',
                  unitIds: 'All Units (1BR & 2BR)',
                  scenarios: [
                      { name: 'Conservative', price: 'SAR 69,360 /yr' },
                      { name: 'Realistic', price: 'SAR 77,700 /yr' },
                      { name: 'Optimistic', price: 'SAR 86,028 /yr' }
                  ]
              },
              ar: {
                  label: 'الشقق (للوحدة)',
                  unitIds: 'جميع الوحدات (غرفة وغرفتين)',
                  scenarios: [
                      { name: 'متحفظ', price: '٦٩,٣٦٠ ريال/سنة' },
                      { name: 'واقعي', price: '٧٧,٧٠٠ ريال/سنة' },
                      { name: 'متفائل', price: '٨٦,٠٢٨ ريال/سنة' }
                  ]
              }
          }
      },
      en: {
          title: 'Revenue Sensitivity Matrix',
          subtitle: 'Annual revenue analysis per unit based on occupancy rates & pricing strategies.',
      },
      ar: {
          title: 'مصفوفة حساسية الإيرادات',
          subtitle: 'تحليل الإيرادات السنوية للوحدة بناءً على معدلات الإشغال واستراتيجيات التسعير.',
      }
  },
  study_b: {
    views: {
        unit4br: {
            values: [
                // 4BR Unit: 2 Master + 2 Single
                // Cons: (2*3200 + 2*2900)*12 = 146,400
                [146400, 131760, 117120, 102480, 87840],
                // Real: (2*3500 + 2*2900)*12 = 153,600
                [153600, 138240, 122880, 107520, 92160],
                // Opt: (2*3900 + 2*2900)*12 = 163,200
                [163200, 146880, 130560, 114240, 97920]
            ],
            en: {
                label: '4BR Townhouse (Per Unit)',
                unitIds: 'Units: D1, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15',
                scenarios: [
                    { name: 'Conservative', price: '2 Master + 2 Single' },
                    { name: 'Realistic', price: '2 Master + 2 Single' },
                    { name: 'Optimistic', price: '2 Master + 2 Single' }
                ]
            },
            ar: {
                label: 'تاون هاوس ٤ غرف (للوحدة)',
                unitIds: 'الوحدات: D1, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15',
                scenarios: [
                    { name: 'متحفظ', price: '٢ ماستر + ٢ مفردة' },
                    { name: 'واقعي', price: '٢ ماستر + ٢ مفردة' },
                    { name: 'متفائل', price: '٢ ماستر + ٢ مفردة' }
                ]
            }
        },
        unit3br: {
            values: [
                // 3BR Unit: 3 Master
                // Cons: (3*3200)*12 = 115,200
                [115200, 103680, 92160, 80640, 69120],
                // Real: (3*3500)*12 = 126,000
                [126000, 113400, 100800, 88200, 75600],
                // Opt: (3*3900)*12 = 140,400
                [140400, 126360, 112320, 98280, 84240]
            ],
            en: {
                label: '3BR Townhouse (Per Unit)',
                unitIds: 'Units: D2, D3, D4',
                scenarios: [
                    { name: 'Conservative', price: '3 Master Rooms' },
                    { name: 'Realistic', price: '3 Master Rooms' },
                    { name: 'Optimistic', price: '3 Master Rooms' }
                ]
            },
            ar: {
                label: 'تاون هاوس ٣ غرف (للوحدة)',
                unitIds: 'الوحدات: D2, D3, D4',
                scenarios: [
                    { name: 'متحفظ', price: '٣ غرف ماستر' },
                    { name: 'واقعي', price: '٣ غرف ماستر' },
                    { name: 'متفائل', price: '٣ غرف ماستر' }
                ]
            }
        }
    },
    en: {
        title: 'Revenue Sensitivity Matrix',
        subtitle: 'Annual revenue analysis per unit type based on occupancy rates & pricing strategies.',
    },
    ar: {
        title: 'مصفوفة حساسية الإيرادات',
        subtitle: 'تحليل الإيرادات السنوية لكل نوع وحدة بناءً على معدلات الإشغال واستراتيجيات التسعير.',
    }
  }
};

const COMMON_LABELS = {
    en: {
        occupancyLabel: 'Occupancy Rate',
        currency: 'SAR',
        low: 'Low Impact',
        high: 'High Impact'
    },
    ar: {
        occupancyLabel: 'معدل الإشغال',
        currency: 'ريال',
        low: 'أثر منخفض',
        high: 'أثر مرتفع'
    }
}

const OCCUPANCY_COLS = [100, 90, 80, 70, 60];

const SensitivityMatrix: React.FC<SensitivityMatrixProps> = ({ lang, scenarioId }) => {
  const isRTL = lang === 'ar';
  
  // Default to study_a if scenarioId is missing, fallback to study_b if study_a missing (safety)
  const currentScenarioId = scenarioId && DATA_CONFIG[scenarioId] ? scenarioId : 'study_a';
  const config = DATA_CONFIG[currentScenarioId];
  
  const viewOptions = Object.keys(config.views);
  const [activeView, setActiveView] = useState<string>(viewOptions[0]);

  // Reset active view when scenario changes to avoid stale keys
  useEffect(() => {
      setActiveView(Object.keys(config.views)[0]);
  }, [currentScenarioId]);

  // Safety check if activeView is valid for current config
  const currentViewData = config.views[activeView] || config.views[viewOptions[0]];
  const t = { ...COMMON_LABELS[lang], ...config[lang] };
  
  const viewScenarios = currentViewData[lang].scenarios;
  const values = currentViewData.values;
  const locale = isRTL ? 'ar-SA' : 'en-US';

  // Determine glow color based on scenario
  const glowColor = currentScenarioId === 'study_b' ? 'bg-[#C98B8B]/10' : 'bg-[#2A5B64]/10';
  const accentColor = currentScenarioId === 'study_b' ? '#C98B8B' : '#2A5B64';
  const barGradientFrom = currentScenarioId === 'study_b' ? 'from-[#C98B8B]/30' : 'from-[#2A5B64]/30';
  const barGradientTo = currentScenarioId === 'study_b' ? 'to-[#C98B8B]' : 'to-[#2A5B64]';
  const badgeClass = currentScenarioId === 'study_b' 
    ? 'text-[#C98B8B] bg-[#C98B8B]/10 border-[#C98B8B]/20' 
    : 'text-[#2A5B64] bg-[#2A5B64]/10 border-[#2A5B64]/20';
  const cellBg = currentScenarioId === 'study_b' ? 'bg-[#C98B8B]' : 'bg-[#2A5B64]';

  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-6xl mx-auto ${isRTL ? 'font-cairo' : 'font-sans'}`} 
        dir={isRTL ? 'rtl' : 'ltr'}
    >
        {/* Dark Glass Card */}
        <div className="bg-[#09090b] rounded-[32px] sm:rounded-[48px] shadow-2xl border border-white/10 overflow-hidden relative">
             {/* Noise Texture */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
             
             {/* Ambient Glow */}
             <div className={`absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] ${glowColor} rounded-full blur-[100px] pointer-events-none mix-blend-screen`}></div>

             <div className="relative z-10 p-6 sm:p-14">
                
                {/* Header Section */}
                <div className="flex flex-col gap-8 mb-10 border-b border-white/5 pb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="text-center sm:text-left rtl:sm:text-right">
                            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                                {t.title}
                            </h3>
                            <p className="text-sm sm:text-lg leading-relaxed text-white/50 max-w-2xl font-medium">
                                {t.subtitle}
                            </p>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-4 bg-white/5 rounded-full px-6 py-3 border border-white/5 whitespace-nowrap self-center sm:self-auto backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: accentColor }}></div>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.low}</span>
                            </div>
                            <div className={`w-12 h-[2px] bg-gradient-to-r ${barGradientFrom} ${barGradientTo} rounded-full`}></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: accentColor, color: accentColor }}></div>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.high}</span>
                            </div>
                        </div>
                    </div>

                    {/* View Selector Tabs (Only show if multiple views) */}
                    {viewOptions.length > 1 && (
                        <div className="flex flex-wrap gap-2 sm:gap-4 p-1.5 bg-white/5 rounded-2xl sm:rounded-full w-full sm:w-auto self-start backdrop-blur-sm">
                            {viewOptions.map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setActiveView(view)}
                                    className={`
                                        relative px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 sm:flex-none
                                        ${activeView === view ? 'text-[#09090b]' : 'text-white/60 hover:text-white'}
                                    `}
                                >
                                    {activeView === view && (
                                        <motion.div 
                                            layoutId="viewTab"
                                            className="absolute inset-0 bg-white rounded-xl sm:rounded-full shadow-lg"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{config.views[view][lang].label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                     <div className="min-w-[900px]">
                        {/* Column Headers */}
                        <div className="grid grid-cols-6 gap-6 mb-8 px-2">
                             <div className="col-span-1 flex items-end pb-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 pl-2">
                                    {t.occupancyLabel}
                                </span>
                             </div>
                             {OCCUPANCY_COLS.map((occ) => (
                                 <div key={occ} className="col-span-1 text-center">
                                     <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                                        <span className="text-sm font-bold text-white">
                                            {occ.toLocaleString(locale)}%
                                        </span>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* Rows */}
                        <motion.div 
                            key={activeView}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Unit Identifiers Badge */}
                            <div className="px-2 mb-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 backdrop-blur-md">
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {currentViewData[lang].unitIds}
                                    </span>
                                </div>
                            </div>

                            {viewScenarios.map((scenario: any, sIdx: number) => (
                                <div key={sIdx} className="grid grid-cols-6 gap-6 items-center p-3 rounded-[24px] hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
                                    {/* Row Header */}
                                    <div className="col-span-1 pr-4">
                                        <div className="text-[15px] sm:text-[17px] font-bold text-white mb-2 tracking-tight">{scenario.name}</div>
                                        <div className={`text-[10px] sm:text-[11px] font-semibold inline-block px-3 py-1 rounded-lg tracking-wide border whitespace-nowrap ${badgeClass}`}>
                                            {scenario.price}
                                        </div>
                                    </div>

                                    {/* Cells */}
                                    {values[sIdx].map((val: number, vIdx: number) => {
                                        // Intensity logic: relative to the max value in this specific view to ensure contrast
                                        // Find min/max for this dataset to normalize
                                        const allValues = values.flat();
                                        const minVal = Math.min(...allValues);
                                        const maxVal = Math.max(...allValues);
                                        
                                        const percent = (val - minVal) / (maxVal - minVal);
                                        // On dark bg, we want opacity to range from barely visible to vibrant
                                        const opacity = 0.15 + (percent * 0.65); 
                                        
                                        return (
                                            <motion.div 
                                                key={vIdx} 
                                                className="col-span-1 relative h-[5rem] rounded-2xl flex flex-col items-center justify-center cursor-default group/cell overflow-hidden shadow-sm"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                {/* Background Color Layer */}
                                                <div 
                                                    className={`absolute inset-0 ${cellBg} transition-all duration-300`}
                                                    style={{ opacity }}
                                                />
                                                
                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-300" />
                                                
                                                {/* Border */}
                                                <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover/cell:border-white/20 transition-colors duration-200" />

                                                {/* Content */}
                                                <div className="relative z-10 text-center">
                                                    <span className="block text-lg sm:text-xl font-bold text-white tabular-nums tracking-tight drop-shadow-md">
                                                        {val.toLocaleString(locale)}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-0.5 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 absolute left-0 right-0 -bottom-3 translate-y-2 group-hover/cell:translate-y-0">
                                                        {t.currency}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </motion.div>
                     </div>
                </div>

             </div>
        </div>
    </motion.div>
  );
};

export default SensitivityMatrix;
