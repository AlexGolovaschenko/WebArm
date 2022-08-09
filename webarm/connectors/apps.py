from django.apps import AppConfig


class ConnectorsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'connectors'
    verbose_name = 'Коннекторы'

    def ready(self):
        import connectors.signals