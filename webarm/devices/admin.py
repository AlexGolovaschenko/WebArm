from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import reverse
from django.forms.models import ModelForm

from nested_inline.admin import NestedStackedInline, NestedModelAdmin, NestedTabularInline


from . import choices
from .models import (
        Device, 
        Tag, 
        ModbusTagParameters, 
        ModbusDeviceParameters, 
        # CurrentFloatValue,
        # HistoricalIntValue, 
        # HistoricalFloatValue 
    )


# -------------------------------------------------------------------
# custom forms
class AlwaysChangedModelForm(ModelForm):
    def has_changed(self):
        """ Should returns True if data differs from initial. 
        By always returning true even unchanged inlines will get validated and saved."""
        return True
        

# -------------------------------------------------------------------
# inline form sets
class ModbusTagParametersInline(NestedStackedInline):
    model = ModbusTagParameters
    form = AlwaysChangedModelForm

class ModbusDeviceParametersInline(NestedStackedInline):
    model = ModbusDeviceParameters
    form = AlwaysChangedModelForm

class TagsInline(NestedTabularInline):
    model = Tag
    show_change_link = True
    fields = ['code', 'name', 'data_type']
    extra = 0
    inlines = [ModbusTagParametersInline] 
    

# -------------------------------------------------------------------
# admin models
class DeviceAdmin(NestedModelAdmin):
    inlines = [ModbusDeviceParametersInline, TagsInline]
    list_display  = ('name', 'company_owner', 'company_name', 'facility_name', 'connector')

    def company_owner(self, obj):
        return str(obj.facility.company.owner)
    company_owner.short_description = 'Владелец'

    def company_name(self, obj):
        return str(obj.facility.company.name)
    company_name.short_description = 'Компания'

    def facility_name(self, obj):
        return str(obj.facility.name)
    facility_name.short_description = 'Объект'


class TagAdmin(admin.ModelAdmin):
    inlines = [ModbusTagParametersInline]
    def get_model_perms(self, request):
        """
        Return empty perms dict thus hiding the model from admin index.
        """
        return {}


# -------------------------------------------------------------------
# registration
admin.site.register(Device, DeviceAdmin)
admin.site.register(Tag, TagAdmin)
# admin.site.register(HistoricalIntValue)
# admin.site.register(HistoricalFloatValue)
# admin.site.register(CurrentFloatValue)
