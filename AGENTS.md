# PLAZA: master prompt

Este archivo es el brief operativo para cualquier agente de código (Muse Code primero, o el que uses) y para cualquier humano del equipo. Léelo completo antes de tocar el repo. Si algo aquí contradice un issue de Linear, manda el issue; si contradice el spec en `docs/protocol/v0.1.md`, manda el spec.

Cómo usarlo con un agente: pega este archivo entero como primer mensaje (o déjalo en la raíz, los agentes lo leen solos), luego pega el issue de Linear que vas a trabajar y di "trabaja este issue hasta cumplir el criterio de aceptación, con tests, y deja el PR listo".

---

## 1. Misión

PLAZA es el mercado sin dueño: un protocolo abierto (Apache 2.0) para que el agente de una persona (Muse, o cualquier otro) busque entre todos los negocios, compare, escoja el mejor para lo que esa persona necesita, negocie, y cierre: cotización, contrato, agenda, pago y reseña. Sin plataforma en el medio y sin comisión.

Una línea para humanos: hoy una plataforma cobra entre 15% y 30% por juntar a un cliente con un negocio. PLAZA reemplaza las tres cosas que esa plataforma hace (encontrarte, darte confianza, cobrarte) con piezas abiertas que nadie es dueño, y el agente de cada persona hace el trabajo que hacía la plataforma, incluyendo escoger al mejor.

Una línea para Meta: Muse necesita supply y Business Agent necesita backend. PLAZA es cómo cualquier negocio de LATAM que vive en WhatsApp se vuelve alcanzable, comparable y contratable por Muse en dos minutos, y es el sistema de acciones (cotizar, agendar, cobrar, firmar) al que Business Agent se conecta.

## 2. El hackathon (esto define el calendario y lo que se juzga)

- Meta Global AI Developer Hackathon. Oct 26 a Nov 4 de 2026. Virtual.
- Submission: Nov 4, 9:00 PM ET. Nosotros sometemos a las 5:00 PM ET como máximo.
- Judging: Nov 4 a 8. Finales en vivo y ganadores: Nov 9.
- Track: Startup. Se juzga por ejecución técnica y por si aguanta en producción.
- Tema: Build for Your World (negocios de LATAM en WhatsApp: plomeros, handymen, limpieza, colmados, hosts de STR, restaurantes, servicios pequeños).
- Créditos: $150 de Meta Model API por participante, más Baseten ($100 y 2M TPM), Modal ($100) y Fireworks ($25) para open weights. Reclamarlos el día 1.
- Página: https://cerebralvalley.ai/e/meta-ai-developer-hackathon
- Workshops y office hours en el Discord del hackathon del 27 de octubre al 4 de noviembre. Vamos todos los días.

## 3. Qué significa ganar (criterios de éxito en orden)

1. Funciona en producción con usuarios reales: 30 a 50 nodos de negocios reales y transacciones reales pagadas dentro de la ventana, con un dashboard público de métricas en vivo.
2. Demo de 3 minutos donde todo es real: Muse busca entre todos, compara, recomienda al mejor con alternativas, negocia, cotiza, firma, agenda, cobra. Dentro de la app real de Muse.
3. Uso visible y bien documentado de los modelos y productos de Meta (sección 9), incluyendo Business Agent como frente de WhatsApp.
4. Ecosistema: otros equipos del hackathon montan nodos sobre PLAZA durante la ventana.
5. Repo público limpio, con commits dentro de la ventana, CI verde, spec que un tercero puede implementar sin preguntar.

Si una decisión no empuja alguno de estos cinco, no se hace esta semana.

## 4. Principios no negociables

