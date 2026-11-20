interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { num: 1, label: 'Skills' },
  { num: 2, label: 'Roles' },
  { num: 3, label: 'Companies' },
  { num: 4, label: 'Classes' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="no-print mx-auto flex max-w-2xl items-center justify-center gap-1 sm:gap-2">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:text-base ${
                step.num <= currentStep
                  ? 'bg-navy-800 text-white shadow-lg'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-[10px] font-medium sm:text-xs ${
                step.num <= currentStep ? 'text-navy-700' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`mx-1 h-0.5 w-4 rounded-full transition-all duration-300 sm:mx-2 sm:w-8 ${
                step.num < currentStep ? 'bg-teal-500' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
