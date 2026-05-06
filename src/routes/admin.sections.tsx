import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/sections")({
  component: () => (
    <ResourceManager
      title="Page Sections"
      resource="sections"
      fields={[
        { name: "key", type: "text", required: true, placeholder: "hero, about, technology…" },
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            "HERO", "CARD_GRID", "FEATURE_GRID", "METRICS", "SHOWCASE", "ACHIEVEMENTS", "CONTACT", "FOOTER",
          ].map((v) => ({ value: v, label: v })),
        },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        { name: "body", type: "textarea" },
        { name: "imageId", type: "number", placeholder: "MediaAsset id" },
        { name: "config", type: "json" },
        { name: "sortOrder", type: "number" },
        { name: "isVisible", type: "switch" },
      ]}
    />
  ),
});
