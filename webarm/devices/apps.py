from django.apps import AppConfig


class DevicesConfig(AppConfig):
    name = 'devices'
    verbose_name = "Устройства"

    def ready(self):
        import devices.signals