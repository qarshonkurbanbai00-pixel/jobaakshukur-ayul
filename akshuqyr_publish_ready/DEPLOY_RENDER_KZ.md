# Ақшұқыр — Цифрлық шежіре: жариялау нұсқаулығы

## 1) GitHub-қа жүктеу
1. GitHub-та жаңа репозиторий жасаңыз (мысалы, `akshuqyr-digital-shejire`).
2. Осы ZIP ішіндегі файлдарды ашып, БАРЛЫҚ файлдар мен қалталарды репозиторийдің негізгі деңгейіне жүктеңіз. `app.py`, `requirements.txt`, `render.yaml`, `data/`, `templates/`, `static/` бір деңгейде тұруы керек.
3. Commit changes жасаңыз.

## 2) Render-ге жариялау
1. https://render.com/ ашып, GitHub арқылы кіріңіз.
2. New + → Blueprint таңдаңыз (немесе New → Web Service).
3. Репозиторийді таңдаңыз. `render.yaml` болса Blueprint deployment ұсынылады.
4. Free жоспарын таңдаулы қалдырып, құру/Deploy түймесін басыңыз.
5. Build аяқталғанша күтіңіз. Render берген `https://...onrender.com` сілтемесі — жарияланған сайт.

Web Service-ті қолмен ашсаңыз:
- Runtime: Python 3
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`

## Ескерту
- Бұл Flask серверлік қолданба, сондықтан Vercel Static Site түрінде жарияланбайды.
- Render Free қызметі қолданылмай тұрған кезде ұйқы режиміне кетуі мүмкін; алғашқы ашылуы біраз уақыт алуы ықтимал.
- Интернетте жариялар алдында тарихи деректер мен фотоларды қолдануға рұқсат барын тексеріңіз.
