source venv/bin/activate
cd webarm
celery -A webarm worker --concurrency=1 -l info --loglevel=INFO
