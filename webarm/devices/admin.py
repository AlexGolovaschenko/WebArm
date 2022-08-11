from django.contrib import admin
from django_reverse_admin import ReverseModelAdmin

from .models import Device


# -------------------------------------------------------------------
# admin models
class DeviceAdmin(ReverseModelAdmin):
    list_display  = ('name', 'company_owner', 'company_name', 
        'facility_name', 'connector')

    inline_type = 'tabular'
    inline_reverse = [
        'protocol_mb_rtu', 
        'protocol_mb_ascii', 
        'protocol_mb_tcp'
        ]          

    def company_owner(self, obj):
        return str(obj.facility.company.owner)
    
    def company_name(self, obj):
        return str(obj.facility.company.name)

    def facility_name(self, obj):
        return str(obj.facility.name)

    company_owner.short_description = 'Владелец'
    company_name.short_description = 'Компания'
    facility_name.short_description = 'Объект'

    class Media:
        css = { "all" : ("devices/css/hide_admin_original.css",) }


# -------------------------------------------------------------------
# registration
admin.site.register(Device, DeviceAdmin)



# -------------------------------------------------------------------
# class TagsInline(admin.TabularInline):
#     model = Tag
#     show_change_link = True
#     fields = ['code', 'name', 'data_type', 'edit_link']
#     readonly_fields = ['edit_link', ]
#     extra = 0
    
#     def edit_link(self, instance):
#         if instance.id:
#             url = reverse('admin:devices_tag_change', args=(instance.id,))
#         else:
#             url = reverse('admin:devices_tag_add')        
#         return mark_safe("<a href='%s'>%s</a>" % (url, 'Параметры ModBus'))
#     edit_link.short_description = 'Редактировать'

# admin models
# class TagAdmin(admin.ModelAdmin):
#     inlines = [ModbusTagParametersInline]
#     def get_model_perms(self, request):
#         """
#         Return empty perms dict thus hiding the model from admin index.
#         """
#         return {}