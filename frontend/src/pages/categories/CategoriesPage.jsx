import CategoryForm from '@/components/forms/CategoryForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/api/useCategories';
import { useToastStore } from '@/store/toastStore';
import { AlertCircle, Edit2, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoriesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const { success, error } = useToastStore();

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      success('Category created successfully!');
      setIsCreateModalOpen(false);
      console.log(categories);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: selectedCategory._id, ...data });
      success('Category updated successfully!');
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(selectedCategory._id);
      success('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-primary-600" />
          Categories
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first category</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5" />
              Create Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Category"
        size="md"
      >
        <CategoryForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        size="md"
      >
        {selectedCategory && (
          <CategoryForm
            onSubmit={handleEdit}
            initialData={selectedCategory}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete this category?
              </p>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          {selectedCategory && (
            <p className="text-gray-700">
              Category: <strong>{selectedCategory.name}</strong>
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;

