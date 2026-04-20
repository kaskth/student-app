<template>
  <q-page class="materials-page" dir="rtl">
    <!-- Header -->
    <div class="page-header safe-top glass">
      <q-btn flat round icon="arrow_forward" color="dark" @click="$router.back()" />
      <div class="header-title">الملازم والملفات</div>
      <div style="width: 40px"></div>
    </div>

    <!-- Loading -->
    <div v-if="materialsStore.loading" class="q-pa-md q-gutter-md">
      <q-skeleton type="rect" height="100px" class="rounded-borders" v-for="i in 3" :key="i" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!materialsStore.categories.length" class="empty-state">
      <q-icon name="folder_off" size="64px" color="grey-4" />
      <div class="empty-text">لا توجد ملفات أو ملازم متاحة حالياً</div>
    </div>

    <!-- Content -->
    <div v-else class="content-container">
      <q-list class="categories-list">
        <q-expansion-item
          v-for="(cat, index) in materialsStore.categories"
          :key="cat.id"
          class="category-item"
          :default-opened="index === 0"
          expand-separator
          header-class="cat-header"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="blue-1" text-color="blue-8" icon="folder_open" />
            </q-item-section>
            <q-item-section>
              <div class="cat-title">{{ cat.title }}</div>
              <div class="cat-desc" v-if="cat.description">{{ cat.description }}</div>
            </q-item-section>
            <q-item-section side>
              <q-badge color="blue-8" rounded :label="cat.files.length" />
            </q-item-section>
          </template>

          <q-card class="cat-body">
            <q-card-section class="q-pa-sm">
              <div class="files-grid">
                <div v-for="file in cat.files" :key="file.id" class="file-card" @click="handleFileClick(file)">
                  <div class="file-icon-box" :class="file.isDownloadable ? 'bg-teal-1' : 'bg-orange-1'">
                    <q-icon :name="file.isDownloadable ? 'download' : 'visibility'" size="24px" :color="file.isDownloadable ? 'teal' : 'orange-8'" />
                  </div>
                  <div class="file-info">
                    <div class="file-title">{{ file.title }}</div>
                    <div class="file-meta">
                      <span>{{ formatSize(file.sizeBytes) }}</span>
                      <span v-if="file.access === 'locked'" class="text-negative">
                        <q-icon name="lock" size="12px" /> مقفل
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStudentMaterialsStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const materialsStore = useStudentMaterialsStore()
const $q = useQuasar()

onMounted(() => {
  materialsStore.fetchMaterials()
})

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleFileClick = (file) => {
  if (file.access === 'locked') {
    $q.notify({
      message: 'هذا الملف مقفل. تأكد من إتمام المتطلبات.',
      color: 'warning', position: 'top', icon: 'lock'
    })
    return
  }

  // File viewing/download logic
  // Typically the fileUrl is a local path like '/uploads/materials/xyz.pdf'
  // Or it could be a full URL.
  let url = file.fileUrl
  if (url && !url.startsWith('http')) {
    url = `http://${window.location.hostname}:3000${url}`
  }

  if (file.isDownloadable) {
    const a = document.createElement('a')
    a.href = url
    a.download = file.title
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {
    // View only (open in new tab)
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.materials-page { background: #f8fafc; min-height: 100vh; padding-bottom: 90px; }

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; margin-bottom: 16px; 
  border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}
.header-title { font-size: 18px; font-weight: 800; color: #1e293b; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
.empty-text { margin-top: 16px; font-size: 16px; color: #64748b; font-weight: 600; }

.content-container { padding: 0 16px; }
.categories-list { background: transparent; }

.category-item { background: white; border-radius: 16px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
.cat-header { padding: 12px 16px; font-weight: 700; color: #1e293b; }
.cat-title { font-size: 15px; font-weight: 800; color: #1e293b; }
.cat-desc { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px; }

.cat-body { background: #f8fafc; }

.files-grid { display: flex; flex-direction: column; gap: 8px; }
.file-card { 
  display: flex; align-items: center; gap: 12px; padding: 12px; 
  background: white; border-radius: 12px; border: 1px solid #e2e8f0; 
  cursor: pointer; transition: all 0.2s;
}
.file-card:active { transform: scale(0.98); }
.file-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.file-info { flex: 1; min-width: 0; }
.file-title { font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta { font-size: 12px; color: #94a3b8; display: flex; gap: 8px; font-weight: 600; }
</style>
