  <template>
    <h1>ChessBreak</h1>
  <div class="auth">
    <div class="card">
      <div class="tabs">
        <button
          :class="['tab', { active: mode==='login' }]"
          @click="mode='login'"
          :disabled="loading"
        >Connexion</button>
        <button
          :class="['tab', { active: mode==='register' }]"
          @click="mode='register'"
          :disabled="loading"
        >Créer un compte</button>
      </div>

      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <label>Email</label>
          <input
            type="email"
            v-model.trim="email"
            placeholder="ton.email@exemple.com"
            :class="{ invalid: email && !emailValid }"
            autocomplete="email"
          />
          <small v-if="email && !emailValid" class="hint">Format d'email invalide.</small>
        </div>

        <div v-if="mode==='register'" class="field">
          <label>Nom complet</label>
          <input
            type="text"
            v-model.trim="fullName"
            placeholder="Nom Prénom"
            autocomplete="name"
          />
          <small v-if="fullName && fullName.length < 2" class="hint">Au moins 2 caractères.</small>
        </div>

        <div class="field">
          <label>Mot de passe</label>
          <div class="password-row">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button type="button" class="ghost" @click="showPassword = !showPassword">
              {{ showPassword ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
          <div class="strength">
            <div class="bar" :style="{ width: (passwordStrength*20) + '%' }"></div>
          </div>
          <small v-if="password" class="hint">Solidité : {{ passwordHint }}</small>
        </div>

        <div v-if="mode==='register'" class="field">
          <label>Confirmer le mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="confirm"
            placeholder="••••••••"
            autocomplete="new-password"
            :class="{ invalid: confirm && confirm !== password }"
          />
          <small v-if="confirm && confirm !== password" class="hint">Les mots de passe ne correspondent pas.</small>
        </div>

        <button class="primary" :disabled="!canSubmit">
          {{ loading ? 'Patiente...' : (mode==='login' ? 'Se connecter' : 'Créer le compte') }}
        </button>

        <p v-if="error" class="alert error">{{ error }}</p>
        <p v-if="message" class="alert success">{{ message }}</p>

        <p class="toggle" v-if="mode==='login'">
          Pas de compte ?
          <a href="" @click.prevent="mode='register'">Inscription</a>
        </p>
        <p class="toggle" v-else>
          Déjà inscrit·e ?
          <a href="" @click.prevent="mode='login'">Connexion</a>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>

import { ref, computed } from "vue";
import { login, register } from "../services/log";

const mode = ref("login"); 
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const fullName = ref(""); 
const confirm = ref("");

const loading = ref(false);
const message = ref(null);    
const error = ref(null);      

// Validations basiques
const emailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));
const passwordStrength = computed(() => {
const p = password.value;

    let score = 0;
    if (p.length >= 8) score++;                               
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
  
    return score; // 0..5
});
const passwordHint = computed(() => {
  const s = passwordStrength.value;
  return ["Très faible","Faible","Moyen","Bon","Fort","Excellent"][s] || "Très faible";
});
const canSubmit = computed(() => { 
  if (!emailValid.value || password.value.length < 6 || loading.value) return false;
  if (mode.value === "register") {
    return fullName.value.trim().length >= 2 && confirm.value === password.value;
  }
  return true;
});

async function onSubmit() {
  error.value = null;
  message.value = null;
  loading.value = true;
  try {
    if (mode.value === "login") {
      const user = await login({ email: email.value.trim(), password: password.value });
      message.value = `Bienvenue, ${user.fullName || user.email} ! (token: ${user.token.slice(0,8)}…)`;
      // Ici, dans un vrai projet, on stocke le token et on navigue.
    } else {
      const user = await register({
        email: email.value.trim(),
        password: password.value, 
        fullName: fullName.value.trim(),
      });
      message.value = `Compte créé pour ${user.fullName}. Tu peux maintenant te connecter.`;
      // Bascule auto vers login après inscription
      setTimeout(() => {
        mode.value = "login";
        password.value = "";
        confirm.value = "";
      }, 1000);
    }
  } catch (e) {
    error.value = e?.message || "Une erreur est survenue.";
  } finally {
    loading.value = false;
  }
}
</script>



<style scoped>
.auth {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 600px at 50% -20%, #eef3ff, #f7f8fc 60%, #ffffff 100%);
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(10, 20, 60, 0.08);
  padding: 20px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tab {
  flex: 1;
  padding: 10px 12px;
  background: #f2f4f8;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .05s ease;
}
.tab.active {
  background: #1f6feb;
  color: white;
}
.tab:disabled { opacity: .6; cursor: not-allowed; }
.form { display: grid; gap: 14px; }
.field { display: grid; gap: 6px; }
label { font-size: 0.9rem; color: #2b2f36; font-weight: 600; }
input {
  padding: 12px 14px;
  border: 1px solid #e5e8ef;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  transition: border-color .15s ease, box-shadow .15s ease;
}
input:focus { border-color: #9ab7ff; box-shadow: 0 0 0 3px rgba(32, 99, 221, 0.15); }
input.invalid { border-color: #ff6b6b; }
.password-row { display: flex; gap: 8px; }
.password-row .ghost {
  white-space: nowrap;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px dashed #d6d9e2;
  background: #f9fafc;
  cursor: pointer;
}
.strength {
  height: 6px; background: #edf1f7; border-radius: 999px; overflow: hidden;
}
.bar {
  height: 100%; background: #1f6feb; width: 0%;
  transition: width .25s ease;
}
.primary {
  margin-top: 4px;
  padding: 12px 14px;
  border: none; border-radius: 10px;
  background: #1f6feb; color: white; font-weight: 700; cursor: pointer;
}
.primary:disabled { opacity: .5; cursor: not-allowed; }
.alert { padding: 10px 12px; border-radius: 10px; font-size: .95rem; }
.alert.error { background: #ffe9e9; color: #9d1f1f; }
.alert.success { background: #e9f9ed; color: #1f7d3a; }
.hint { color: #6b7280; font-size: .85rem; }
.toggle { text-align: center; color: #475569; margin-top: 4px; }
.toggle a { color: #1f6feb; font-weight: 600; }
</style>
