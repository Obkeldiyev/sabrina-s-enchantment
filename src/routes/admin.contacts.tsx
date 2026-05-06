import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/contacts")({
  component: () => (
    <ResourceManager
      title="Contact Submissions"
      resource="contacts"
      fields={[
        { name: "name", type: "text" },
        { name: "email", type: "text" },
        { name: "message", type: "textarea" },
        {
          name: "status",
          type: "select",
          options: ["NEW", "READ", "ARCHIVED"].map((v) => ({ value: v, label: v })),
        },
      ]}
    />
  ),
});
