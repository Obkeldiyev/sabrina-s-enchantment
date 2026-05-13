import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/items")({
  component: () => (
    <ResourceManager
      title="Section Items"
      resource="items"
      fields={[
        { name: "sectionId", type: "number", required: true, placeholder: "Parent section ID" },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        { name: "body", type: "textarea" },
        { name: "label", type: "text", placeholder: "for METRICS" },
        { name: "value", type: "text", placeholder: "for METRICS" },
        { name: "unit", type: "text" },
        { name: "icon", type: "text", placeholder: "emoji or symbol" },
        { name: "href", type: "text" },
        { name: "variant", type: "text", placeholder: "primary, secondary" },
        { name: "imageId", type: "number" },
        { name: "config", type: "json" },
        { name: "sortOrder", type: "number" },
        { name: "isVisible", type: "switch" },
      ]}
    />
  ),
});