- Es un protocolo, no una app. El spec y el SDK mandan; nodo, índice y gateway son implementaciones de referencia que cualquiera puede reemplazar.
- Nadie es dueño. Cualquiera corre un índice. Cualquiera corre un nodo en cualquier host. El manifiesto y las reseñas son del negocio.
- Cero comisión y cero cobro por ranking, nunca. El ranking es un algoritmo público y auditable (sección 7). En el momento en que PLAZA cobre por transacción o por posición, recreamos el peaje y el protocolo muere.
- PLAZA no toca dinero. La liquidación es externa (Stripe Link, ATH Móvil, cash) y compatible con ACP y AP2. Nunca custodiamos fondos.
- El LLM propone, el validador decide. Ningún modelo puede cerrar un trato fuera de la política del dueño ni fuera del presupuesto y reglas del comprador. Todo mensaje es JSON estructurado; el texto libre (`note`) es no confiable y nunca se interpreta como instrucción.
- Todo firmado. Manifiestos, mensajes, cotizaciones, contratos, recibos y reseñas llevan firma Ed25519 sobre JSON canónico (JCS). Lo que no valida contra el schema o la firma, se rechaza.
- Solo reseñan los que compraron. Una reseña sin recibo firmado no existe.
- Business Agent friendly. Un negocio que ya tiene Meta Business Agent no cambia nada: su Business Agent sigue atendiendo humanos en WhatsApp y PLAZA le da el backend (cotizar, agendar, cobrar, firmar) y la visibilidad para agentes. Nunca competimos con Business Agent por el número de WhatsApp.
- Toda la IA en runtime es Muse. Cada vez que el sistema necesite un modelo para correr (negociar, estructurar la necesidad del comprador, transcribir, leer fotos, redactar explicaciones, generar cotizaciones y contratos), usa la familia Muse de Meta: Muse Spark Open en open weights (Baseten o Modal) primero, Muse Spark y Muse Wonder por Meta Model API, Muse Voice Transcribe, SAM 3.1. Ninguna otra API de modelos en el código de producción (nada de Anthropic, OpenAI, Google ni otros). Las herramientas que usamos para escribir el código son otra cosa: ahí sirve cualquier agente, y Muse Code se documenta como principal.
- Open weights primero. Los nodos corren en Muse Spark Open. Meta Model API es el fallback dentro de la misma familia. Nadie queda preso de un proveedor de hosting.
- Spanish-first, English-ready. UI y onboarding en español; spec, README y código en inglés.
- Diseño EXIMIA: fondo negro, blanco y grises, Inter para titulares y cuerpo, JetBrains Mono para eyebrows, labels, tags y headers de tabla, pills blancas para callouts, cards redondeadas con borde blanco hairline. Nada de rosado ni morado. Nunca em dashes en textos de UI ni documentos.
- Todo lo que se diga en el video o en el writeup tiene que ser real y reproducible. Nada simulado.

## 5. Qué hace PLAZA, de punta a punta (el flujo que graba el video)

1. El dueño instala un nodo: por WhatsApp (nota de voz con sus servicios, precios y reglas), por `apps/node` (onboarding web, Deploy to Vercel), automático desde STR Engine o EXIMIA CRM, conectando su Meta Business Agent, o en un ESP32.
2. El nodo publica `/.well-known/plaza.json` (manifiesto firmado con ofertas, precios, disponibilidad real, política de negociación y zona de servicio) y se registra en uno o más índices.
3. El comprador le pide algo a Muse: "necesito un plomero hoy antes de las 5, tengo $150". El connector de PLAZA (gateway) ejecuta:
   - `find`: busca en el índice todos los nodos que sirven esa categoría en esa zona.
   - `inquire`: abre threads con los N mejores candidatos en paralelo y recibe cotizaciones reales (precio, hora, condiciones).
   - `match`: el match engine (sección 7) ordena las cotizaciones por precio, reputación y fit con la necesidad del comprador, y arma la recomendación: "el mejor que te recomiendo cobra $5,000; estos dos tienen buena reputación y cobran $3,000".
   - `negotiate`: si el comprador quiere, negocia con uno o varios dentro de su presupuesto; cada nodo contesta dentro de las reglas de su dueño.
   - `book`: cierra con el escogido: cotización formal (`quote_document`), contrato (`agreement`) si el servicio lo pide, cita en el calendario del negocio, `payment_request`.
