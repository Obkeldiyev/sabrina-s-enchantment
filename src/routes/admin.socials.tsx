import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/socials")({
  component: () => (
    <ResourceManager
      title="Social Links"
      resource="socials"
      fields={[
        { name: "platform", type: "text", required: true },
        { name: "label", type: "text" },
        { name: "url", type: "text", required: true },
        { name: "sortOrder", type: "number" },
        { name: "isVisible", type: "switch" },
      ]}
    />
  ),
});
