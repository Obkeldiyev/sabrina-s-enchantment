import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <ResourceManager
      title="Site Settings"
      resource="settings"
      fields={[
        { name: "key", type: "text", required: true },
        { name: "value", type: "json", required: true },
      ]}
    />
  ),
});