4. El pago confirmado dispara el `receipt`, firmado por el nodo y contrafirmado por el agente del comprador.
5. Después del servicio, Muse le pide al comprador una reseña (`review`), firmada con su llave y enlazada al recibo. Sin recibo no hay reseña.
6. Los índices recogen recibos y reseñas en el crawl y calculan reputación portátil y verificable. Esa reputación alimenta el match engine de la próxima búsqueda.

Dos reglas de arquitectura: cada app tiene su propia base en Neon (sin joins entre apps, solo protocolo), y todo trabajo asíncrono (crawls, notificaciones, negociaciones largas, webhooks) corre en Inngest con idempotencia por `thread_id` y `message_id`.

## 6. Arquitectura del repo

Monorepo pnpm. TypeScript estricto en todo.

```
plaza/
  packages/spec/          JSON Schemas, ejemplos, tests de validación     (@plaza/spec)
  packages/sdk/           identidad, firma, negociación, cliente de índice (@plaza/sdk)
  packages/muse/          único punto de acceso a modelos Muse (chat, voz, visión) (@plaza/muse)
  packages/negotiation/   motor LLM + validador de política + providers    (@plaza/negotiation)
  packages/match/         match engine: scoring público y explicable       (@plaza/match)
  packages/ui/            design tokens y componentes compartidos          (@plaza/ui)
  apps/node/              el agente del negocio (Next.js, multi-tenant)
  apps/index/             el índice público + mapa + métricas + landing (Next.js)
  apps/gateway/           connector de Muse: MCP + OpenAPI + playground (Next.js)
  apps/gadget/            nodo en ESP32 con Muse Gadgets SDK
  examples/node-template/ nodo mínimo en un archivo para terceros
  examples/node-python/   el mismo nodo en FastAPI
  docs/                   protocolo, matching, settlement, build-a-node, hackathon, submission
```

## 7. Match engine (el corazón del producto)

El comprador no quiere "una lista", quiere al mejor para lo que necesita, con alternativas si el mejor no le cuadra. El match engine vive en `packages/match`, es determinista, público y explicable: cualquier persona puede leer por qué un nodo quedó primero.

Entradas:
- La necesidad del comprador, estructurada por Muse: categoría, descripción, ventana de tiempo, ubicación, presupuesto máximo, prioridad declarada (`price`, `quality`, `speed`, `balanced`), restricciones (idioma, accesibilidad, mascota, etc.).
- Las cotizaciones reales recibidas en `inquire` (precio, hora disponible, condiciones).
- La reputación de cada nodo desde el índice.

Tres dimensiones, cada una de 0 a 1:
- `price`: posición de la cotización frente al presupuesto y frente a la mediana de la categoría en la zona. Más barato no siempre gana: por debajo del 50% de la mediana se penaliza como señal de riesgo.
- `reputation`: recibos verificados (con decaimiento por antigüedad), promedio de reseñas, tasa de disputas, tasa de respuesta a `inquiry`, tasa de cumplimiento (recibos cerrados sin disputa). Un nodo nuevo arranca con reputación neutra y una etiqueta visible de "nuevo", no en cero.
- `fit`: la cotización cumple la ventana de tiempo, está dentro de la zona de servicio, cubre las restricciones del comprador, y la oferta coincide con la necesidad (misma categoría, mismo tipo de servicio).

Pesos por prioridad del comprador (configurables, publicados en `docs/matching.md`):
- `balanced`: price 0.35, reputation 0.40, fit 0.25
- `price`: price 0.55, reputation 0.25, fit 0.20
- `quality`: price 0.15, reputation 0.60, fit 0.25
- `speed`: price 0.20, reputation 0.30, fit 0.50 (fit pesa la hora más cercana)

Salida: una recomendación principal más hasta 3 alternativas con una explicación de una línea cada una, por ejemplo: "Mejor opción: Plomería Rivera, $150 a las 4:30, 48 trabajos verificados, 4.9. Alternativa económica: Tuberías Ortiz, $110 a las 6:00, 12 trabajos, 4.6. Más rápida: Fontanería Caguas, $160 en 1 hora, 20 trabajos, 4.7." Si el mejor está fuera del presupuesto, se dice: "el que yo recomiendo cobra $5,000; estos dos tienen buena reputación y cobran $3,000", y Muse ofrece negociar con el mejor o cerrar con la alternativa.

