import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useAuthStore } from '@/modules/auth/store'
import { PERMISSIONS } from '@/utils/permissions'
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  suggestCategoryName,
} from '../service'

export const useCategories = () => {
  const authStore = useAuthStore()
  const canManage = computed(() => authStore.hasPermission(PERMISSIONS.CATEGORIES_MANAGE))

  const loading = ref(false)
  const saving = ref(false)
  const suggesting = ref(false)
  const categories = ref([])
  const total = ref(0)
  const search = ref('')
  const pagination = reactive({
    current: 1,
    pageSize: 10,
  })

  const modalVisible = ref(false)
  const editingCategory = ref(null)
  const formState = reactive({
    name: '',
    description: '',
    keywords: '',
  })

  const isEditing = computed(() => !!editingCategory.value)

  const columns = computed(() => {
    const base = [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
      { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
      { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
      { title: 'Created', dataIndex: 'created_at', key: 'created_at', width: 180 },
    ]

    if (canManage.value) {
      base.push({ title: 'Actions', key: 'actions', width: 140 })
    }

    return base
  })

  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await listCategories({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: search.value?.trim() || undefined,
      })

      if (!response.success) {
        message.error(response.message)
        return
      }

      categories.value = response.data || []
      total.value = response.meta?.total || 0
    } finally {
      loading.value = false
    }
  }

  const handleTableChange = (pag) => {
    pagination.current = pag.current
    pagination.pageSize = pag.pageSize
    fetchCategories()
  }

  const handleSearch = () => {
    pagination.current = 1
    fetchCategories()
  }

  const resetForm = () => {
    formState.name = ''
    formState.description = ''
    formState.keywords = ''
    editingCategory.value = null
  }

  const openCreateModal = () => {
    resetForm()
    modalVisible.value = true
  }

  const openEditModal = (record) => {
    editingCategory.value = record
    formState.name = record.name
    formState.description = record.description || ''
    formState.keywords = ''
    modalVisible.value = true
  }

  const handleSave = async () => {
    if (!formState.name?.trim()) {
      message.warning('Category name is required.')
      return
    }

    saving.value = true
    try {
      const payload = {
        name: formState.name.trim(),
        description: formState.description?.trim() || '',
      }

      const response = isEditing.value
        ? await updateCategory(editingCategory.value.id, payload)
        : await createCategory(payload)

      if (!response.success) {
        message.error(response.message)
        return
      }

      message.success(isEditing.value ? 'Category updated.' : 'Category created.')
      modalVisible.value = false
      resetForm()
      fetchCategories()
    } finally {
      saving.value = false
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete category?',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const response = await deleteCategory(record.id)
        if (!response.success) {
          message.error(response.message)
          return
        }
        message.success('Category deleted.')
        fetchCategories()
      },
    })
  }

  const handleSuggestName = async () => {
    if (!formState.keywords?.trim()) {
      message.warning('Enter keywords to suggest a name.')
      return
    }

    suggesting.value = true
    try {
      const response = await suggestCategoryName(formState.keywords.trim())
      if (!response.success) {
        message.error(response.message)
        return
      }

      if (response.data?.name) {
        formState.name = response.data.name
        message.success('Name suggested.')
      }
    } finally {
      suggesting.value = false
    }
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  onMounted(fetchCategories)

  return {
    canManage,
    loading,
    saving,
    suggesting,
    categories,
    total,
    search,
    pagination,
    modalVisible,
    formState,
    isEditing,
    columns,
    handleTableChange,
    handleSearch,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    handleSuggestName,
    formatDate,
  }
}
