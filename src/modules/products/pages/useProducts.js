import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useAuthStore } from '@/modules/auth/store'
import { PERMISSIONS } from '@/utils/permissions'
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../service'
import { listCategories } from '@/modules/categories/service'

export const useProducts = () => {
  const authStore = useAuthStore()
  const canManage = computed(() => authStore.hasPermission(PERMISSIONS.PRODUCTS_MANAGE))

  const loading = ref(false)
  const saving = ref(false)
  const products = ref([])
  const categories = ref([])
  const total = ref(0)
  const categoryFilter = ref(undefined)
  const search = ref('')
  const pagination = reactive({
    current: 1,
    pageSize: 10,
  })

  const modalVisible = ref(false)
  const editingProduct = ref(null)
  const formState = reactive({
    name: '',
    description: '',
    price: null,
    stock: 0,
    category_id: undefined,
  })

  const isEditing = computed(() => !!editingProduct.value)

  const categoryOptions = computed(() =>
    categories.value.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }))
  )

  const columns = computed(() => {
    const base = [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Category', dataIndex: 'category', key: 'category', width: 140 },
      { title: 'Price', dataIndex: 'price', key: 'price', width: 100 },
      { title: 'Stock', dataIndex: 'stock', key: 'stock', width: 80 },
    ]

    if (canManage.value) {
      base.push({ title: 'Actions', key: 'actions', width: 140 })
    }

    return base
  })

  const fetchCategories = async () => {
    const response = await listCategories({ page: 1, per_page: 100 })
    if (response.success) {
      categories.value = response.data || []
    }
  }

  const fetchProducts = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.current,
        per_page: pagination.pageSize,
        search: search.value?.trim() || undefined,
      }

      if (categoryFilter.value) {
        params.category_id = categoryFilter.value
      }

      const response = await listProducts(params)

      if (!response.success) {
        message.error(response.message)
        return
      }

      products.value = response.data || []
      total.value = response.meta?.total || 0
    } finally {
      loading.value = false
    }
  }

  const handleTableChange = (pag) => {
    pagination.current = pag.current
    pagination.pageSize = pag.pageSize
    fetchProducts()
  }

  const handleFilterChange = () => {
    pagination.current = 1
    fetchProducts()
  }

  const handleSearch = () => {
    pagination.current = 1
    fetchProducts()
  }

  const resetForm = () => {
    formState.name = ''
    formState.description = ''
    formState.price = null
    formState.stock = 0
    formState.category_id = categories.value[0]?.id
    editingProduct.value = null
  }

  const openCreateModal = () => {
    resetForm()
    modalVisible.value = true
  }

  const openEditModal = (record) => {
    editingProduct.value = record
    formState.name = record.name
    formState.description = record.description || ''
    formState.price = record.price
    formState.stock = record.stock
    formState.category_id = record.category_id
    modalVisible.value = true
  }

  const handleSave = async () => {
    if (!formState.name?.trim()) {
      message.warning('Product name is required.')
      return
    }
    if (!formState.category_id) {
      message.warning('Category is required.')
      return
    }
    if (!formState.price || formState.price <= 0) {
      message.warning('Price must be greater than 0.')
      return
    }

    saving.value = true
    try {
      const payload = {
        name: formState.name.trim(),
        description: formState.description?.trim() || '',
        price: Number(formState.price),
        stock: Number(formState.stock) || 0,
        category_id: formState.category_id,
      }

      const response = isEditing.value
        ? await updateProduct(editingProduct.value.id, payload)
        : await createProduct(payload)

      if (!response.success) {
        message.error(response.message)
        return
      }

      message.success(isEditing.value ? 'Product updated.' : 'Product created.')
      modalVisible.value = false
      resetForm()
      fetchProducts()
    } finally {
      saving.value = false
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete product?',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const response = await deleteProduct(record.id)
        if (!response.success) {
          message.error(response.message)
          return
        }
        message.success('Product deleted.')
        fetchProducts()
      },
    })
  }

  const formatPrice = (value) => {
    if (value == null) return '-'
    return `$${Number(value).toFixed(2)}`
  }

  const getCategoryName = (record) => {
    if (record.category?.name) return record.category.name
    const cat = categories.value.find((c) => c.id === record.category_id)
    return cat?.name || '-'
  }

  onMounted(async () => {
    await fetchCategories()
    fetchProducts()
  })

  return {
    canManage,
    loading,
    saving,
    products,
    total,
    categoryFilter,
    categoryOptions,
    search,
    pagination,
    modalVisible,
    formState,
    isEditing,
    columns,
    handleTableChange,
    handleFilterChange,
    handleSearch,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    formatPrice,
    getCategoryName,
  }
}