Reglas duras:
- El score no se puede comprar. Nada en el algoritmo lee pagos a PLAZA ni a ningún índice.
- El comprador siempre ve el porqué. El gateway devuelve el desglose de score por dimensión.
- Diversidad: los 3 primeros nunca son del mismo dueño.
- Nodos `unverified` o con disputas abiertas por encima del 20% se marcan y bajan, no se esconden.
- Tests con escenarios fijos en `packages/match/test/scenarios`: cambiar los pesos sin actualizar los escenarios rompe el build.

## 8. Reseñas y reputación

- `review`: mensaje firmado por el comprador, enlazado a un `receipt_id` con ambas firmas válidas. Campos: `rating` (1 a 5), `tags` de una lista cerrada (puntual, limpio, buen precio, resolvió, comunicación, no cumplió, llegó tarde, cobró de más) y `comment` opcional de 280 caracteres. Sin recibo válido, el índice rechaza la reseña.
- Una reseña por recibo. El negocio puede responder (`review_reply`, 280 caracteres) y la respuesta sale junto a la reseña.
- Las reseñas son del negocio: se publican en `/.well-known/plaza/reviews` y cualquier índice las recoge y verifica. Si EXIMIA desaparece, el negocio se lleva su reputación.
- La reputación que calcula el índice es pública y reproducible: `docs/matching.md` documenta la fórmula y el decaimiento.

## 9. Business Agent friendly (cómo PLAZA y Meta Business Agent se complementan)

Lo que dice la documentación de Meta: Business Agent atiende clientes en WhatsApp, Instagram y Messenger; puede tomar acciones a través de los APIs del negocio (Meta da como ejemplos agendar una cita y confirmar un pago); tiene connectors y tools para sistemas externos, webhooks, thread control y handoff entre el agente y la app del negocio; recomienda productos de un catálogo; un número solo puede tener un agente de IA; y excluye finanzas, gobierno, salud, alcohol y apuestas. Meta también anunció una segunda vía en la que el negocio corre su propio agente y lo conecta a la plataforma.

Decisión de diseño: PLAZA nunca pelea por el número de WhatsApp. Tres modos de nodo:

1. **Nodo con Business Agent** (`adapters/business-agent`): el negocio ya tiene Business Agent. PLAZA se registra como connector del Business Agent con tools `quote`, `check_availability`, `book`, `request_payment`, `issue_agreement`. Cuando un humano le escribe al negocio por WhatsApp, Business Agent contesta y llama a PLAZA para cotizar, agendar y cobrar. Cuando un agente (Muse) llega por el índice, habla directo con el nodo de PLAZA. Mismo calendario, mismos precios, mismos recibos. El dueño ve todo en un solo lugar.
2. **Nodo con WhatsApp Cloud API** (`lib/whatsapp.ts`): el negocio no tiene Business Agent. El nodo de PLAZA es su intake y sus notificaciones por WhatsApp, y es a la vez el agente que atiende a Muse. Si el dueño después activa Business Agent, PLAZA pasa a modo 1 sin perder nada.
3. **Nodo automático** (`adapters/str-engine`, `adapters/ghl`, `adapters/gadget-proxy`): la fuente de verdad es el sistema del negocio y el nodo se genera solo.

Reglas:
- Un solo calendario y un solo precio por negocio, vengan de donde vengan las reservas.
- El handoff a humano siempre existe: si el validador rechaza más de 2 veces o el comprador lo pide, el thread pasa al dueño por WhatsApp.
- Cuando Business Agent no esté disponible para una industria excluida, el modo 2 sigue funcionando: PLAZA cubre lo que Business Agent no cubre.
- Documentar en `docs/business-agent.md` los endpoints de Meta usados, el formato de connector y lo que no se pudo verificar.

