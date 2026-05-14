import { createCategorySchema } from "@/validations/categoryValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

export default function CategoryForm({ onSubmit, initialData, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData || {
      name: "",
      type: "project",
      description: "",
    },
  });

  const typeOptions = [
    { value: "project", label: "Project" },
    { value: "task", label: "Task" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Category Name"
        icon={Tag}
        error={errors.name?.message}
        {...register("name")}
        placeholder="e.g., Development, Marketing"
      />

      <Textarea
        label="Description (Optional)"
        error={errors.description?.message}
        {...register("description")}
        placeholder="Brief description of this category"
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
