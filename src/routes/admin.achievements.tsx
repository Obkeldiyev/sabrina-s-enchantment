import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/achievements")({
  component: () => (
    <ResourceManager
      title="Achievements"
      resource="achievements"
      multipart
      imageField="image"
      fields={[
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "year", type: "text" },
        { name: "imageAlt", type: "text" },
        { name: "externalUrl", type: "text" },
        { name: "image", type: "image", label: "Image upload" },
        { name: "sortOrder", type: "number" },
        { name: "isVisible", type: "switch" },
      ]}
    />
  ),
});
