import CronExpressionChecker from "@/components/CronExpressionChecker";
import CronExpressionBuilder from "@/components/CronExpressionBuilder";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Cron式ツール
                </h1>
                <div className="space-y-8">
                    <CronExpressionChecker/>
                    <hr className="border-zinc-200 dark:border-zinc-700"/>
                    <CronExpressionBuilder/>
                </div>
            </main>
        </div>
    );
}
