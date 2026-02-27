interface QuizInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  maxLength: number;
  minLength?: number;
}

export function QuizInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: QuizInputProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border-2 border-quiz-border bg-card text-foreground placeholder:text-muted-foreground font-medium text-sm focus:outline-none focus:border-quiz-selected transition-colors"
        maxLength={maxLength}
      />
      <p className="text-xs text-muted-foreground mt-1.5 text-right">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
