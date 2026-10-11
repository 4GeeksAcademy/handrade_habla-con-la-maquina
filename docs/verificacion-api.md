# Verificación de la conexión con la API de Groq

## Comando utilizado

El comando carga las variables desde `.env.local` sin imprimir la clave:

```bash
set -a; source .env.local; set +a; curl -s -w "\nHTTP %{http_code}\n" https://api.groq.com/openai/v1/chat/completions -H "Authorization: Bearer $NEXT_PUBLIC_GROQ_API_KEY" -H "Content-Type: application/json" -d "{\"model\":\"$NEXT_PUBLIC_GROQ_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Responde solo: OK\"}]}"
```

## Resultado

- Estado HTTP: `200`
- Modelo: `qwen/qwen3.8-27b`
- Contenido: `OK`
- Uso: `prompt_tokens: 17`, `completion_tokens: 2`, `total_tokens: 19`

## Nota sobre el modelo

El error inicial `404 model_not_found` se debió a usar `qwen/qwen3.6-27b`, indicado en el enunciado. Se corrigió con `qwen/qwen3.8-27b`, disponible en la cuenta.

## Seguridad

La clave se lee desde `.env.local`; el comando no la imprime. La clave nunca se imprime ni se sube al repositorio.
