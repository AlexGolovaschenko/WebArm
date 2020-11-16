from django.apps import AppConfig


class ConnectorsConfig(AppConfig):
    name = 'connectors'
    verbose_name = 'Коннекторы'

    def ready(self):
        import connectors.signals