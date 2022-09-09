from django.contrib import admin

from .models import Connector


class ConnectorAdmin(admin.ModelAdmin):
    fields = ('connector_type', 'registration_code', 'token', 'created')
    readonly_fields = ('created', )

admin.site.register(Connector, ConnectorAdmin)