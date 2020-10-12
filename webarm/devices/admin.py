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
    inlines_1 = [ModbusDeviceParametersInline, TagsInline]
    inlines_2 = [TagsInline]

    def get_inline_instances(self, request, obj=None):
        inline_instances = []

        if obj is not None and obj.connector_type == choices.CONNECTOR_KAPITONOV_M1:
            inlines = self.inlines_1
        else:
            inlines = self.inlines_2

        for inline_class in inlines:
            inline = inline_class(self.model, self.admin_site)
            if request:
                if not (inline.has_add_permission(request, obj) or
                        inline.has_change_permission(request, obj) or
                        inline.has_delete_permission(request, obj)):
                    continue
                if not inline.has_add_permission(request, obj):
                    inline.max_num = 0
            inline_instances.append(inline)
        return inline_instances

    def get_formsets(self, request, obj=None):
        for inline in self.get_inline_instances(request, obj):
            yield inline.get_formset(request, obj)

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
