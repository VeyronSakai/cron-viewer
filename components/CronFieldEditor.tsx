"use client";

import {
    CronField,
    FieldConfig,
    FieldMode,
} from "@/lib/cron";

export default function CronFieldEditor({
                                            field,
                                            config,
                                            onChangeFieldAction,
                                        }: {
    field: CronField;
    config: FieldConfig;
    onChangeFieldAction: (config: FieldConfig) => void;
}) {
    // 各フィールドで共通利用する編集モードの定義。
    const modes: { value: FieldMode; label: string }[] = [
        {value: "every", label: `毎${field.label}`},
        {value: "interval", label: "間隔指定"},
        {value: "specific", label: "値を指定"},
        {value: "range", label: "範囲指定"},
    ];

    // 選択値をトグルし、specificValues に追加/削除した結果を親へ反映する。
    const toggleSpecific = (v: number) => {
        const vals = config.specificValues.includes(v)
            ? config.specificValues.filter((x) => x !== v)
            : [...config.specificValues, v];
        onChangeFieldAction({...config, specificValues: vals});
    };

    // 値が多いフィールド（分など）では列数を増やし、縦長になりすぎるのを防ぐ。
    const valueCount = field.max - field.min + 1;
    const gridColumnCount = valueCount > 12 ? 10 : valueCount > 7 ? 6 : Math.min(valueCount, 7);

    return (
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="mb-2 text-base font-bold">{field.label}</h3>
            <div className="mb-3 flex flex-wrap gap-2">
                {modes.map((m) => (
                    <button
                        key={m.value}
                        // モード切り替え時は、他プロパティを維持したまま mode だけ更新する。
                        onClick={() => onChangeFieldAction({...config, mode: m.value})}
                        className={`rounded-md px-3 py-1 text-sm transition-colors ${
                            config.mode === m.value
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                        }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {config.mode === "interval" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <label>開始:</label>
                    <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        value={config.intervalStart}
                        onChange={(e) => onChangeFieldAction({
                            ...config,
                            // 不正入力時は下限値へフォールバックする。
                            intervalStart: parseInt(e.target.value) || field.min
                        })}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    <label>ごとに:</label>
                    <input
                        type="number"
                        min={1}
                        max={field.max - field.min + 1}
                        value={config.intervalValue}
                        onChange={(e) => onChangeFieldAction({
                            ...config,
                            // 間隔は0にできないため、未入力時は1へ戻す。
                            intervalValue: parseInt(e.target.value) || 1
                        })}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    <span>{field.label}</span>
                </div>
            )}

            {config.mode === "specific" && (
                <div
                    className="grid gap-1"
                    style={{gridTemplateColumns: `repeat(${gridColumnCount}, minmax(0, 1fr))`}}
                >
                    {Array.from({length: valueCount}, (_, i) => field.min + i).map((v) => (
                        <button
                            key={v}
                            onClick={() => toggleSpecific(v)}
                            className={`rounded px-1 py-1 text-xs transition-colors ${
                                config.specificValues.includes(v)
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                            }`}
                        >
                            {field.names ? field.names[v - field.min] : v.toString().padStart(2, "0")}
                        </button>
                    ))}
                </div>
            )}

            {config.mode === "range" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        value={config.rangeStart}
                        onChange={(e) => onChangeFieldAction({
                            ...config,
                            // 不正入力時は開始値を最小値へ戻す。
                            rangeStart: parseInt(e.target.value) || field.min
                        })}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    <span>から</span>
                    <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        value={config.rangeEnd}
                        onChange={(e) => onChangeFieldAction({
                            ...config,
                            // 不正入力時は終了値を最大値へ戻す。
                            rangeEnd: parseInt(e.target.value) || field.max
                        })}
                        className="w-16 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    <span>まで</span>
                </div>
            )}
        </div>
    );
}
