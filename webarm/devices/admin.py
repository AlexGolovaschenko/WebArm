from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import reverse
from django.forms.models import ModelForm


from . import choices
from .models import (
        Device, 
        Tag, 
        ModbusTagParameters, 
        ModbusDeviceParameters,
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
class ModbusTagParametersInline(admin.StackedInline):
    model = ModbusTagParameters
    form = AlwaysChangedModelForm


class ModbusDeviceParametersInline(admin.StackedInline):
    model = ModbusDeviceParameters
    form = AlwaysChangedModelForm


class TagsInline(admin.TabularInline):
    model = Tag
    show_change_link = True
    fields = ['code', 'name', 'data_type', 'edit_link']
    readonly_fields = ['edit_link', ]
    extra = 0
    
    def edit_link(self, instance):
        if instance.id:
            url = reverse('admin:devices_tag_change', args=(instance.id,))
        else:
            url = reverse('admin:devices_tag_add')        
        return mark_safe("<a href='%s'>%s</a>" % (url, 'Параметры ModBus'))
    edit_link.short_description = 'Редактировать'


# -------------------------------------------------------------------
# admin models
class DeviceAdmin(admin.ModelAdmin):
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

    class Media:
        css = { "all" : ("devices/css/hide_admin_original.css",) }


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
