<template>
  <div class="auth-page">
    <div class="purple-banner">
      <h1>Inscription</h1>
      <p>Créez votre compte pour commencer à gérer vos decks</p>
    </div>

    <div class="form-container">
      <NCard class="auth-card">
        <NSpace vertical size="large">
          <h2 style="margin: 0">S'inscrire</h2>

          <NForm @submit.prevent="handleRegister">
            <NFormItem label="Nom d'utilisateur">
              <NInput
                v-model:value="form.username"
                placeholder="Pseudo (ex: Red)"
              />
            </NFormItem>

            <NFormItem label="Email">
              <NInput
                v-model:value="form.email"
                placeholder="votre@email.com"
              />
            </NFormItem>

            <NFormItem label="Mot de passe">
              <NInput
                v-model:value="form.password"
                type="password"
                placeholder="........"
                show-password-on="mousedown"
              />
            </NFormItem>

            <NButton
              type="primary"
              block
              attr-type="submit"
              color="#18a058"
              :loading="loading"
              :disabled="loading"
            >
              Créer mon compte
            </NButton>
          </NForm>

          <div style="text-align: center">
            Déjà un compte ?
            <RouterLink
              :to="ROUTES.LOGIN"
              style="color: #335eea; text-decoration: none"
            >
              Se connecter
            </RouterLink>
          </div>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../composables/useApi'
import { ROUTES } from '../router'
import { useAuthStore } from '../stores/auth'

const api = useApi()
const auth = useAuthStore()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const form = reactive({
  username: '',
  email: '',
  password: '',
})

const handleRegister = async () => {
  if (!form.username || !form.email || !form.password) {
    message.warning('Veuillez remplir tous les champs')
    return
  }

  loading.value = true
  try {
    const res = await api.signUp(form)
    auth.login(res) // RG1: Persistance
    message.success('Compte créé avec succès !')
    router.push(ROUTES.HOME) // RG4: Redirection vers accueil
  } catch (err: unknown) {
    // RG3: Message d'erreur en cas d'échec
    const e = err as Error
    message.error(e.message || "Erreur lors de l'inscription")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.purple-banner {
  background-color: #a020f0;
  color: white;
  padding: 40px 60px;
}

.purple-banner h1 {
  margin: 0;
  font-size: 24px;
}

.form-container {
  display: flex;
  justify-content: center;
  margin-top: -30px;
  padding: 0 20px;
}

.auth-card {
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
