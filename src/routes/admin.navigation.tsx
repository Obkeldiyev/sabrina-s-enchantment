import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/navigation")({
  component: () => (
    <ResourceManager
      title="Navigation"
      resource="navigation"
      fields={[
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true, placeholder: "#about or /about" },
        { name: "sortOrder", type: "number" },
        { name: "isVisible", type: "switch" },
      ]}
    />
  ),
});
