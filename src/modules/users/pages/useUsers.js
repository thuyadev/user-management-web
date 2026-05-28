import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { listUsers, createUser, updateUser, deleteUser } from '../service'

export const useUsers = () => {
  const loading = ref(false)
  const saving = ref(false)
  const users = ref([])
  const total = ref(0)
  const search = ref('')
  const pagination = reactive({
    current: 1,
    pageSize: 10,
  })

  const modalVisible = ref(false)
  const editingUser = ref(null)
  const formState = reactive({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })

  const isEditing = computed(() => !!editingUser.value)

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', width: 100 },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', width: 180 },
    { title: 'Actions', key: 'actions', width: 140 },
  ]

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await listUsers({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: search.value || undefined,
      })

      if (!response.success) {
        message.error(response.message)
        return
      }

      users.value = response.data || []
      total.value = response.meta?.total || 0
    } finally {
      loading.value = false
    }
  }

  const handleTableChange = (pag) => {
    pagination.current = pag.current
    pagination.pageSize = pag.pageSize
    fetchUsers()
  }

  const handleSearch = () => {
    pagination.current = 1
    fetchUsers()
  }

  const resetForm = () => {
    formState.name = ''
    formState.email = ''
    formState.password = ''
    formState.role = 'user'
    editingUser.value = null
  }

  const openCreateModal = () => {
    resetForm()
    modalVisible.value = true
  }

  const openEditModal = (record) => {
    editingUser.value = record
    formState.name = record.name
    formState.email = record.email
    formState.password = ''
    formState.role = record.role
    modalVisible.value = true
  }

  const handleSave = async () => {
    if (!formState.name?.trim() || !formState.email?.trim()) {
      message.warning('Name and email are required.')
      return
    }

    if (!isEditing.value && !formState.password) {
      message.warning('Password is required for new users.')
      return
    }

    saving.value = true
    try {
      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        role: formState.role,
      }

      if (formState.password) {
        payload.password = formState.password
      }

      const response = isEditing.value
        ? await updateUser(editingUser.value.id, payload)
        : await createUser(payload)

      if (!response.success) {
        message.error(response.message)
        return
      }

      message.success(isEditing.value ? 'User updated.' : 'User created.')
      modalVisible.value = false
      resetForm()
      fetchUsers()
    } finally {
      saving.value = false
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete user?',
      content: `Are you sure you want to delete ${record.name}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const response = await deleteUser(record.id)
        if (!response.success) {
          message.error(response.message)
          return
        }
        message.success('User deleted.')
        fetchUsers()
      },
    })
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  onMounted(fetchUsers)

  return {
    loading,
    saving,
    users,
    total,
    search,
    pagination,
    modalVisible,
    formState,
    isEditing,
    columns,
    fetchUsers,
    handleTableChange,
    handleSearch,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    formatDate,
  }
}