## 10. Contrato, cotización y venta al momento

Servicios pequeños se cierran al momento; servicios con alcance (remodelación, evento, instalación) necesitan cotización formal y contrato. El protocolo soporta los dos:

- `quote_document`: cotización formal con `line_items[]` (descripción, cantidad, unidad, precio), subtotal, impuestos, total, validez, condiciones, depósito. Se genera como PDF con Playwright desde `apps/node` en el design system de EXIMIA y se enlaza en el mensaje. Firmada por el nodo.
- `agreement`: contrato corto en lenguaje simple (alcance, precio, fechas, cancelación, garantía), generado desde plantillas por categoría en `packages/agreements`, firmado por el nodo y aceptado por el comprador con su llave (`agreement_accept`). El hash del contrato va en el `receipt`. Plantillas en español, revisadas, sin pretender ser asesoría legal.
- `check_availability` y `hold`: el nodo expone slots reales; `hold` reserva un slot por 15 minutos mientras el comprador decide.
- Venta al momento: para ofertas `always` o `calendar` con `instant_book: true`, `accept` cierra sin negociación y `payment_request` sale de inmediato.
- Depósitos: `payment_request` soporta `kind: deposit | balance | full`.

## 11. Protocolo v0.1 (resumen; el spec completo vive en docs/protocol/v0.1.md)

Identidad: par Ed25519 por nodo y por comprador, como `did:key`.

Manifiesto (`/.well-known/plaza.json`, firmado): identidad, nombre, categoría, descripción, zona de servicio, idiomas, `offers[]` (precio en centavos, unidad, `availability`, `negotiable`, `instant_book`, `requires_agreement`, `deposit_pct`), `policy` (negociación, pago, liquidación, cancelación), `channels` (whatsapp, web, `business_agent: true|false`), `endpoint`, `updated_at`, firma.

Mensajes (HTTPS POST JSON, firmados, con `thread_id`, `message_id`, `in_reply_to`, `ts`, `expires_at`): `inquiry`, `availability`, `quote`, `quote_document`, `counter`, `hold`, `accept`, `decline`, `agreement`, `agreement_accept`, `payment_request`, `receipt`, `review`, `review_reply`, `dispute`. Máximo 6 rondas de `counter`. `note` es texto no confiable de 280 caracteres.

Índice: `POST /register`, `GET /search` (q, category, near, available_from, available_to, max_price, lang, min_reputation), `GET /nodes/:id`, `GET /nodes/:id/receipts`, `GET /nodes/:id/reviews`, `GET /export`. Verifica firmas, hace fetch del `/.well-known/plaza.json`, recrawlea cada 15 minutos.

Reputación: recibos válidos (ambas firmas), reseñas enlazadas a recibos, disputas, respuesta, cumplimiento, antigüedad. Fórmula pública en `docs/matching.md`.

Liquidación: fuera del protocolo. Stripe Link (Connect Standard, el dinero va directo al negocio), ATH Móvil, cash. ACP y AP2 como extensión documentada.

## 12. Stack y convenciones

