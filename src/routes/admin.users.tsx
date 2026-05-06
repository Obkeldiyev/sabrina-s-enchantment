import { createFileRoute } from "@tanstack/react-router";
import ResourceManager from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <ResourceManager
      title="Admin Users"
      resource="users"
      fields={[
        { name: "name", type: "text", required: true },
        { name: "email", type: "text", required: true },
        { name: "password", type: "password", placeholder: "leave blank when editing" },
        {
          name: "role",
          type: "select",
          options: ["ADMIN", "EDITOR"].map((v) => ({ value: v, label: v })),
        },
        { name: "isActive", type: "switch" },
      ]}
    />
  ),
});
