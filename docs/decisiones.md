# Decisiones técnicas

- Modelo: se usa qwen/qwen3.8-27b porque qwen3.6-27b del enunciado no está disponible en la cuenta; se verificó con GET https://api.groq.com/openai/v1/models. No se usó Llama 3 porque ningún modelo Llama de chat aparece en la lista de la cuenta.
- Markdown: se usan `react-markdown` y `remark-gfm` exclusivamente para renderizar respuestas Markdown; no se permite HTML crudo.