import { AuthProvider } from "@/contexts/auth-context";
import { KanbanBoardComponent } from "@/components/kanban-board";

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen p-8">
        <main>
          <KanbanBoardComponent />
        </main>
      </div>
    </AuthProvider>
  );
}
