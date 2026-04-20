<template>
  <q-page class="result-page" dir="rtl">
    <div class="result-body">
      <!-- Score Circle -->
      <div class="score-circle" :class="passed ? 'circle--pass' : 'circle--fail'">
        <q-icon :name="passed ? 'emoji_events' : 'sentiment_dissatisfied'" size="40px" color="white" />
        <div class="score-num">{{ score }}</div>
        <div class="score-total">/ {{ total }}</div>
      </div>

      <div class="result-title">{{ passed ? '🎉 تهانينا! اجتزت الامتحان' : 'حاول مرة أخرى' }}</div>
      <div class="result-sub">{{ passed ? 'أداء ممتاز، استمر!' : `كنت تحتاج ${passScore} للنجاح` }}</div>

      <div class="result-card">
        <div class="result-row">
          <span>درجتك</span>
          <strong :class="passed ? 'text-positive' : 'text-negative'">{{ score }} / {{ total }}</strong>
        </div>
        <div class="result-row">
          <span>درجة النجاح</span>
          <strong>{{ passScore }}</strong>
        </div>
        <div class="result-row">
          <span>النتيجة</span>
          <strong :class="passed ? 'text-positive' : 'text-negative'">{{ passed ? 'ناجح ✓' : 'راسب ✗' }}</strong>
        </div>
      </div>

      <q-btn unelevated rounded color="primary" label="العودة للامتحانات"
        class="full-width back-btn" @click="$router.push('/exams')" />
      <q-btn flat rounded color="primary" label="الصفحة الرئيسية"
        class="full-width" @click="$router.push('/')" />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const score = Number(route.query.score || 0)
const total = Number(route.query.total || 100)
const passed = route.query.passed === 'true'
const passScore = Number(route.query.pass || 0)
</script>

<style scoped>
.result-page { background: #f0f4f8; min-height: 100vh; }
.result-body { display: flex; flex-direction: column; align-items: center; padding: 60px 20px 40px; gap: 14px; }
.score-circle { width: 130px; height: 130px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 28px rgba(0,0,0,0.15); }
.circle--pass { background: linear-gradient(135deg, #059669, #10b981); }
.circle--fail { background: linear-gradient(135deg, #b91c1c, #ef4444); }
.score-num { font-size: 30px; font-weight: 900; color: white; line-height: 1; }
.score-total { font-size: 14px; color: rgba(255,255,255,0.75); }
.result-title { font-size: 22px; font-weight: 900; color: #1e293b; text-align: center; }
.result-sub { font-size: 13px; color: #64748b; text-align: center; }
.result-card { background: white; border-radius: 18px; padding: 16px; width: 100%; max-width: 360px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.result-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 14px; color: #334155; font-weight: 600; }
.result-row:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
.text-positive { color: #059669; }
.text-negative { color: #dc2626; }
.back-btn { font-weight: 800; padding: 12px !important; }
</style>
