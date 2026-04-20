<template>
  <q-page class="qb-page" dir="rtl">
    <div class="page-header safe-top glass">
      <q-btn flat round icon="arrow_forward" color="dark" @click="$router.back()" />
      <div class="header-title">بنوك الأسئلة</div>
      <div style="width: 40px"></div>
    </div>

    <!-- Loading -->
    <div v-if="qbStore.loading" class="q-pa-md q-gutter-md">
      <q-skeleton type="rect" height="120px" class="rounded-borders" v-for="i in 3" :key="i" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!qbStore.banks.length" class="empty-state">
      <q-icon name="inventory_2" size="64px" color="grey-4" />
      <div class="empty-text">لا توجد بنوك أسئلة متاحة حالياً</div>
    </div>

    <!-- Banks List -->
    <div v-else class="content-container">
      <div v-for="bank in qbStore.banks" :key="bank.id" class="bank-card" @click="openBank(bank.id)">
        <div class="bank-icon">
          <q-icon name="quiz" size="32px" color="white" />
        </div>
        <div class="bank-info">
          <div class="bank-title">{{ bank.title }}</div>
          <div class="bank-desc" v-if="bank.description">{{ bank.description }}</div>
          <div class="bank-meta">
            <q-chip dense color="blue-1" text-color="blue-8" icon="format_list_numbered" size="sm">
              {{ bank._count?.questions || 0 }} سؤال
            </q-chip>
          </div>
        </div>
        <div class="bank-action">
          <q-btn flat round icon="play_arrow" color="primary" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentQuestionBanksStore } from 'src/stores/student'

const router = useRouter()
const qbStore = useStudentQuestionBanksStore()

onMounted(() => {
  qbStore.fetchBanks()
})

const openBank = (id) => {
  router.push(`/question-banks/${id}`)
}
</script>

<style scoped>
.qb-page { background: #f8fafc; min-height: 100vh; padding-bottom: 90px; }

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

.content-container { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }

.bank-card {
  display: flex; align-items: center; gap: 14px; padding: 16px;
  background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent;
}
.bank-card:active { transform: scale(0.98); border-color: #3b82f6; }

.bank-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(59,130,246,0.3);
}

.bank-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.bank-title { font-size: 16px; font-weight: 800; color: #1e293b; }
.bank-desc { font-size: 12px; color: #64748b; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bank-meta { display: flex; align-items: center; margin-top: 4px; }

.bank-action { flex-shrink: 0; }
</style>
