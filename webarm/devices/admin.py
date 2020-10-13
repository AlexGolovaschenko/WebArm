from django.contrib import admin
from django.utils.html import mark_safe
from django.urls import reverse
from django.forms.models import ModelForm

from .models import Device, Tag, ModbusTagParameters, ModbusDeviceParameters
from . import choices

# -------------------------------------------------------------------
# custom forms
class AlwaysChangedModelForm(ModelForm):
    def has_changed(self):
        """ Should returns True if data differs from initial. 
        By always returning true even unchanged inlines will get validated and saved."""
        return True
        

# -------------------------------------------------------------------
# inline form sets
class TagsInline(admin.TabularInline):
    model = Tag
    show_change_link = True
    fields = ['code', 'name', 'change_link']
    readonly_fields  = [ 'change_link']
    extra = 0

    def change_link(self, obj):
        if obj.id:
            return mark_safe('<a href="%s">Редактировать</a>' % \
                            reverse('admin:devices_tag_change',
                            args=(obj.id,)))
        else:
            return mark_safe('<a href="%s">Создать</a>' % \
                            reverse('admin:devices_tag_add'))            

class ModbusTagParametersInline(admin.StackedInline):
    model = ModbusTagParameters
    form = AlwaysChangedModelForm

class ModbusDeviceParametersInline(admin.StackedInline):
    model = ModbusDeviceParameters
    form = AlwaysChangedModelForm


# -------------------------------------------------------------------
# admin models
class DeviceAdmin(admin.ModelAdmin):
    inlines = [ModbusDeviceParametersInline, TagsInline]

    class Media:
        css = {
            'all': ('devices/custom_admin.css', )     # Include extra css
        }

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