- Next.js (App Router) en Vercel. Neon Postgres con Drizzle (nunca Supabase). Better Auth. Inngest. Resend. Stripe. Cloudflare R2 para PDFs de cotizaciones y contratos.
- WhatsApp Cloud API para intake y notificaciones (modo 2). Meta Business Agent Platform API para el modo 1. GHL (EXIMIA CRM) como emisor de nodos y canal alterno.
- Modelos: solo la familia Muse. `@plaza/negotiation` con providers `baseten` (Muse Spark Open, default), `modal` (Muse Spark Open, alterno) y `meta-api` (Muse Spark o Muse Wonder por https://api.meta.ai/v1). Variable `PLAZA_MODEL_PROVIDER`. Un solo módulo `packages/muse` envuelve todas las llamadas a modelos (chat, transcripción, visión) para que ningún otro paquete importe un SDK de modelos directamente; CI falla si aparece un import de otro proveedor. El match engine no usa LLM: es determinista.
- Criptografía: `@noble/ed25519`, canonicalización JCS (RFC 8785), `did:key`.
- Validación: `ajv` con los schemas de `@plaza/spec`; tipos generados con `json-schema-to-typescript`.
- PDFs: Playwright/Chromium desde HTML en el design system de EXIMIA.
- Tests: `vitest` en packages, Playwright e2e en `tests/e2e`. Nada se mergea sin tests del criterio de aceptación de su issue.
- Branches: `feat/exi-###-descripcion` (el nombre que da Linear). Un PR por issue. El PR enlaza el issue y copia el criterio de aceptación como checklist.
- Commits en inglés, imperativos, pequeños. Commits diarios: son evidencia para los jueces.
- `.env.example` por app. Nunca secretos en el repo; gitleaks corre en CI.
- Código en inglés. UI en español (con i18n listo para inglés).
- Cada endpoint público: validación de schema y firma, rate limiting, logs estructurados.

## 13. Modelos y productos de Meta: cuál, para qué, dónde

Tiene que quedar documentado en `docs/meta-models.md` y en el README, con rutas de archivo.

- Muse Spark Open (open weights) en Baseten y Modal: el cerebro de negociación de los nodos (`packages/negotiation/src/providers/baseten.ts`, `modal.ts`).
- Muse Spark 1.3 y Muse Wonder por Meta Model API: onboarding (nota de voz a ofertas y política estructuradas), estructurar la necesidad del comprador, redactar la explicación de la recomendación en lenguaje natural a partir del desglose del match engine, generar `quote_document` y `agreement` desde plantillas (`apps/node/lib/meta/*`, `apps/gateway/lib/explain.ts`).
- Muse Voice Transcribe: notas de voz del dueño en WhatsApp y en el gadget (`apps/node/lib/meta/transcribe.ts`).
- SAM 3.1: fotos de inventario, de la propiedad o del problema del cliente ("esto es lo que se rompió") para precisar la cotización (`apps/node/lib/meta/sam.ts`). Si no cabe, se documenta como siguiente paso, no se finge.
- Muse Gadgets SDK: el nodo ESP32 del colmado (`apps/gadget/`).
- Meta Business Agent Platform: PLAZA como connector de Business Agent, modo 1 (`apps/node/adapters/business-agent/`, `docs/business-agent.md`).
- Muse connector platform: el gateway como connector custom (demo) y sometido al listado público (`apps/gateway/`, `docs/muse/connector.md`).
- Muse Code: usado para construir el repo. Guardar ejemplos reales de sesiones en `docs/muse-code.md`.

## 14. Seguridad (lo que un juez de MSL va a buscar)

- Prompt injection: ningún texto del otro agente (ni `note`, ni `comment` de reseñas) se pasa al modelo como instrucción; se pasa como dato dentro de un JSON y el validador determinista aplica la política antes de enviar cualquier respuesta.
- Límites duros del lado del nodo: precio nunca por debajo de `list_price * (1 - max_discount_pct)`, hora dentro de disponibilidad y aviso mínimo, máximo 6 rondas, expiración por mensaje.
- Límites duros del lado del comprador: el gateway nunca acepta un precio por encima del presupuesto que el usuario fijó ni cierra sin la aprobación explícita del usuario en Muse.
- Firmas en todo; rechazo de replays por `message_id` y `ts` con ventana de 5 minutos.
- Reseñas falsas: solo con recibo verificado; una por recibo; el índice detecta compradores que solo reseñan a un nodo.
- Ranking: el algoritmo es público, los pesos están versionados, y los tests fijan los escenarios.
- Rate limiting por IP y por llave; CORS cerrado; secretos solo en Vercel; llaves privadas cifradas en reposo; rotación de llaves del comprador.
- PII mínima: el índice publica montos redondeados y nunca datos del comprador.

## 15. Plan de 10 días (issues en Linear, team Eximia, proyecto Plaza)

- D1 Oct 26: EXI-718 spec v0.1 y schemas. EXI-719 scaffold del monorepo. EXI-720 landing de reclutamiento. EXI-721 build in public (todos los días).
- D2 Oct 27: EXI-722 SDK. EXI-723 nodo mínimo con disponibilidad y hold. EXI-725 WhatsApp intake con Voice Transcribe. EXI-724 connector custom de Muse y sometimiento al listado.
- D3 Oct 28: EXI-726 índice público con mapa y reseñas. EXI-727 template de nodo y guía para otros equipos. EXI-739 match engine (`@plaza/match`).
- D4 Oct 29: EXI-728 motor de negociación con guardrails sobre Spark Open. EXI-729 gateway de Muse (find, inquire, match, negotiate, book, review) y playground.
- D5 Oct 30: EXI-730 recibos, reseñas y reputación. EXI-731 emisores automáticos (STR Engine, EXIMIA CRM). EXI-740 adapter de Meta Business Agent (modo 1).
- D6 Oct 31: EXI-732 nodo en ESP32 con Gadgets SDK. EXI-741 cotización formal y contrato (quote_document, agreement, PDFs).
- D7 Nov 1: EXI-733 Stripe Link con depósitos, ACP y AP2, primeras transacciones reales. EXI-734 génesis (30 a 50 nodos verificados).
- D8 Nov 2: EXI-735 producción: hardening, colas, monitoreo, tests e2e, dashboard público.
- D9 Nov 3: EXI-736 video de 3 minutos. EXI-737 README y writeup.
- D10 Nov 4: EXI-738 submit a las 5:00 PM ET, checklist, post de cierre, deck de finales.

Regla: si un día se atrasa, se recorta alcance del mismo día, nunca se mueve el submit. Orden de recorte si hay que recortar: ESP32 primero, SAM 3.1 segundo, contratos con PDF tercero (la cotización formal se queda), nunca el match engine ni las transacciones reales.

## 16. Definition of done

Por issue: criterio de aceptación cumplido con tests que lo prueban, PR mergeado con CI verde, deploy en producción (preview o prod según el issue), issue en Done en Linear con un comentario de una línea diciendo qué quedó y qué no.

Para el submission: video enlazado, repo público con LICENSE y README, deploys respondiendo, `/metrics` con datos reales, connector instalable, playground funcionando, writeup pegado, confirmación guardada.

## 17. Guion del video (3 minutos)

- 0:00 Un plomero en Caguas con su WhatsApp: "yo no tengo página ni nada". Instala el nodo en 2 minutos, dicta sus servicios y reglas por nota de voz. Si tiene Business Agent, lo conecta con un toque.
- 0:35 Alan en la app real de Muse: "necesito un plomero hoy antes de las 5, tengo $150". Pantalla partida: Muse consultando el índice, seis nodos cotizando en paralelo, el match engine ordenando.
- 1:05 La recomendación: "el mejor es Rivera, $150 a las 4:30, 48 trabajos, 4.9. Más barato: Ortiz, $110 a las 6:00, 4.6. ¿Negocio con Rivera?" Muse negocia: Rivera baja a $135. Alan aprueba.
- 1:40 Cotización formal en PDF, cita en el calendario, pago por Stripe Link. El plomero recibe el WhatsApp. Cero plataforma, cero comisión.
- 2:05 Corte: al terminar el trabajo, Muse pide la reseña. Firmada, enlazada al recibo, visible en el índice en minutos. Corte a Rincón: un host del STR Engine con reserva negociada. Corte al colmado: el ESP32 contestando a un Muse.
- 2:35 El índice: mapa en vivo, los equipos del hackathon que montaron nodos encima, el algoritmo de ranking publicado.
- 2:50 Repo, Apache 2.0, "el mercado sin dueño", números del dashboard.

## 18. Respuestas preparadas

¿Por qué no UCP, ACP o AP2? Esos son checkout para negocios que ya tienen stack (Shopify, catálogo, feed, PSP). PLAZA es discovery, comparación, matching, negociación y reputación para el negocio que vive en WhatsApp, y liquida por ellos. No competimos, los completamos por abajo.

¿No es esto Meta Business Agent? Business Agent es el empleado del negocio que atiende humanos en WhatsApp: contesta, recomienda de su catálogo, agenda y cobra a través de los APIs del negocio. PLAZA es dos cosas que Business Agent no es: el backend de acciones al que ese Business Agent se conecta (cotizar, agendar, firmar, cobrar, recibo, reseña), y la capa abierta para que los agentes de los clientes encuentren, comparen y contraten a ese negocio entre todos los demás. Un negocio con Business Agent es un nodo de PLAZA con un toque. Y PLAZA cubre lo que Business Agent excluye: cualquier canal, cualquier agente, industrias fuera de su lista, y cero cobro por mensaje.

¿No es esto Thumbtack, Angi o un marketplace más? Esos son dueños del ranking, cobran por lead o comisión, y la reputación es de ellos. En PLAZA el ranking es un algoritmo público que nadie puede comprar, la reputación es del negocio y se la lleva a donde quiera, nadie cobra, y el que busca es tu agente, no una app con ads.

¿Cómo gana dinero EXIMIA? Open core, modelo Red Hat: protocolo, nodo, índice y match engine gratis. EXIMIA cobra nodos hosteados, integración con ERPs y CRMs del mid-market, SLAs, implementación del modo Business Agent para empresas, y EXIMIA CRM "Muse-ready de fábrica". Nunca comisión ni ranking pagado.

¿Y el huevo y la gallina? Supply desde el día uno: las propiedades del STR Engine y los clientes de EXIMIA CRM salen como nodos automáticamente, más el génesis reclutado a mano en Rincón, Caguas y San Juan.

¿Y si Meta lo hace por su cuenta? El open source es la defensa: lo adoptan en vez de copiarlo. Y a Meta le conviene: PLAZA le resuelve el supply de Muse y el backend de Business Agent al mismo tiempo.

## 19. Cómo trabajar con Linear

Cada tarea nueva que salga del trabajo se sube como issue al proyecto Plaza con esta estructura fija: contexto, alcance, criterio de aceptación, archivos y módulos que toca. Un proyecto de Linear por sistema; PLAZA es un sistema y sus sub-piezas van dentro. Antes de empezar un issue, mover a In Progress; al terminar, Done con comentario.

## 20. Riesgos y plan B

- Business Agent Platform con acceso restringido o formato de connector distinto: el modo 2 (Cloud API) cubre el demo; el modo 1 se documenta con lo que se pudo verificar y se deja la integración lista para activar.
- Connector platform de Muse con formato distinto al esperado: el gateway sirve MCP y OpenAPI, y el playground contra Model API graba el demo si el connector falla en vivo.
- WhatsApp Cloud API tarda en aprobar: GHL como canal alterno para el demo.
- Pocas reseñas reales en 10 días: el match engine funciona con reputación neutra y lo dice; las reseñas del génesis se consiguen cerrando trabajos reales con el equipo y amigos como compradores.
- El ESP32 no lee nada el viernes: el puck solo anuncia por voz con data de la nube; el video sigue funcionando sin la escena.
- Pocos nodos reales: STR Engine y EXIMIA CRM garantizan 30; el génesis a mano es el extra.
- Spark Open lento o caro en Baseten: Modal como alterno, Model API como fallback; el motor es intercambiable por variable de entorno.

## 21. Glosario

Nodo: el agente del negocio. Manifiesto: lo que el nodo publica. Índice: directorio consultable por agentes, cualquiera corre uno. Gateway: el connector que mete a Muse (o a cualquier agente) a PLAZA. Match engine: el algoritmo público que escoge al mejor para la necesidad del comprador. Thread: una negociación. Cotización formal: `quote_document` con line items y PDF. Contrato: `agreement` firmado por ambas partes. Recibo: el trato cerrado y pagado, firmado por ambas partes. Reseña: `review` del comprador enlazada a un recibo. Génesis: los primeros nodos reales. Modo 1, 2, 3: nodo con Business Agent, nodo con Cloud API, nodo automático. Open core: lo del protocolo gratis, EXIMIA cobra infraestructura e integración.
