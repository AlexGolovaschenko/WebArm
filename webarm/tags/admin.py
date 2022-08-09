from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import reverse
from django.forms.models import ModelForm

from .models import Tag, ModbusTagParameters

# -------------------------------------------------------------------
# inline form sets
class AlwaysChangedModelForm(ModelForm):
    def has_changed(self):
        """ Should returns True if data differs from initial. 
        By always returning true even unchanged inlines will get validated and saved."""
        return True
        
class ModbusTagParametersInline(admin.TabularInline):
    model = ModbusTagParameters
    form = AlwaysChangedModelForm

# -------------------------------------------------------------------
# admin models
class TagAdmin(admin.ModelAdmin):
    inlines = [ModbusTagParametersInline]
    list_display  = ('code', 'name', 'data_type', 'device_facility', 'device_name')

    def device_facility(self, obj):
        return str(obj.device.facility.name)
    
    def device_name(self, obj):
        return str(obj.device.name)

    device_facility.short_description = 'Объект'
    device_name.short_description = 'Устройство'

# -------------------------------------------------------------------
# registration
admin.site.register(Tag, TagAdmin)
# admin.site.register(HistoricalIntValue)
# admin.site.register(HistoricalFloatValue)
# admin.site.register(CurrentFloatValue)
