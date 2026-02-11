"use client";

import {useState, useCallback} from "react";
import {
    CRON_FIELDS,
    FieldConfig,
    defaultFieldConfig,
    buildCronExpression,
    describeCron,
} from "@/lib/cron";
import CronFieldEditor from "@/components/CronFieldEditor";

export default function CronExpressionBuilder() {
    const [configs, setConfigs] = useState<FieldConfig[]>(
        CRON_FIELDS.map((f) => defaultFieldConfig(f))
    );
    const [copied, setCopied] = useState(false);
    const expression = buildCronExpression(configs);
    const description = describeCron(expression);

    const updateField = useCallback(
        (index: number, config: FieldConfig) => {
            setConfigs((prev) => {
                const next = [...prev];
                next[index] = config;
                return next;
            });
        },
        []
    );

    const handleReset = () => {
        setConfigs(CRON_FIELDS.map((f) => defaultFieldConfig(f)));
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(expression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold">Cron式作成</h2>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                    <code className="flex-1 font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                        {expression}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        {copied ? "コピー済み!" : "コピー"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                        リセット
                    </button>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>

            <div className="space-y-3">
                {CRON_FIELDS.map((field, i) => (
                    <CronFieldEditor
                        key={i}
                        field={field}
                        config={configs[i]}
                        onChangeField={(c) => updateField(i, c)}
                    />
                ))}
            </div>
        </section>
    );
}
